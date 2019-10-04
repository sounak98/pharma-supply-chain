const algosdk = require("algosdk");
require("dotenv").config();

const atoken =
  "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
const aserver = "http://hackathon.algodev.network";
const aport = 9100;
const algodclient = new algosdk.Algod(atoken, aserver, aport);

//Recover the account
const account = algosdk.generateAccount();
console.log(algosdk.secretKeyToMnemonic(account.sk));