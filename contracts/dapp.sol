// SPDX-License-Identifier: MIT 
pragma solidity >=0.5.0 <0.9.0;

contract Dapp {
    address public owner;

    struct Item {
        uint id;
        string name;
        string category;
        string image;
        uint cost;
        uint rating;
        uint stock;
    }

    mapping(uint => Item) public items;
    event ListProducts(string name, uint cost, uint stock);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function listProducts(uint _id, string memory _name, string memory _category, string memory _image, 
        uint _cost, uint _rating, uint _stock) public onlyOwner {

            // Creating a new item struct
            Item memory item = Item(_id, _name, _category, _image, _cost, _rating, _stock);

            // Saving it to blockchain
            items[_id] = item;

            // Emit event for the same
            emit ListProducts(_name, _cost, _stock);
    }
}