require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * @desc Pinata API call to pin JSON metadata to IPFS
 * @param {metadata} metadata - metadata to be uploaded and pinned to pinata
 * @returns A promise that resolves to the IPFS URL of the metadata
 */
const pinJSONToIPFS = async(metadata) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, metadata, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
           
        });
};

const pinFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', fs.createReadStream(file));
    return axios
        .post(url, data, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
                "Content-Type": "multipart/form-data",
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
           
        });
}


async function main() {

    // TEST CODE
    
    // create the image URI by uploading the image to Pinata
    const imageURI = await pinFileToIPFS('assets/ExampleNFT.png');
    console.log("Image asset stored on Pinata and IPFS with URL:", imageURI.pinataUrl)
    
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

    const tokenURI = await pinJSONToIPFS(metadata)
    .then(function (response) {
        return response.pinataUrl
    })
    .catch(function (error) {
        console.log(error)
        return error.message
    });
    console.log("Metadata stored on Pinata and IPFS with URL:", tokenURI)
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });