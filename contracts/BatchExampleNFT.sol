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
    uint256 private _currentTokenId = 1;
    uint256 private _TOTAL_MINTED = 0;
    uint256 public MAX_SUPPLY = 0;
    uint256 public initial_mint = 0;


    constructor(uint256 _MAX_SUPPLY, uint256 _initial_mint, string memory ipfs) ERC721("BatchExampleNFT-V2", "BV2") {
        require(_MAX_SUPPLY > 0, "must set MAX_SUPPLY");
        require(_initial_mint <= _MAX_SUPPLY, "can't exceed MAX_SUPPLY");
        MAX_SUPPLY = _MAX_SUPPLY;
        initial_mint = _initial_mint;

        if (initial_mint > 0) {

            for (uint256 i = 0; i < initial_mint; i++) {
                safeMint(msg.sender, ipfs);
            }
        }
    }

    function safeMint(address to, string memory uri)
     public onlyOwner 
     {
        require(MAX_SUPPLY > totalSupply(), "I'm sorry we reached the cap");
        require(MAX_SUPPLY > _TOTAL_MINTED, "I'm sorry we reached the cap");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "I'm sorry we reached the cap");

        _tokenIdCounter.increment();
        _TOTAL_MINTED++;
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function batchSafeMint(uint256 amount)
     public onlyOwner 
     {
        require(totalSupply() <= MAX_SUPPLY, "I'm sorry we reached the cap");
        require(totalSupply() + amount <= MAX_SUPPLY, "I'm sorry this would exceed the cap, please try a smaller amount");

        if (amount > 0) {

            for (uint256 i = 0; i < amount; i++) {
                safeMint(msg.sender, "https://gateway.pinata.cloud/ipfs/QmaVK7Ry6PnRTmsXbTXpUWEMzA7MJEdtYGcWkVZ1CoXLCN");
            }
        }
    }

    function autoSafeTransfer(address to)
    public
    {
        require(_currentTokenId <= _TOTAL_MINTED, "Reached the totalSupply. Mint more to continue");
        require(balanceOf(to) < 1 , "Address has already claimed NFT, only 1 claim per address allowed");
        uint256 currentTokenId = _currentTokenId;

        safeTransferFrom(owner(), to, currentTokenId);
        // _safeTransfer(owner(), to, currentTokenId, "");

        currentTokenId ++;
        _currentTokenId = currentTokenId;

    }

    function getCurrentTokenId()
    public view
    returns(uint256)
    {
        return(_currentTokenId);
    }

    function getTotalTokensMinted()
    public view
    returns(uint256)
    {
        return(_TOTAL_MINTED);
    }


    function batchBurn()
    public onlyOwner
    {
        require( balanceOf(owner()) > 0, "There are no Tokens available to burn" );
        address owner = owner();
        uint256 amount;
        uint256 tokenIndex;


        // set amount owned by owner
        amount = balanceOf( owner );
        for (uint256 i = 0; i < amount; i++) {
            tokenIndex = tokenOfOwnerByIndex(owner, 0);
            _burn(tokenIndex);
            _currentTokenId++;
        }

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
