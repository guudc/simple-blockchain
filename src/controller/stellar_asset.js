/*
    Author: Goodness, COAT
    This file issues a stellar asset in the testnet     
*/

/* IMPORT */
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
const { STELLAR_PUBLIC_KEY, STELLAR_DISTRIBUTOR_PUBLIC_KEY, STELLAR_PRIVATE_KEY, STELLAR_DISTRIBUTOR_PRIVATE_KEY } = require('../../config');

let guudcToken;

/**
 * Creates a trustline between issuer and distributor
 * for the token created
*/
console.log(StellarSdk.Networks.TESTNET)

const createTrustline = async ()=> {
    //Establish trustline between issuer and distributor
    let receivingKeys = StellarSdk.Keypair.fromSecret(STELLAR_DISTRIBUTOR_PRIVATE_KEY);
    const account = await server.loadAccount(receivingKeys.publicKey())
    //.then(function (receiver) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    //add the changeTrust operations
    .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: guudcToken,
          limit: "1000",
        }),
    )
    // setTimeout is required for a transaction
    .setTimeout(100)
    .build();
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
     
}
/**
 * Mint new tokens to the distributor account
 * @param {int} amount - specify the amount of assets to mint | default is 1
*/
const mintTokens = async (amount=1)=> {
    //set up transaction data
    //Establish trustline between issuer and distributor
    let issuingKeys = StellarSdk.Keypair.fromSecret(STELLAR_PRIVATE_KEY);
    const account = await server.loadAccount(issuingKeys.publicKey())
    //.then(function (receiver) {
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    //add the changeTrust operations
    .addOperation(
        StellarSdk.Operation.payment({
            destination: STELLAR_DISTRIBUTOR_PUBLIC_KEY,
            asset: guudcToken,
            amount: amount + "",
        }),
    )
    // setTimeout is required for a transaction
    .setTimeout(100)
    .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
    return res
}


/**
 * Start the assets creation
 * @param {string} assetName - The name of the asset
 */
const start = (assetName)=> {
    //Create the asset via the issuing account
    guudcToken = new StellarSdk.Asset(assetName, STELLAR_PUBLIC_KEY)
    //create trustline between issuer and distributor
    createTrustline().then(res => {
        if(res.successful) {
            mintTokens(100).then(_res => {
                if(_res.successful) {
                    console.log(`${assetName} Asset issued sucesssfully on the stellar testnet`)
                }
                else {console.log("Something went wrong")}
            })
        }
        else {console.log("Something went wrong")}
    })
}

 
exports.start = start
