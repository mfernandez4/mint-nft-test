// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BatchExampleNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public MAX_SUPPLY = 0;
    uint256 public initial_mint = 0;


    constructor(uint256 _MAX_SUPPLY, uint256 _initial_mint) ERC721("BatchExampleNFT", "BEN") {
        require(_MAX_SUPPLY > 0, "must set MAX_SUPPLY");
        require(_initial_mint <= _MAX_SUPPLY, "can't exceed MAX_SUPPLY");
        MAX_SUPPLY = _MAX_SUPPLY;
        initial_mint = _initial_mint;

        if (initial_mint > 0) {
            
            for (uint256 i = 0; i < initial_mint; i++) {
                safeMint(msg.sender, "https://gateway.pinata.cloud/ipfs/QmaVK7Ry6PnRTmsXbTXpUWEMzA7MJEdtYGcWkVZ1CoXLCN");
            }
        }
    }

    function safeMint(address to, string memory uri)
     public onlyOwner 
     {
        require(_tokenIdCounter.current() <= MAX_SUPPLY, "I'm sorry we reached the cap");

        _tokenIdCounter.increment();

        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
