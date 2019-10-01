const algosdk = require("algosdk");
require("dotenv").config();

// for GET transaction
const atoken = {
  "X-API-Key": process.env.API_KEY
};

// for POST transaction
const ptoken = {
  "X-API-Key": process.env.API_KEY,
  "content-type": "application/x-binary"
};
const aserver = process.env.SERVER;
const aport = "";
const algodclient = new algosdk.Algod(atoken, aserver, aport);
const p_algodclient = new algosdk.Algod(ptoken, aserver, aport);

const getAccount = mnemonic => {
  return algosdk.mnemonicToSecretKey(mnemonic);
};

const purchaseFarmer = async (
  manufacturer,
  farmer,
  farmerManufactureMultsig,
  farmerManufactureParams,
  purchase
) => {
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound + parseInt(1000);

  let txn = {
    from: farmerManufactureMultsig,
    to: farmer.addr,
    fee: params.fee,
    amount: 600000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(purchase)
  };

  //Sign wiith farmer
  let rawSignedTxn = algosdk.signMultisigTransaction(
    txn,
    farmerManufactureParams,
    farmer.sk
  ).blob;
  //sign with second account
  let twosigs = algosdk.appendSignMultisigTransaction(
    rawSignedTxn,
    farmerManufactureParams,
    manufacturer.sk
  ).blob;

  //submit the transaction
  try {
    let tx = await p_algodclient.sendRawTransaction(twosigs);
    console.log("Transaction : " + tx.txId);
    return tx.txId;
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
};

var manufacturer = getAccount(process.env.MANUFACTURER);
console.log("Manufacturer addr: " + manufacturer.addr);

var farmer = getAccount(process.env.FARMER);
console.log("Farmer addr: " + farmer.addr);

const farmerManufactureParams = {
  version: 1,
  threshold: 2,
  addrs: [manufacturer.addr, farmer.addr]
};

let purchase = {
  seller: {
    name: "John Doe",
    age: 50,
    location: {
      lat: "10",
      lon: "15"
    }
  },
  buyer: {
    name: "Nestle",
    location: {
      lat: "20",
      lon: "45"
    }
  },
  date: "15435434",
  ingredients: [
    {
      name: "carrots",
      quantity: "10",
      price: 10000
    },
    {
      name: "potato",
      quantity: "20",
      price: 25000
    }
  ]
};

const deliverDistributor = async (
  manufacturer,
  transport,
  distributor,
  deliveryMultisig,
  deliveryParams,
  delivery
) => {
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound + parseInt(1000);
  let txn = {
    from: deliveryMultisig,
    to: manufacturer.addr,
    fee: params.fee,
    amount: 600000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(delivery)
  };

  //Sign wiith manufacturer
  let rawSignedTxn = algosdk.signMultisigTransaction(
    txn,
    deliveryParams,
    manufacturer.sk
  ).blob;
  //Sign wiith transporter
  let rawSignedTxn2 = algosdk.appendSignMultisigTransaction(
    rawSignedTxn,
    deliveryParams,
    transport.sk
  ).blob;
  //Sign wiith distributor
  let threesigs = algosdk.appendSignMultisigTransaction(
    rawSignedTxn2,
    deliveryParams,
    distributor.sk
  ).blob;
  //submit the transaction
  try {
    let tx = await p_algodclient.sendRawTransaction(threesigs);
    console.log("Delivery Transaction : " + tx.txId);
    return tx.txId;
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
};

const decodeNote = async (multiSig, txId) => {
  console.log("Let's Decode Note");
  try {
    let tx = await algodclient.transactionInformation(multiSig, txId);
    console.log(tx.txId);
    let encodednote = JSON.stringify(algosdk.decodeObj(tx.note), undefined, 4);
    console.log("Decoded: " + encodednote);
    return encodednote;
  } catch (err) {
    console.log("err", err);
  }
};

var farmerManufactureMultsig = algosdk.multisigAddress(farmerManufactureParams);
console.log("Purchase Multisig Address: " + farmerManufactureMultsig);

var purchaseId = '34UTXBRGBFJAHLMPOKXTCWX2XO2E5GQGSHLDEX2LP5OOXXH2L34A';
(async () => {
  let txID = await purchaseFarmer(
    manufacturer,
    farmer,
    farmerManufactureMultsig,
    farmerManufactureParams,
    purchase
  );
  console.log(txID);
  purchaseId = txID;

  //waiting for one block so that transaction confirms
  params = await algodclient.getTransactionParams();
  await algodclient.statusAfterBlock(params.lastRound + 1);
  let note = await decodeNote(farmerManufactureMultsig, txID);
})().catch(e => {
  console.log(e.error);
});

var transport = getAccount(process.env.TRANSPORTER);
console.log("Transporter addr: " + transport.addr);

var distributor = getAccount(process.env.DISTRIBUTOR);
console.log("Distributor addr: " + distributor.addr);

var mnemonic5 =
  "kit wrestle unit coach blouse primary peanut check raise cushion primary pluck gossip absurd mountain hundred moral interest wreck until dentist rifle correct abandon stool";
var medicineBatch = algosdk.mnemonicToSecretKey(mnemonic5);
console.log("Medicine Batch addr: " + medicineBatch.addr);

const deliveryParams = {
  version: 1,
  threshold: 3,
  addrs: [manufacturer.addr, transport.addr, distributor.addr]
};

var deliveryMultisig = algosdk.multisigAddress(deliveryParams);
console.log("Delivery Multisig " + deliveryMultisig);

var delivery = {
  transporter: {
    name: "Bob",
    vehicleNo: "VN07"
  },
  manufacturer: {
    name: "Nestle"
  },
  distributor: {
    name: "Zenus"
  },
  ingredientSource: purchaseId,
  medicines: [
    {
      name: "Calpol",
      quantity: 500,
      price: 100,
      id: medicineBatch.addr
    }
  ]
};


(async () => {
  console.log(delivery);
  let txID = await deliverDistributor(
    manufacturer,
    transport,
    distributor,
    deliveryMultisig,
    deliveryParams,
    delivery
  );
  console.log("In distributor");
  console.log(txID);
  params = await algodclient.getTransactionParams();
  await algodclient.statusAfterBlock(params.lastRound + 1);
  let note = await decodeNote(deliveryMultisig, txID);
  let deliveryw = JSON.parse(note);
  let batchID = deliveryw.medicines[0].id;
  console.log(deliveryw);
  console.log(batchID);

  let endRound = params.lastRound + parseInt(1000);
  let attestation = {
    deliverye: txID
  };
  let txn = {
    from: distributor.addr,
    to: batchID,
    fee: params.fee,
    amount: 100000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(attestation)
  };
  let signedTxn = algosdk.signTransaction(txn, distributor.sk);
  var attestedId;
  try {
    let tx = await p_algodclient.sendRawTransaction(signedTxn.blob);
    console.log("Attestation to batch : " + tx.txId);
    attestedId = tx.txId;
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
  params = await algodclient.getTransactionParams();
  await algodclient.statusAfterBlock(params.lastRound + 1);
  let attestedNote = await decodeNote(batchID, attestedId);
  console.log("Decoding Attestation : " + attestedNote);
})().catch(e => {
  console.log(e.error);
});
