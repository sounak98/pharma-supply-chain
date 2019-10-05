const algosdk = require("algosdk");

const atoken = {
  "X-API-Key": "oGUIkhASWf8wS8VRhTAow8lZ2tH8IEfAaYkiEjk7"
};
const aserver = "https://testnet-algorand.api.purestake.io/ps1";
const aport = "";
const algodclient = new algosdk.Algod(atoken, aserver, aport);

const decodeNote = async note => {
  try {
    let decodednote = JSON.stringify(algosdk.decodeObj(note), undefined, 4);
    // console.log(decodednote);
    return decodednote;
  } catch (err) {
    console.log("err", err);
  }
};

export const getCheckpointsFromBatchId = async batchId => {
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound;
  let txs = await algodclient.transactionByAddress(
    batchId,
    endRound - 10000,
    endRound
  );
  var checkpoints = {};
  if (txs["transactions"]) {
    for (let tx of txs["transactions"]) {
      try {
        let note = await decodeNote(tx.note);
        note = JSON.parse(note);
        let _tx = await algodclient.transactionById(note.proof);
        let _note = await decodeNote(_tx.note);
        _note = JSON.parse(_note);
        checkpoints[note.name] = { name: note.name, template: _note };
      } catch (err) {}
    }
  }
  return checkpoints;
};
