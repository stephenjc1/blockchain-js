const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];
const axios = require('axios');
// const promise = require('promise');

const nodeAddress = uuidv4().split('-').join('');

const bitcoin = new Blockchain;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
})
 
app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
  // const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  // res.json({ note: `Transaction will be added in block ${blockIndex}.`});
  res.json({note: `Transaction will be added in block ${blockIndex}.`})
});

// 1.add new trx to pending trx on this node then broadcast to all other nodes on the network.
app.post('/transaction/broadcast', function(req,res) {
  const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    //now request to all other nodes on the network
    requestPromises.push(axios.post(networkNodeUrl + '/transaction', newTransaction));
  });
  Promise.all(requestPromises)
  .then(data=> {
    res.json({ note: 'Transaction created and broadcast successfully.'})
  })
})

app.get('/mine', function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  }
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  //now broadcast new block to all other nodes on the network
  const requestPromises = []
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    requestPromises.push(axios.post(networkNodeUrl + '/receive-new-block', { newBlock: newBlock }));
  })
  Promise.all(requestPromises)
  .then(data => {
    return axios.post(bitcoin.currentNodeUrl + '/transaction/broadcast', { amount: 12.5,
      sender: "00",
      recipient: "nodeAddress"
    })
  })
  .then(data => {
     res.json({ 
    note: "New block mined and broadcast successfully",
    block: newBlock
});
}); 
});

app.post('/receive-new-block', function(req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
  if(correctHash && correctIndex){
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock: newBlock
    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock: newBlock
    });
  }
});

// Registering a node and broadcasting to the network
app.post('/register-and-broadcast-node', function(req,res){
  const newNodeUrl = req.body.newNodeUrl
// register in networkNodes array in blockchain
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

//register newNodeUrl on each networkNodeUrl (using request promise library)
const regNodesPromises = [];
 bitcoin.networkNodes.forEach(networkNodeUrl => {
//eatch fetch or get request needs pushing in, so replace Promise (from request promise library)
// axios.get to return each promise, then promise all takes the array 
// change object just to the body object? where do i use register-node??

regNodesPromises.push(axios.post(networkNodeUrl + '/register-node', { newNodeUrl: newNodeUrl })
);
  });

  // change this to a promise all??
  Promise.all(regNodesPromises)
  .then(data => {
    // use the data to register all the nodes currently in network on the new node
    return axios.post(newNodeUrl + '/register-nodes-bulk', { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl]
    })
    // return Promise(bulkRegisterOptions);
  })
  .then(data => {
    res.json({ note: 'New node registered with network successfully' });
  });
});


// Each node registering the new node
app.post('/register-node', function(req, res) {
const newNodeUrl = req.body.newNodeUrl;
const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
res.json({ note: 'New node registered succesffuly.'})

});

//registering all other nodes on the new node (rmbr, new node is the endpoint being hit)
app.post('/register-nodes-bulk', function(req,res) {
  const allNetworkNodes =  req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: 'Bulk registration successful.'});
});

app.get('/consensus', function(req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    requestPromises.push(axios.get(networkNodeUrl + '/blockchain'));
  })
  Promise.all(requestPromises)
  .then(resp => {
    //returns an array of blockchains hosted on all other nodes. We iterate through to check if any is longer than copy on current node
      const currentChainLength = bitcoin.chain.length;
      let maxChainLength = currentChainLength;
      let newLongestChain = null;
      let newPendingTransactions = null;
    resp.forEach(blockchain => {
      //change variables if  chain length > current chain length
      if(blockchain.data.chain.length > maxChainLength) {
        maxChainLength = blockchain.data.chain.length;
        newLongestChain = blockchain.data.chain;
        newPendingTransactions = blockchain.data.pendingTransactions;
      };
    })
// deciding if we need to replace chain hosted on current node
    if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
      res.json({
        note: 'Current chain has not been replaced.',
        chain: bitcoin.chain
      });
    }
    // else if (newLongestChain && bitcoin.chainIsValid(newLongestChain))
    else  {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: 'This chain has been replaced.',
        chain: bitcoin.chain
      });
    }
  });
});

app.get('/block/:blockHash', function(req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({ block: correctBlock});
});

app.get('/transaction/:transactionId', function(req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block
  });
});

app.get('/address/:address', function(req, res) {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
  res.json({
    addressData: addressData
  });
});

app.get('/block-explorer', function (req, res) {
  res.sendFile('./block-explorer/index.html', { root: __dirname})
})


app.listen(port, function(){
  console.log(`Listening on port ${port}`)
})