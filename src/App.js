import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import Navbar from './components/Navbar';
import Section from './components/Section';
import dappABI from "./abis/Dapp.json"
import config from "./config.json"
import Product from './components/Product';

function App() {
	const [account, setAccount] = useState(null);
	const [provider, setProvider] = useState(null);
	const [dapp, setDapp] = useState(null);

	const [electronics, setElectronics] = useState(null);
	const [clothing, setClothing] = useState(null);
	const [toys, setToys] = useState(null);

	// For card toggle pop
	const [item, setItem] = useState({});
	const [toggle, setToggle] = useState(false);

	const loadBlockchainData = async () => {
		// Connect to blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(provider);

		const network = await provider.getNetwork()

		// Connect to smart contract
		const dapp = new ethers.Contract(config[network.chainId].dapp.address, dappABI, provider);
		setDapp(dapp);
		console.log(dapp);

		// Load products
		const items = [];

		for (var i = 0; i < 9; i++) {
			const item = await dapp.items(i + 1);
			items.push(item);
		}
		console.log("Items :", items);

		// Divide into categories
		const electronics = items.filter((item) => item.category === 'electronics');
		setElectronics(electronics);
		const clothing = items.filter((item) => item.category === 'clothing');
		setClothing(clothing);
		const toys = items.filter((item) => item.category === 'toys');
		setToys(toys);
	}

	useEffect(() => {
		loadBlockchainData();
	}, []);

	const togglePop = (item) => {
		console.log(item);
		setItem(item);
		setToggle(!toggle);
	}

	return (
		<div className="App">
			<Navbar account={account} setAccount={setAccount} />
			<h2>Best Sellers just for you!</h2>
			{electronics && < Section title="Electronics - Modern age technology" items={electronics} togglePop={togglePop} />}
			{clothing && < Section title="Clothing - Can't find something in your wardrobe?" items={clothing} togglePop={togglePop} />}
			{toys && < Section title="Toys - Perfect for a break!" items={toys} togglePop={togglePop} />}

			{toggle && < Product item={item} provider={provider} account={account} dapp={dapp} togglePop={togglePop} />}
		</div>
	);
}

export default App;
