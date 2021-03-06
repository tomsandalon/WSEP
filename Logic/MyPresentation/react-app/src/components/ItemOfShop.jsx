import React, { Component} from 'react';
import Image from './images/shirt.jpg';
import ImageOffer from './images/offer.png';
import {Alert} from 'reactstrap';
import './Product.css';
import Rating from 'react-rating';
class ItemOfShop extends Component {

    state = {
        desiredAmount:0,
        offerPrice:0,
        visible:false,
        successVisible:false,
        errorMsg:''
    }
    onShowAlert = ()=>{
        this.setState({successVisible:true,errorMsg:"Added to cart!",desiredAmount:0,offerPrice:0},()=>{
            window.setTimeout(()=>{
            this.setState({successVisible:false})
            },1000)
        });
    }
    onShowAlertOffer = ()=>{
        this.setState({successVisible:true,errorMsg:"Offer placed!",desiredAmount:0,offerPrice:0},()=>{
            window.setTimeout(()=>{
            this.setState({successVisible:false})
            },1000)
        });
    }
    handleOffer = () =>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                shop_id:this.props.shopID,
                product_id:this.props.productID,
                amount:this.state.desiredAmount,
                price_per_unit:this.state.offerPrice,
            })
        };
        fetch('/offer/user',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        this.onShowAlertOffer();
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        this.setState({errorMsg:err_message_fail,visible:true,desiredAmount:0,offerPrice:0})        
                        break;
                    case 404: //server not found
                        break;
                    default:
                        break;
                }
            })
    }
    handleAddToCart = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                product_id:this.props.productID,
                shop_id:this.props.shopID,
                amount:this.state.desiredAmount
            })
        };
        fetch('/cart',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        this.onShowAlert();
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        this.setState({errorMsg:err_message_fail,visible:true,desiredAmount:0,offerPrice:0})        
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
    handleOfferPrice = (event) => {
        this.setState({offerPrice:event.target.value})
    }

    successToggle(){
        this.setState({successVisible:!this.state.successVisible, errorMsg:''})
    }
    toggle(){
        this.setState({visible:!this.state.visible, errorMsg:''})
    }
    render() {
        return (
            <div className="col-md-3">
                    <figure className="itemside mb-4">
                        <div className="size right-aside">
                            {this.props.type == 0 ?
                                <img src={Image} alt="" className="img-sm"/>
                                : <img src={ImageOffer} alt="" className="img-sm"/> 
                                }
                            </div>
                        <figcaption className="info align-self-center">
                            {/* <h5>Shop ID: {this.props.shopID}</h5> */}
                            <h5>Shop Name: {this.props.shopName}</h5>
                            <h6>Product Name: {this.props.name}(ID:{this.props.productID})</h6>
                            <h6>Amount: {this.props.amount}</h6>
                            <h6>Price: {this.props.price}</h6>
                            {/* //rating={item._rating.real_rating} raters={item._rating.number_of_rating} */}
                            <h6>Amount of raters: {this.props.raters}</h6>
                            <Rating readonly={true} placeholderRating={this.props.rating}></Rating>
                            <input type="number" className="amount form-control" placeholder={"Amount: " + this.state.desiredAmount}  onChange={this.handleAmount}/>
                            {this.props.type == 0 ?
                            <button className="btn btn-primary btn-sm" onClick={this.handleAddToCart}> Add to cart 
                                <i className="fa fa-shopping-cart"></i> 
                            </button>
                            :
                            <div>
                            <input type="number" className="amount form-control" placeholder={"Offer price"}  onChange={this.handleOfferPrice}/>
                            <button className="btn btn-primary btn-sm" onClick={this.handleOffer}> Offer 
                            </button>
                            </div>
                            }
                        </figcaption>
                        <Alert color="success" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert>
                        <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                    </figure>
            </div>
        );
    }
}
export default ItemOfShop;