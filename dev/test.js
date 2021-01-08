const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

// TESTING chainIsValidMethod
const bc1 = {
"chain": [
{
"index": 1,
"timestamp": 1610107264759,
"transactions": [],
"nonce": 100,
"hash": "0",
"previousBlockHash": "0"
},
{
"index": 2,
"timestamp": 1610107324299,
"transactions": [],
"nonce": 18140,
"hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
"previousBlockHash": "0"
},
{
"index": 3,
"timestamp": 1610107382795,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "nodeAddress",
"transactionId": "2746cc8deec74c9f86d87072eee2d6ac"
},
{
"amount": 10,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "48b27dfd6fe04444ac1fc6cd5f42fa97"
},
{
"amount": 20,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "1a2787fedd7740d5b081802b1a191f6d"
},
{
"amount": 30,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "253734d1d7314618a1c3334e66556c86"
}
],
"nonce": 186781,
"hash": "0000d195926d2429608fe71d85b8905847b0c2a71a38d7e7df7d6c18341bc4c7",
"previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
},
{
"index": 4,
"timestamp": 1610107424861,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "nodeAddress",
"transactionId": "b6fcbbd9906a49ed9f81256e54d4a768"
},
{
"amount": 40,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "c544e8d84ef34358a480957b021c0665"
},
{
"amount": 50,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "832fc7598b284fb19895ff2606e2b8f1"
},
{
"amount": 60,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "153610c9b406406e978325e6229f9c30"
},
{
"amount": 70,
"sender": "ADHSJDHF789UT",
"recipient": "BJHJSHJKHUV",
"transactionId": "9c274b9091314f1480154cc0e965d338"
}
],
"nonce": 7442,
"hash": "0000cfb969ee8c54df85537f9904f05df0938b25f7a211ba31d0eb0332b29513",
"previousBlockHash": "0000d195926d2429608fe71d85b8905847b0c2a71a38d7e7df7d6c18341bc4c7"
},
{
"index": 5,
"timestamp": 1610107446525,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "nodeAddress",
"transactionId": "0aa505f4ec3c4e1b8de0dbebfd857437"
}
],
"nonce": 11179,
"hash": "0000205da68784a0086e7d3d454b5ac2c8439f1d561c6189637eacd3da0b9348",
"previousBlockHash": "0000cfb969ee8c54df85537f9904f05df0938b25f7a211ba31d0eb0332b29513"
},
{
"index": 6,
"timestamp": 1610107449348,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "nodeAddress",
"transactionId": "eeeb377378f74cfe904f51c2c7967734"
}
],
"nonce": 1902,
"hash": "0000e0710f2522652d48b1211d3781000f74e4514e77880d505b41b7135b5062",
"previousBlockHash": "0000205da68784a0086e7d3d454b5ac2c8439f1d561c6189637eacd3da0b9348"
}
],
"pendingTransactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "nodeAddress",
"transactionId": "e08b994d549e4dc7a4501dccaf1fd53b"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
};

console.log('VALID ', bitcoin.chainIsValid(bc1.chain));

// 1.
// bitcoin.createNewBlock(2921, 'OIFNASDAT', 'OISDFNASD')
// bitcoin.createNewBlock(2821, 'OIFNASDAP', 'OISDFNASY')
// bitcoin.createNewBlock(2721, 'OIFNASDAN', 'OISDFNASU')

// 2.
// bitcoin.createNewBlock(89342, 'A90HDGD6SS', 'A90HDGD6ST')

// bitcoin.createNewTransaction(100, 'STEVE89654', 'IAN89724');

// bitcoin.createNewBlock(123213, 'A90HDGD6SX', 'A90HDGD6SY')


// bitcoin.createNewTransaction(50, 'STEVE89654', 'IAN89724');
// bitcoin.createNewTransaction(400, 'STEVE89654', 'IAN89724');
// bitcoin.createNewTransaction(8000, 'STEVE89654', 'IAN89724');

// bitcoin.createNewBlock(897897, 'A90HDGD6SB', 'A90HDGD6SC')

// console.log(bitcoin.chain[2]);

// 3. HASH TESTING & PROOF OF WORK

// const previousBlockHash = 'ABGHASHDGAS6D7'
// const currentBlockData = [
//   {
//     amount: 10,
//     sender: 'JONAGASGDSD',
//     recipient: 'DEBJASDJHHJ'
//   },
//    {
//     amount: 2000,
//     sender: 'JONAGASGDSD',
//     recipient: 'DEBJASDJHHJ'
//   },
//    {
//     amount: 500,
//     sender: 'JONAGASGDSD',
//     recipient: 'DEBJASDJHHJ'
//   }
// ];

// // console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 2563));


// const nonce = 100;

// HASH LOG
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));

//4. TEST GENESIS BLOCK

// console.log(bitcoin)


//5. TESTING THE MINE ENDPOINT