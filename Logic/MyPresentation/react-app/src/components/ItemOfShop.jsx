import React, { Component} from 'react';
import Image from './images/shirt.jpg';
import './Product.css';
class ItemOfShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:this.props.name,
            available:this.props.available,
            amount:this.props.amount,
            price:this.props.price,
            shopID:this.props.shopID,
            shopName:this.props.shopName
        }
    }
    render() {
        return (
            <div className="col-md-3">
                    <figure className="itemside mb-4">
                        <div className="right-aside"><img src={Image} alt="" className="img-sm"/></div>
                        <figcaption className="info align-self-center">
                            <h5>Shop ID: {this.state.shopID}</h5>
                            <h5>Shop Name: {this.state.shopName}</h5>
                            <h6>Product Name: {this.state.name}</h6>
                            <h6>Amount: {this.state.amount}</h6>
                            <h6>Price: {this.state.price}</h6>
                            <h6>{this.state.available}</h6>
                            <button className="btn btn-outline-primary btn-sm"> Add to cart 
                                <i className="fa fa-shopping-cart"></i> 
                            </button>
                        </figcaption>
                    </figure>
            </div>
        );
    }
}
export default ItemOfShop;