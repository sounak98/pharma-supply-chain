const algosdk = require("algosdk");
require("dotenv").config();

const atoken =
  "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
const aserver = "http://hackathon.algodev.network";
const aport = 9100;
const algodclient = new algosdk.Algod(atoken, aserver, aport);

//Recover the account
var mnemonic =
  "reveal run crouch next bean six divide mountain saddle boil inject welcome debris error weasel fade mandate urban smooth baby spread fox jaguar ability camp";
var recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);
console.log(recoveredAccount.addr);
//instantiate the algod wrapper
(async () => {
  //Get the relevant params from the algod
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound + parseInt(1000);
  //create a transaction
  //note that the closeRemainderTo parameter is commented out
  //This parameter will clear the remaining funds in an account and
  //send to the specified account if main transaction commits
  let txn = {
    from: recoveredAccount.addr,
    to: "AEC4WDHXCDF4B5LBNXXRTB3IJTVJSWUZ4VJ4THPU2QGRJGTA3MIDFN3CQA",
    fee: params.fee,
    amount: 1000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: new Uint8Array(0)
    //"closeRemainderTo": "IDUTJEUIEVSMXTU4LGTJWZ2UE2E6TIODUKU6UW3FU3UKIQQ77RLUBBBFLA"
  };
  //sign the transaction
  let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);
  // console.log(signedTxn);
  //submit the transaction
  let tx = await algodclient.sendRawTransaction(signedTxn.blob);
  console.log("Transaction : " + tx.txId);

  console.log("checking pending");
  let pending = 0;
  try {
    let pendingTxs = await algodclient.pendingTransactions(0);
    console.log("Pending Txs = " + pendingTxs.totalTxns);
    if (pendingTxs.totalTxns > 0) {
      for (let j = 0; j < pendingTxs.totalTxns; j++) {
        if (pendingTxs.truncatedTxns.transactions[j].from === recoveredAccount.addr) {
          console.log("found a pending");
          pending = 1;
          break;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  console.log(pending);
  params = await algodclient.getTransactionParams();
  await algodclient.statusAfterBlock(params.lastRound+1);
  let x = await algodclient.transactionInformation(recoveredAccount.addr, tx.txId)
  console.log(x);
})().catch(e => {
  console.log(e);
});
