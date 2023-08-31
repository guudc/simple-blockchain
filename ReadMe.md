```markdown
# Simple Node.js Blockchain

This project implements a simple blockchain using Node.js. It includes a blockchain client that can send transactions, mine blocks, and retrieve block data. It mines block on an average of 3 seconds

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/guudc/simple-blockchain.git
   cd simple-blockchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the blockchain client:
   ```bash
   npm start
   ```

## Usage

### Blockchain Client

#### Initialize a New Blockchain Client

```javascript
const BlockchainClient = require("./src/controller/blockchain");

// Initialize a new blockchain client with a custom client ID
const client = new BlockchainClient(123);
```

#### Sending a Transaction

```javascript
// Send a transaction
const transaction = {
  timestamp: Date.now(),
  data: "Date goes here"
};

client.sendTransaction(transaction);
```

#### Mining Blocks

```javascript
// Start mining
client.mine();

// Stop mining
client.mine(false);
```


#### Getter Functions

```javascript
// Get the current block number
const blockNumber = client.getBlockNumber();

// Retrieve data of a specific block
const blockData = client.getBlockAt(blockNumber);

// Retrieve data of all blocks
const allBlocks = client.getAllBlocks();
```

## License

This project is licensed under the GNU General Public License - see the [LICENSE](LICENSE) file for details.
```

