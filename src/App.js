import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers'
import Navbar from './components/Navbar';
import dappABI from "./abis/Dapp.json"
import config from "./config.json"

function App() {
	const [account, setAccount] = useState(null);
	const [provider, setProvider] = useState(null);
	const [dapp, setDapp] = useState(null);

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

		for(var i=0; i<9; i++){
			const item = await dapp.items(i+1);
			items.push(item);
		}

		console.log("Items :", items);
	}

	useEffect(() => {
		loadBlockchainData();
	}, []);

	return (
		<div className="App">
			<Navbar account={account} setAccount={setAccount} />
			<h2>Best Sellers</h2>
		</div>
	);
}

export default App;
