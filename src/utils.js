const algosdk = require("algosdk");

const atoken = {
  "X-API-Key": "oGUIkhASWf8wS8VRhTAow8lZ2tH8IEfAaYkiEjk7"
};
const aserver = "https://testnet-algorand.api.purestake.io/ps1";
const aport = "";
const algodclient = new algosdk.Algod(atoken, aserver, aport);

const decodeNote = async (sender, txId) => {
  try {
    let tx = await algodclient.transactionInformation(sender, txId);
    let decodednote = JSON.stringify(
      algosdk.decodeObj(tx.note),
      undefined,
      1000
    );
    return decodednote;
  } catch (err) {
    console.log("err", err);
  }
};

// export const getCheckpointsFromBatchId = async batchId => {
const getCheckpointsFromBatchId = async batchId => {
  let params = await algodclient.getTransactionParams();
  let txs = await algodclient.transactionByAddress(
    batchId,
    params.lastRound - 1000,
    params.lastRound
  );
  var checkpoints = [];
  if (txs.transactions) {
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
  }
  return checkpoints;
};

(async () => {
  let checkpoints = await getCheckpointsFromBatchId(
    "GYSFIKN4UQFI4KPVZCOZHP5YA5VCG556KXYKDODWTPBKOGC3BJN22HIMIE"
  );
  console.log(checkpoints);
})().catch(e => {
  console.log(e);
});
