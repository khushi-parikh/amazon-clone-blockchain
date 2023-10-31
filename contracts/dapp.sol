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

    struct Order {
        uint time;
        Item item;
    }

    mapping(uint => Item) public items;
    event ListProducts(string name, uint cost, uint stock);

    mapping(address => uint) public orderCount;
    // mapping buyers address to order count to order
    mapping(address => mapping(uint => Order)) public orders;
    event BuyProducts(address buyer, uint orderId, uint itemId);

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

    function buyProduct(uint _id) public payable {
        // Fetch item
        Item memory item = items[_id];

        // Certain checks of stock and user balance
        require(msg.value >= item.cost, "You do not have enough balance");
        require(item.stock > 0, "Item is not in stock");

        // Create order
        Order memory order = Order(block.timestamp, item);

        // Add order to list of orders
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        // Subtract 1 from stock
        items[_id].stock--;

        // Emit event
        emit BuyProducts(msg.sender, orderCount[msg.sender], _id);

    }

    // Owner withdraws funds from smart contract
    function withdrawFunds () public onlyOwner() {
        // address(this) refers to address of smart contract
        (bool success, ) = owner.call{value : address(this).balance}("");
        require(success);
    }
}