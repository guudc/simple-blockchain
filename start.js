/*
    Author: Goodness, COAT
    This file starts the blockchain client
*/

/* IMPORT */
const { BlockchainClient } = require("./src/controller/blockchain")
const { start } = require("./src/controller/stellar_asset")

 
//initialize new blockchain client with a random id
const client = new BlockchainClient(Math.floor(Math.random() * 10))
//start mining
client.mine(true)

//send genesis block tx
client.sendTransaction({
    timestamp: Date.now(),
    data: {
        msg : "This is the genesis block",
        Author: "Amadasun Goodness. COAT"
    }
})
//start a timer to submit random transactions to be mined by the blockchain
setInterval(()=> {
    //send tx every 10 milliseconds
    client.sendTransaction({
        timestamp: Date.now(),
        data: "Random data " + Math.random()
    })
}, 10)

start("Guudc") //issue a stellar asset
 