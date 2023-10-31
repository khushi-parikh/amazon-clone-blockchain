const { type } = require("@testing-library/user-event/dist/type");
const { expect } = require("chai");

const tokens = (n) => {
    // wei is used in smart contracts (smallest unit of eth)
    // converts eth to wei
    // 1 eth = 10^18 wei
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

// Global constants for example
let transaction;
const ID = 1;
const NAME = "Drone";
const CATEGORY = "Electronics";
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/drone.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("Amazon Clone contract", function(){
    let Dapp;
    let hardhatDapp;
    let deployer, buyer;

    beforeEach(async function(){
        // Setup the required accounts 
        [deployer, buyer] = await ethers.getSigners();

        // Deploy the contract
        Dapp = await ethers.getContractFactory("Dapp");
        hardhatDapp = await Dapp.deploy();
    });

    describe("Deployment", function(){
        it("Should set the right owner", async function(){
            expect(await hardhatDapp.owner()).to.equal(deployer.address);
        });
    });

    describe("Listing", function(){

        beforeEach(async function(){
            transaction = await hardhatDapp.connect(deployer).listProducts(
                ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK
            );

            await transaction.wait();
        });

        it("Returns list of transactions", async function(){
            const item = await hardhatDapp.items(1);
            expect(item.id).to.equal(ID);
            expect(item.name).to.equal(NAME);
            expect(item.category).to.equal(CATEGORY);
            expect(item.image).to.equal(IMAGE);
            expect(item.cost).to.equal(COST);
            expect(item.rating).to.equal(RATING);
            expect(item.stock).to.equal(STOCK);
        });

        it("Emits listProducts event", async function(){
            expect(transaction).to.emit(hardhatDapp, "listProducts");
        })
    });

    describe("Buying", function(){
        beforeEach(async function(){
            // Create the transaction
            transaction = await hardhatDapp.connect(deployer).listProducts(
                ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK
            );
            await transaction.wait();

            // Buy an item
            transaction = await hardhatDapp.connect(buyer).buyProduct(ID, {value : COST});
            await transaction.wait();
        });

        it("Updates contract balance", async function() {
            const balance = await ethers.provider.getBalance(hardhatDapp.address);
            expect(balance).to.equal(COST);
        })

        it("Updates buyers count order", async function() {
            const buyersCount = await hardhatDapp.orderCount(buyer.address);
            expect(buyersCount).to.equal(1);
        });

        it("Adds the order", async function() {
            const order = await hardhatDapp.orders(buyer.address, 1);

            // date is in the format of BigNumber and hence an Object
            // need to use parseInt() in order to compare
            expect(parseInt(order.time)).to.be.greaterThan(0);
            expect(order.item.name).to.equal(NAME);
        });

        it("Emits buyProduct event", function() {
            expect(transaction).to.emit(hardhatDapp, "BuyProducts")
        });
    })
})