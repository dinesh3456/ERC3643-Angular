const hre = require("hardhat");
const { ethers } = require('ethers');
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");




//async function main() {
  // Deploy each contract individually
  // const Identityfactory = await hre.ethers.getContractFactory("TrustedIssuersRegistry");
  // const identityfactory = await Identityfactory.deploy();

  // await identityfactory.waitForDeployment();
  // console.log("Trusted Issuer Registry deployed to:", identityfactory.target);

  // const factory = await hre.ethers.getContractFactory("ofactory");
  // const Ofactory = await factory.deploy();

  // await Ofactory.waitForDeployment();
  // console.log("ofactory deployed to:", Ofactory.target);


//}


const FactoryModule = buildModule("FactoryModule", (m) => {
  const factory = m.contract("ofactory");

  return { factory };
});

module.exports = FactoryModule ;
