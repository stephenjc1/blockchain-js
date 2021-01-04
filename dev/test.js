const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();

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
