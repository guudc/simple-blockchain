/*
    Author: Goodness, COAT
    This file handles the blockchain client
    Each object is treated as a blockchain node
    Features
        - Mining
        - sending Transactions
        - Veiwing Blocks
        
    Transaction Data structure
        {
            timestamp
            data
        }
    
    A Block contains a maximum of five transactions

    Using a difficulty of 2. 
    Average mining time is 3 secs
*/

/* IMPORT STATEMENTS */
const {BlockchainDb} = require("../model/blockchainDB")
const fs = require('fs');

class BlockchainClient {

    /* VARIABLES */
    #db = null; //holds the blockchain database
    #txPool = [] //an array holding transactions pending mining
    #timerId = null //holds the timer id to monitor the mining process
    #blockChainDiffuclty = "00" //using a difficulty of three zeros for the POW
    #id = 0; //Client id
    #pauseMiningTillBlockIsAdded = false //A flag that pauses the POW enging until a new block is added

  
    /**
     * Initialize a new blockchain client
     * @params {int} clientId - the id of the client
     */
    constructor(clientId = Math.ceil(Math.random() * 1000)) {
        this.#db = new BlockchainDb(clientId)
        this.#id = clientId
        this.#log("     New blockchain client started with id: " + clientId, true)
        return clientId
    }

    /* MODIFICATION FUNCTIONS */

    /**
     * This function sends a transaction
     * @params {JSON} tx - Transaction data
     */
    sendTransaction(tx=null){
        //verify the transaction data
        if((new Date(tx.timestamp)).getTime() == NaN) return {error: true, msg: "Invalid timestamp"}
        if(!tx.data) return {error: true, msg: "Data field not present"}
        /* add transaction to the transaction pool */
        this.#txPool.push(tx)
    }

    /*
        Mining using POW Consensus engine
        Simulate mining using a simple proof of work consensus algorithm
        Find a number N such that the hash of the block,
        with N appended, starts with a certain number of leading zeros
        @status(Boolean) : Specifies whether to start or stop the mining
    */
    mine(status=true) {
        //clear any previous mining gprocess
        clearInterval(this.#timerId)
        this.#timerId = null
        if(status) {
            //get the current block data
            let oldBlock = this.#db.getBlockData(-1)
            let nonce = 0; //set nonce at zero first, we would increment later
            let blockHash; 
            let t = Date.now()
            //use 5ms as interval to prevent lagging the system
            this.#timerId = setInterval(() => {
                //POW algorithm
                if(!this.#pauseMiningTillBlockIsAdded) {
                    blockHash = this.#db.computeHash(oldBlock.index = nonce);
                    if (blockHash.startsWith(this.#blockChainDiffuclty)) {
                        nonce = 0 //reset nonce
                        this.#pauseMiningTillBlockIsAdded = true //pause the mining
                        //mine new block
                        this.#addNewBlock()
                    }
                    else{nonce++}
                }
            }, 1)
            //display mining started
            this.#log("Mining started for client with id: " + this.#id)
        }
        else {this.#log("Mining stopped")}
    }

    /**
     * This functions adds new blocks from the tx Pool
    */
    #addNewBlock() {
        //get the first five transactions
        let tx = this.#txPool.slice(0, 5)
        //remove the first five transactions from the txpool
        this.#txPool = this.#txPool.slice(5)
        //construct block data
        let block = {
            timestamp:Date.now(),
            data: tx,
            diffculty: this.#blockChainDiffuclty.length,
        }
        this.#db.saveBlock(block)
        this.#log(`Block ${this.#db.getCurrentBlockNumber()} mined with diffculty=${this.#blockChainDiffuclty.length} at ${Date()}`)
        //unpause the mining
        this.#pauseMiningTillBlockIsAdded = false
    }
    
    /**
     * This functions logs out the blockchain activities to a file
     * @params {string} _log - the information to save to log
     * @params {boolean} _new - specifies if this is a new log entry
    */
    #log(_log="", _new=false) {
        console.log(_log)
        if(_new) {
            //start of new log entry
            _log = '\n \n' + "As at " + Date() + '\n' + _log + '\n \n'
        }
        else {
            //appending to old entry
            _log = "As at " + Date() + '\n' + _log + '\n'
        }
        if (!fs.existsSync(__dirname.substring(0, __dirname.indexOf('src')) + `/logs/`)) {
            fs.mkdirSync(__dirname.substring(0, __dirname.indexOf('src')) + `/logs/`, { recursive: true });
       }
        fs.appendFileSync(__dirname.substring(0, __dirname.indexOf('src')) + `/logs/${this.#id}_client.log`, _log, "utf-8")
        
    }

    /* GETTER FUNCTIONS */

    /**
     * @returns {int} - The current block number
     */
    getBlockNumber() { return this.#db.getCurrentBlockNumber()}

    /**
     * Retrieve the data of a specific block.
     * @param {number} number - The block number to retrieve. | -1 returns the latest | default is 1
     * @returns {string} - The block data as a JSON string.
    */
    getBlockAt(number=1) {
        return this.#db.getBlockData(number)
    }

    /**
     * Retrieve data of all blocks.
     * @returns {Array} - An array of block data as JSON string.
    */
    getAllBlocks() {return this.#db.getAllBlocks()}
}

exports.BlockchainClient = BlockchainClient
