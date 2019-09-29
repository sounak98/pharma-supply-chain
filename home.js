const algosdk = require("algosdk");
require("dotenv").config();

// import { keypress } from './helpers';
// import { delivery } from './templates/delivery';
// import { purchase } from './templates/purchase';
// import { attestation } from './templates/attestation';

const atoken = process.env.ACCESS_TOKEN;
const aserver = process.env.SERVER_URL;
const aport = process.env.PORT;
const algodclient = new algosdk.Algod(atoken, aserver, aport);

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise(resolve =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

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
  let tx = await algodclient.sendRawTransaction(twosigs);
  console.log("Transaction : " + tx.txId);
  return tx.txId;
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
      name: "urea",
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
  let tx = await algodclient.sendRawTransaction(threesigs);
  console.log("Delivery Transaction : " + tx.txId);
  return tx.txId;
};

const decodeNote = async (multiSig, txId) => {
  console.log("heiilll");
  try {
    let tx = await algodclient.transactionById(txId);
  } catch (err) {
    console.log("err", err);  
  }
  // console.log(tx)
  console.log("heii");
  let encodednote = JSON.stringify(algosdk.decodeObj(tx.note), undefined, 4);
  console.log("hi");  
  console.log("Decoded: " + encodednote);
  return encodednote;
};

var farmerManufactureMultsig = algosdk.multisigAddress(farmerManufactureParams);
// var farmerManufactureMultsig =
// "DPRTAEUY5GC52JTZWGRKDCDYNRF7CYCYGGQTNUXPVLPDTSNMQ7C2GGKFZE";
console.log("Purchase Multisig Address: " + farmerManufactureMultsig);

(async () => {
  let txID = await purchaseFarmer(
    manufacturer,
    farmer,
    farmerManufactureMultsig,
    farmerManufactureParams,
    purchase
  );
  console.log(txID);
  let note = await decodeNote(
    farmerManufactureMultsig,
    txID
  );
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

var deliveryMultisig =
  "YP7XCRFZFPPX7KNB337YP6YMIA3NRXIMO75CLZYM7DMYAP6KHO4EWNPXEY";
console.log("Delivery Multisig " + deliveryMultisig);

let delivery = {
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
  ingredientSource: "TF7F53TD5YSWTR4C5635RXMXFKPO2NL7DEQEE36UGLMUFUNNYD5Q",
  medicines: [
    {
      name: "Calpol",
      quantity: 500,
      price: 100,
      id: "TIR5USMFQAGFALAHB33ZDTGMF5GW6MO4GO62VUFVFM4VBKDPUZVT5JIJB4"
    }
  ]
};

(async () => {
  let txID = await deliverDistributor(
    manufacturer,
    transport,
    distributor,
    deliveryMultisig,
    deliveryParams,
    purchase
  );
  console.log(txID);
  let note = await decodeNote(
    deliveryMultisig,
    txID
  );
  // console.log(note);
})().catch(e => {
  console.log(e.error);
});














// let txId2 = "THPWELXO36WGGGXU6GZPN3TWCOWP64IVQIVEUQAY5HIKYSX343VQ";

// (async () => {
//   let params = await algodclient.getTransactionParams();

//   let tx = await algodclient.transactionInformation(deliveryMultisig, txId2);
//   let encodednote = JSON.stringify(algosdk.decodeObj(tx.note), undefined, 4);
//   console.log("Decoded Delivery: " + encodednote);

  // let delivery = JSON.parse(encodednote);
  // let batchID = delivery.medicines[0].id;

  // let endRound = params.lastRound + parseInt(1000);
  // let attestation = {
  //   delivery: txId2
  // }
  // let txn = {
  //   from: distributor.addr,
  //   to: batchID,
  //   fee: params.fee,
  //   amount: 100000,
  //   firstRound: params.lastRound,
  //   lastRound: endRound,
  //   genesisID: params.genesisID,
  //   genesisHash: params.genesishashb64,
  //   note: algosdk.encodeObj(attestation)
  // };

  // let signedTxn = algosdk.signTransaction(txn, distributor.sk);
  // let tx3 = await algodclient.sendRawTransaction(signedTxn.blob);
  // console.log("Attestation to batch : " + tx3.txId);
// })().catch(e => {
  // console.log(e.error);
// });

// let batchID = "TIR5USMFQAGFALAHB33ZDTGMF5GW6MO4GO62VUFVFM4VBKDPUZVT5JIJB4";
// let attestedId = "IJ2ENWJKYSHVP3JXSC6XQHH4JAX4HZ7JQ3WXLEJOTABXIULPQXBQ";
// (async () => {
//   let params = await algodclient.getTransactionParams();

//   let tx = await algodclient.transactionInformation(batchID, attestedId);
//   let encodednote = JSON.stringify(algosdk.decodeObj(tx.note), undefined, 4);
//   console.log("Decoded Delivery: " + encodednote);
// })().catch(e => {
//   console.log(e.error);
// });
