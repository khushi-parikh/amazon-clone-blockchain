const hh = require("hardhat");
const { items } = require("../src/items.json")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    // Setup accounts 
    const [deployer] = await ethers.getSigners();

    // Deploy Dapp
    const Dapp = await hh.ethers.getContractFactory("Dapp");
    const hhDapp = await Dapp.deploy();
    await hhDapp.deployed();

    console.log("Dapp is deployed at address : ", hhDapp.address);

    // List Products
    for (let i = 0; i < items.length; i++) {
        const transaction = await hhDapp.connect(deployer).listProducts(
            items[i].id,
            items[i].name,
            items[i].category,
            items[i].image,
            tokens(items[i].price),
            items[i].rating,
            items[i].stock
        )
        await transaction.wait();

        console.log(`Listed item ${items[i].id}: ${items[i].name}`)
    }
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })