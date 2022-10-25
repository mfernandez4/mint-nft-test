// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Grab the contract factory and deploy it
  const BatchExampleNFT = await ethers.getContractFactory("BatchExampleNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const batchExampleNFT = await BatchExampleNFT.deploy(25, 25); // Instance of the contract
  await batchExampleNFT.deployed()
  // This solves the bug in Mumbai network where the contract address is not the real one
  const txHash = batchExampleNFT.deployTransaction.hash
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  const contractAddress = txReceipt.contractAddress
  console.log("Contract deployed to address:", contractAddress)
  // console.log("🚀 ~ file: deploy-batch.js ~ line 15 ~ main ~ batchExampleNFT", batchExampleNFT)
  // console.log("🚀 ~ file: deploy-batch.js ~ line 19 ~ main ~ txReceipt", txReceipt)
  console.log("🚀 ~ file: deploy-batch.js ~ line 18 ~ main ~ txHash", txHash)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
