const { expect } = require("chai");

const tokens = (n) => {
    // wei is used in smart contracts (smallest unit of eth)
    // converts eth to wei
    // 1 eth = 10^18 wei
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Amazon Clone contract", function(){
    let Dapp;
    let hardhatDapp;
    let deployer;

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
        let transaction;
        const ID = 1;
        const NAME = "Drone";
        const CATEGORY = "Electronics";
        const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/drone.jpg";
        const COST = tokens(1);
        const RATING = 4;
        const STOCK = 5;

        beforeEach(async function(){
            transaction = await hardhatDapp.connect(deployer).listProducts(
                ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK
            );

            await transaction.wait();
        })

        it("Returns list of transactions", async function(){
            const item = await hardhatDapp.items(1);
            expect(item.id).to.equal(ID);
        })
    })
})