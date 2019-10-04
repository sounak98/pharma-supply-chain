// Importing sdk
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

// To get account from mnemonic
const getAccount = mnemonic => {
  return algosdk.mnemonicToSecretKey(mnemonic);
};


// Purchasing ingredients from farmer
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
  //sign with manufacturer
  let twosigs = algosdk.appendSignMultisigTransaction(
    rawSignedTxn,
    farmerManufactureParams,
    manufacturer.sk
  ).blob;

  //Submit the transaction
  try {
    let tx = await p_algodclient.sendRawTransaction(twosigs);
    console.log("Purchase by manufacturer : " + tx.txId);
    return tx.txId;
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
};


// Transfer batch of medicines to pharmacy
const transferPharmacy = async (
  distributor,
  pharmacy,
  transferMultisig,
  transferParams,
  transfer
) => {
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound + parseInt(1000);

  let txn = {
    from: transferMultisig,
    to: distributor.addr,
    fee: params.fee,
    amount: 600000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(transfer)
  };

  //Sign wiith distributor
  let rawSignedTxn = algosdk.signMultisigTransaction(
    txn,
    transferParams,
    distributor.sk
  ).blob;
  //sign with pharmacy
  let twosigs = algosdk.appendSignMultisigTransaction(
    rawSignedTxn,
    transferParams,
    pharmacy.sk
  ).blob;

  //submit the transaction
  try {
    let tx = await p_algodclient.sendRawTransaction(twosigs);
    console.log(" Transfer by distributor : " + tx.txId);
    return tx.txId;
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
};

var manufacturer = getAccount(process.env.MANUFACTURER);
console.log("Manufacturer addr: " + manufacturer.addr);

var farmer = getAccount(process.env.FARMER);
console.log("Farmer addr: " + farmer.addr);

var mnemonic5 =
  "crane discover juice screen team jar orphan increase timber hurt inherit swarm ability riot dilemma spot throw hood image broken chronic spike wing above stove";
var medicineBatch = algosdk.mnemonicToSecretKey(mnemonic5);
console.log("Medicine Batch addr: " + medicineBatch.addr);

const farmerManufactureParams = {
  version: 1,
  threshold: 2,
  addrs: [manufacturer.addr, farmer.addr]
};


// Manufacturer purchases ingredients from farmer 
let purchase = {
  seller: {
    name: "John Doe",
    age: 50,
    location: {
      lat: "10",
      lng: "15"
    }
  },
  buyer: {
    name: "Nestle",
    location: {
      lat: "20",
      lng: "45"
    }
  },
  timestamp: "15435434",
  ingredients: [
    {
      name: "sulphonic acid",
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
    console.log("Delivery by transporters : " + tx.txId);
    return tx.txId;
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
};

const decodeNote = async (sender, txId) => {
  console.log("Decoding Note");
  try {
    let tx = await algodclient.transactionInformation(sender, txId);
    console.log(tx.tx);
    let encodednote = JSON.stringify(algosdk.decodeObj(tx.note), undefined, 4);
    return encodednote;
  } catch (err) {
    console.log("err", err);
  }
};

var farmerManufactureMultsig = algosdk.multisigAddress(farmerManufactureParams);
console.log("Purchase Multisig Address: " + farmerManufactureMultsig);

var purchaseId = "";
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
  let endRound = params.lastRound + parseInt(1000);

  await algodclient.statusAfterBlock(params.lastRound + 1);
  let note = await decodeNote(farmerManufactureMultsig, txID);
  console.log("Decoded: " + note);
  
  let purchaseTemp = {
    proof: txID,
    name: "Purchase",
    timestamp: "2000134",
  };

  let txn1 = {
    from: manufacturer.addr,
    to: medicineBatch.addr,
    fee: params.fee,
    amount: 100000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(purchaseTemp)
  };
  console.log(purchaseTemp);
  let signedTxn = algosdk.signTransaction(txn1, manufacturer.sk);
  var attestedId;

  // try {
    let tx = await p_algodclient.sendRawTransaction(signedTxn.blob);
    console.log("Attesting purchase info by manufacturer : " + tx.txId);
    params = await algodclient.getTransactionParams();
    await algodclient.statusAfterBlock(params.lastRound + 1);
    note = await decodeNote(manufacturer.addr, tx.txId);
  // } catch (err) {
    // console.log("err", err); // throws undefined when send with account with no money
  // }
})().catch(e => {
  console.log(e.error);
});

var transport = getAccount(process.env.TRANSPORTER);
console.log("Transporter addr: " + transport.addr);

var distributor = getAccount(process.env.DISTRIBUTOR);
console.log("Distributor addr: " + distributor.addr);

const deliveryParams = {
  version: 1,
  threshold: 3,
  addrs: [manufacturer.addr, transport.addr, distributor.addr]
};

var deliveryMultisig = algosdk.multisigAddress(deliveryParams);
console.log("Delivery Multisig " + deliveryMultisig);


// Delivery denotes the delivery event between manufacturer, transporter and distributor
var delivery = {
  transporter: {
    name: "Bob",
    vehicleNo: "VN07",
    tempSensor: {
      ideal: 15,
      crossed: 6
    }
  },
  manufacturer: {
    name: "Nestle",
    location: {
      lat: 10,
      lng: 98
    }
  },
  distributor: {
    name: "Zenus",
    location: {
      lat: 20,
      lng: 88
    }
  },
  ingredientSource: 'EGSNDIHJ7U7IHLLVDW64EMG7Y75VECEVVRRWDUQTFVNN7RA6JRNQ',
  timestamp: "2000123",
  medicines: [
    {
      name: "Calpol",
      quantity: 500,
      price: 100,
      batchId: medicineBatch.addr
    }
  ]
};

var deliverId = "";
(async () => {
  let txID = await deliverDistributor(
    manufacturer,
    transport,
    distributor,
    deliveryMultisig,
    deliveryParams,
    delivery
  );
  console.log("Delivering to distributor");
  console.log(txID);

  deliverId = txID;
  let params = await algodclient.getTransactionParams();
  let endRound = params.lastRound + parseInt(1000);
  await algodclient.statusAfterBlock(params.lastRound + 1);
  let note = await decodeNote(deliveryMultisig, txID);
  let deliveryw = JSON.parse(note);

  // getting medicine's batch ID
  let batchID = deliveryw.medicines[0].id;
  console.log(deliveryw);
  console.log(batchID);

  let score = 10 * (1 - 1 / note.tempSensor.crossed);
  let deliveryTemp = {
    proof: txID,
    name: "Delivery",
    score: score,
    timestamp: "2032766",
  };

  let txn = {
    from: distributor.addr,
    to: medicineBatch.addr,
    fee: params.fee,
    amount: 100000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(deliveryTemp)
  };
  let signedTxn = algosdk.signTransaction(txn, distributor.sk);
  try {
    let tx = await p_algodclient.sendRawTransaction(signedTxn.blob);
    console.log("Attestation by distributor : " + tx.txId);
    let params = await algodclient.getTransactionParams();
    await algodclient.statusAfterBlock(params.lastRound + 1);
    let note = await decodeNote(distributor.addr, tx.txId);
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
})().catch(e => {
  console.log(e.error);
});

var pharmacy = getAccount(process.env.PHARMACY);
console.log("Pharmacy addr: " + pharmacy.addr);

const transferParams = {
  version: 1,
  threshold: 2,
  addrs: [pharmacy.addr, distributor.addr]
};

var transferMultisig = algosdk.multisigAddress(transferParams);
console.log("Transfer MultiSig: " + transferMultisig);

var transferId = "";

// Transfer denotes the transfer from distributor to pharmacy
var transfer = {
  distributor: {
    name: "Zenus",
    location: {
      lat: "10",
      lng: "90"
    }
  },
  medicines: [
    {
      name: "Calpol",
      quantity: 500,
      price: 100,
      id: medicineBatch.addr
    }
  ],
  pharmacy: {
    name: "Himalaya",
    location: {
      lat: "34",
      lng: "67"
    }
  },
  source: deliverId,
  timestamp: "2000433",
};

(async () => {
  let txID = await transferPharmacy(
    distributor,
    pharmacy,
    transferMultisig,
    transferParams,
    transfer
  );
  console.log("Transferring to Pharmacy");
  console.log(txID);

  transferId = txID;
  params = await algodclient.getTransactionParams();
  await algodclient.statusAfterBlock(params.lastRound + 1);
  let note = await decodeNote(transferMultisig, txID);

  let endRound = params.lastRound + parseInt(1000);
  let attestation = {
    proof: txID,
    name: "Transfer",
    timestamp: "2000987",
  };
  let txn = {
    from: pharmacy.addr,
    to: medicineBatch.addr,
    fee: params.fee,
    amount: 100000,
    firstRound: params.lastRound,
    lastRound: endRound,
    genesisID: params.genesisID,
    genesisHash: params.genesishashb64,
    note: algosdk.encodeObj(attestation)
  };
  let signedTxn = algosdk.signTransaction(txn, pharmacy.sk);

  // Sending attestation to medicine batch addr from pharmacy
  try {
    let tx = await p_algodclient.sendRawTransaction(signedTxn.blob);
    console.log("Attestation by pharmacy : " + tx.txId);
    let params = await algodclient.getTransactionParams();
    await algodclient.statusAfterBlock(params.lastRound + 1);
    let note = await decodeNote(pharmacy.addr, tx.txId);
  } catch (err) {
    console.log("err", err); // throws undefined when send with account with no money
  }
})().catch(e => {
  console.log(e.error);
});
