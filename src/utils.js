const algosdk = require("algosdk");
require("dotenv").config();

const atoken = {
  "X-API-Key": process.env.API_KEY
};

// for POST transaction
// const ptoken = {
//   "X-API-Key": process.env.API_KEY,
//   "content-type": "application/x-binary"
// };

const aserver = process.env.SERVER;
const aport = "";
const algodclient = new algosdk.Algod(atoken, aserver, aport);
// const p_algodclient = new algosdk.Algod(ptoken, aserver, aport);

const decodeNote = async (sender, txId) => {
  try {
    let tx = await algodclient.transactionInformation(sender, txId);
    let decodednote = JSON.stringify(algosdk.decodeObj(tx.note), undefined, 4);
    return decodednote;
  } catch (err) {
    console.log("err", err);
  }
};

const getCheckpointsFromBatchId = async batchId => {
  let params = await algodclient.getTransactionParams();
  let txs = await algodclient.transactionByAddress(
    batchId,
    params.lastRound - 1000,
    params.lastRound
  );
  var checkpoints = [];
  for (let tx of txs.transactions) {
    try {
      let note = await decodeNote(tx.from, tx.tx);
      note = JSON.parse(note);
      let _tx = await algodclient.transactionById(note.proof);
      let _note = await decodeNote(_tx.from, _tx.tx);
      _note = JSON.parse(_note);
      checkpoints.push({ name: note.name, template: _note });
    } catch (err) {}
  }
  return checkpoints;
};

(async () => {
  let checkpoints = await getCheckpointsFromBatchId(
    "ARP6FRGFDZ42UMVH5JGUODO5ESGYBVHYV6MKMDHZPGBESLC4IHIM6SP5VY"
  );
  console.log(checkpoints);
})().catch(e => {
  console.log(e);
});
