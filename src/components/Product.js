import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, dappazon, togglePop }) => {

    const [order, setOrder] = useState(null);

    const buyHandler = () => {
        console.log("buying");
    }

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

                        <button className='product__buy' onClick={buyHandler}>
                            Buy now
                        </button>
                    </p>

                    <p><small>Shipped with </small>love</p>
                    <p><small>Shipped by </small>me</p>

                    {order && (
                        <div className='product__bought'>
                            Item bought on <br />
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