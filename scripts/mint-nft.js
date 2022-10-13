require('dotenv').config();
const ethers = require('ethers');

// Get Alchemy API URL from .env
const API_KEY = process.env.API_KEY;

// Define an Alchemy provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY);

const contract = require("../artifacts/contracts/ExampleNFT.sol/ExampleNFT.json");
// console.log(JSON.stringify(contract.abi));

// Create a signer
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Create a contract ABI and address
const abi = contract.abi;
const contractAddress = "0xFF7487eFa99aDdbf1f4E37fEbc0E1DC81D430Ff1";

// Create a contract instance object
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

// Get the NFT Metadata IPFS URL
const tokenURI = "https://gateway.pinata.cloud/ipfs/QmaVK7Ry6PnRTmsXbTXpUWEMzA7MJEdtYGcWkVZ1CoXLCN" // Replace with new IPFS URL for polygon nft

// Mint an NFT
const mintNFT = async () => {
    let nftTxn = await contractInstance.mintNFT(signer.address, tokenURI);
    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at https://goerli.etherscan.io/tx/${nftTxn.hash}`);
}

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });