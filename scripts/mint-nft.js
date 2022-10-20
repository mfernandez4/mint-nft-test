import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
require('dotenv').config();
const ethers = require('ethers');
// Get Alchemy API URL from .env
const API_KEY = process.env.API_KEY;

const contract = require("../artifacts/contracts/ExampleNFT.sol/ExampleNFT.json");
// console.log(JSON.stringify(contract.abi));

// Mint an NFT
async function mintNFT() {

    // Define an Alchemy provider
    const provider = new ethers.providers.AlchemyProvider('maticmum', API_KEY);


    // Create a signer
    const privateKey = process.env.PRIVATE_KEY;
    // The address of the account that will receive the NFT
    const signer = new ethers.Wallet(privateKey, provider);

    // The ABI is very important -- it's the interface to your contract, including
    // the different available functions that are exposed for other contracts,
    // accounts, etc. to call.
    const abi = contract.abi;
    // replace the contract address with your deployed contract address
    const contractAddress = "0xFF7487eFa99aDdbf1f4E37fEbc0E1DC81D430Ff1";

    // Create a contract instance of the deployed contract. We need both the specific CONTRACT_ADDRESS and the ABI
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);

    // create the image URI by uploading the image to Pinata
    const imageURI = await pinFileToIPFS('assets/ExampleNFT.png');

    //make metadata
    /**
     * @desc Creates the metadata for the NFT
     * @param {string} name - name of the NFT
     * @param {string} image - URI for the image of the NFT
     * @param {string} description - description of the NFT
     * @param {string} external_url - external URL for the NFT
     * @param {object} attributes - attributes of the NFT
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
            "value": 20
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
 
    // the IPFS URL to the NFT Metadata, which contains the NFT image and other metadata
    const tokenURI = await pinJSONToIPFS(metadata)
    .then(function (response) { return response.pinataUrl })
    .catch(function (error) {
        console.log(error)
        return error.message
    });

    // mint the NFT
    let nftTxn = await contractInstance.mintNFT(signer.address, tokenURI);
    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at https://mumbai.polygonscan.com/tx/${nftTxn.hash}`);
    
}

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });