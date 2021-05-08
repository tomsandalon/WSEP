import React, { Component} from 'react';
import Image from './images/shirt.jpg';
import {Alert} from 'reactstrap';
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
            shopName:this.props.shopName,
            productID:this.props.productID,
            desiredAmount:0,
            visible:false,
            errorMsg:''
        }
    }
    handleAddToCart = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                product_id:this.state.productID,
                shop_id:this.state.shopID,
                amount:this.state.desiredAmount
            })
        };
        fetch('/cart',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        this.setState({errorMsg:"Added to cart!", visible:true,desiredAmount:0})
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        this.setState({errorMsg:err_message_fail,visible:true,desiredAmount:0})        
                        break;
                    case 404: //server not found
                        break;
                    default:
                        break;
                }
            })
    }
    handleAmount = (event) => {
        this.setState({desiredAmount:event.target.value})
    }
    toggle(){
        this.setState({visible:!this.state.visible, errorMsg:''})
    }
    render() {
        return (
            <div className="col-md-3">
                    <figure className="itemside mb-4">
                        <div className="right-aside"><img src={Image} alt="" className="img-sm"/></div>
                        <figcaption className="info align-self-center">
                            <h5>Shop ID: {this.state.shopID}</h5>
                            <h5>Shop Name: {this.state.shopName}</h5>
                            <h6>Product Name: {this.state.name}(ID:{this.state.productID})</h6>
                            <h6>Amount: {this.state.amount}</h6>
                            <h6>Price: {this.state.price}</h6>
                            <h6>{this.state.available}</h6>
                            <input type="number" className="amount form-control" placeholder="Amount:" onChange={this.handleAmount}/>
                            <button className="btn btn-primary btn-sm" onClick={this.handleAddToCart}> Add to cart 
                                <i className="fa fa-shopping-cart"></i> 
                            </button>
                        </figcaption>
                        <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                    </figure>
            </div>
        );
    }
}
export default ItemOfShop;