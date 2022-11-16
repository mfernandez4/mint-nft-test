// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
const hre = require("hardhat");

async function main() {

  // create the image URI by uploading the image to Pinata
  const imageURI = await pinFileToIPFS('assets/ExampleNFT.png')
  .then(function (response) { return response.pinataUrl })
  .catch(function (error) {
      console.log(error)
      return error.message
  });

  //make metadata for the NFT
  /**
   * @desc Creates the metadata for the NFT
   * @param {string} name - name of the NFT
   * @param {string} image - URI for the image of the NFT
   * @param {string} description - description of the NFT
   * @param {string} external_url - external URL for the NFT to link
   * @param {object} attributes - extra attributes of the NFT
   */
  const metadata = {};
  metadata.name = 'ExampleNFT';
  metadata.image = imageURI;
  metadata.description = 'Example NFT to deploy to the Polygon Mumbai Test Network';
  metadata.external_url = "https://www.swivelmeta.io"
  metadata.attributes = [
      {
          "trait_type": "Team",
          "value": "Swivel Meta"
      },
      {
          "display_type": "boost_number",
          "trait_type": "Coolness Factor",
          "value": 100
      },
      {
          "trait_type": "Speed",
          "value": 100
      },
      {
          "trait_type": "Jump",
          "value": 20
      },
      {
          "display_type": "number",
          "trait_type": "Generation",
          "value": 1
      }
  ];

  // upload the metadata to Pinata and return the URI
  // URI - the IPFS URL to the NFT Metadata, which contains the NFT image and other metadata
  const tokenURI = await pinJSONToIPFS(metadata)
  .then(function (response) { return response.pinataUrl })
  .catch(function (error) {
      console.log(error)
      return error.message
  });


  // Grab the contract factory and deploy it
  const BatchExampleNFT = await ethers.getContractFactory("BatchExampleNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const batchExampleNFT = await BatchExampleNFT.deploy(125, 25, tokenURI); // Instance of the contract
  
  // Wait for the contract to be deployed
  await batchExampleNFT.deployed()
  
  // This solves the bug in Mumbai network where the contract address is not the real one
  const txHash = batchExampleNFT.deployTransaction.hash
  
  // Wait for the transaction to be mined
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  
  // Get the contract address from the transaction receipt
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
