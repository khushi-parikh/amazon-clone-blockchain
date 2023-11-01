import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, dapp, togglePop }) => {

    const [order, setOrder] = useState(null);
    const [hasBought, setHasBought] = useState(false)

    const buyHandler = async () => {
        // Signer here refers to buyer which is the account we connect to 
        const signer = await provider.getSigner();
        let transaction = await dapp.connect(signer).buyProduct(item.id, {value : item.cost})
        await transaction.wait();
        setHasBought(true);
    }

    const fetchOrders = async () => {
        const events = await dapp.queryFilter("BuyProducts");
        const orders = events.filter(
            (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
        )

        if(orders.length === 0) return;

        const order = await dapp.orders(account, orders[orders.length-1].args.orderId);
        setOrder(order);
    }

    useEffect(()=>{
        fetchOrders();
    },[hasBought])

    return (
        <div className="product">
            <div className="product__details">
                <div className="product__image">
                    <img src={item.image} alt="Product" />
                </div>

                <div className="product__overview">
                    <h1>{item.name}</h1>
                    <Rating value={item.rating} />
                    <hr />
                    <p>{item.address}</p>
                    <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>
                    <hr />
                    <h2>Overview</h2>
                    <p>
                        {item.description}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec consectetur ligula.
                        Aenean sed dolor commodo, commodo orci eget, imperdiet mauris.

                    </p>

                </div>

                <div className="product__order">
                    <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>
                    <p>
                        FREE delivery <br />
                        <strong>
                            {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { 'weekday': 'long', 'month': 'long', 'day': 'numeric' })}
                        </strong>

                        {item.stock > 0 ? (<p>In stock</p>) : (<p>Out of stock</p>)}

                        <button disabled={item.stock<=0} className='product__buy' onClick={buyHandler}>
                            Buy now
                        </button>
                    </p>

                    <p><small>Shipped with </small>love</p>
                    <p><small>Shipped by </small>me</p>

                    {order && (
                        <div className='product__bought'>
                            Item last bought on <br />
                            <strong>
                                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                                    undefined,
                                    {
                                        weekday: 'long',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric'
                                    })}
                            </strong>
                        </div>
                    )}
                </div>

                <button onClick={togglePop} className='product__close'>
                    <img src={close} alt='Close' />
                </button>

            </div>
        </div >
    );
}

export default Product;