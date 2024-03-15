const hre = require("hardhat");
const { ethers } = require('ethers');


async function main() {
  // Deploy each contract individually
  const Identityfactory = await hre.ethers.getContractFactory("factory");
  const identityfactory = await Identityfactory.deploy();

  await identityfactory.waitForDeployment();
  console.log("identityfactory deployed to:", identityfactory.target);

  const factory = await hre.ethers.getContractFactory("ofactory");
  const Ofactory = await factory.deploy();

  await Ofactory.waitForDeployment();
  console.log("ofactory deployed to:", Ofactory.target);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
