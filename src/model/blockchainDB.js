/*
    Author: Goodness, COAT
    This file specifies the blockchain data structure
    Data structure
    {
        number (int);
        timestamp (Date int);
        data (JSON);
        difficulty (int);
        formerHash (string);
        hash (string);
    }
*/

const crypto = require('crypto');
const fs = require('fs');


//Implements 
class BlockchainDb {
    
    //VARIABLES DECLRATION
    #id = null; //this id helps the class identify which filesystem to save to
    #currentBlockNumber = 0; //holds the current block number
    #blockChainFilePath = null; //holds the file path to store the blockchain data
    #currentBlock = {} //holds the current block data
    #dataDeLimiter = "@_(**973)_(*~``@#'&^%$!#@|>?<" //to seperate block data in the local filesystem
    
    /**
     * Initialize the BlockchainDb instance.
     * @param {number} id - The identifier for this instance.
     * @returns {number} - The assigned id for this instance.
    */
    constructor(id=Math.floor(Math.random() * 10000)) {
        this.#id = id //set the id
        //set the blockchain database path
        this.#blockChainFilePath = __dirname.substring(0, __dirname.indexOf('src')) + `/Database/${id}.bin` 
        //verfiy that the database folder path exists
        if (!fs.existsSync(__dirname.substring(0, __dirname.indexOf('src')) + `/Database/`)) {
            fs.mkdirSync(__dirname.substring(0, __dirname.indexOf('src')) + `/Database/`, { recursive: true });
            fs.writeFileSync(this.#blockChainFilePath, "", 'utf-8');
        }
        else if(!fs.existsSync(this.#blockChainFilePath)){
            //folder path exists but database file don't, create it
            fs.writeFileSync(this.#blockChainFilePath, "", 'utf-8');
        }
        else {
            /*
                get the last block. 
                It would be used in computing the  previous hash of current block
            */
           
            this.#currentBlock = this.getBlockData(-1)
            this.#currentBlockNumber = this.#currentBlock.number
            
        }
        return id
    }

    
    /**
     * Save a new block to the blockchain.
     * it updates the block number also.
     * default is genesis block
     * @param {Object} params - The block parameters.
     * @returns {Object} - The status of the save operation.
    */
    saveBlock(params = {
        timestamp:Date.now(),
        data: {},
        diffculty:2,
        formerHash:"0x00",
        hash:""
    })
    {
        //Verify the data sent
        if(params.timestamp < Date.now()) return {error: true, msg: "Invalid timestamp"}
        //compute the previous hash and block number
        if(this.#currentBlockNumber > 0) {
            params.formerHash = crypto.createHash('sha256').update(JSON.stringify(this.#currentBlock)).digest('hex');
            params.number = this.#currentBlockNumber + 1
        }
        else {
            //use genesis block hash
            params.formerHash = "0x00"
            params.number = 1
        }
        //compute current hash

        //save this params as the cureent block
        this.#currentBlock = params
        this.#currentBlockNumber++ //increase cureent block number
        params.hash = this.computeHash(params)

        //format the data for saving
        params = this.#dataDeLimiter + JSON.stringify(params)
         
         //save to local filesystem
        fs.appendFileSync(this.#blockChainFilePath, params + '\n', 'utf-8');
        return {error: false, status: true}
    }

    /**
     * Compute the hash of a data string
     * @data {JSON} - The data to hash
     * @returns {string} - Hash string
    */
    computeHash(data={}) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    /**
     * Retrieve the data of a specific block.
     * @param {number} blockNumber - The block number to retrieve. | -1 returns the latest | default is 1
     * @returns {string} - The block data as a JSON string.
    */
    getBlockData(blockNumber=1) {
        //read the database file
        let _data = fs.readFileSync(this.#blockChainFilePath, 'utf-8'); 
        //get the last block delimiter starting index
        let _indx = _data.split(this.#dataDeLimiter)
        if(_indx.length > 1) {
            //get the particular block number
            if(blockNumber == -1) return JSON.parse(_indx[_indx.length - 1]) //return the latest
            return JSON.parse(_indx[blockNumber])
        }
        else {
            //no starting data
            return {}
        }
    }
    
    /**
     * Retrieve data of all blocks.
     * @returns {Array} - An array of block data as JSON string.
    */
    getAllBlocks() {
        //read the database file
        let _data = fs.readFileSync(this.#blockChainFilePath, 'utf-8'); 
        let _indx = _data.split(this.#dataDeLimiter)
        _indx.shift() //remove the empty first element
        return _indx
    }

    /**
     * Returns the current block number
     * @returns (int)
     */
    getCurrentBlockNumber() {return this.#currentBlockNumber}
}

exports.BlockchainDb = BlockchainDb
 