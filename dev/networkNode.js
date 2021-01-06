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
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added in block ${blockIndex}.`});
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
  res.json({ 
    note: "New block mined successfully",
    block: newBlock
});
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



app.listen(port, function(){
  console.log(`Listening on port ${port}`)
})