import React,{ Component} from 'react';
import {Alert} from 'reactstrap';
import Payment from '../Payment';
class Offer extends Component{
    constructor(props){
        super(props);
        this.state = {
            offer:props.offer,
            visible:false,
            errorMsg:'',
            payment:false,
            newOffer:0,
        }
    }

    handleDecline = () =>{
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie,
			},
			body: JSON.stringify({
                action:'Deny',
                offer_id:this.offer.offer_id
			})
		  };
		  fetch('/offer/user',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					this.props.refreshOffers();
					break;
					case 400:
					const err_message_fail = await response.text();
					console.log(err_message_fail);
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
	}
    
    handleFailedPayment = (message) =>{
		console.log(message);
		this.setState({visible:true,errorMsg:message});
	}
    handlePay = (e) =>{
		this.setState({payment:true});
        e.preventDefault();
	}
    handleCounterOffer = (e) =>{
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie,
			},
			body: JSON.stringify({
                action:'Counter',
                shop_id:this.offer.shop_id,
                offer_id:this.offer.offer_id,
                new_price_per_unit:this.state.newOffer
			})
		  };
		  fetch('/offer/user',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					this.props.refreshOffers();
					break;
					case 400:
					const err_message_fail = await response.text();
					console.log(err_message_fail);
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
	}
    toggle(){
		this.setState({visible:!this.state.visible, errorMsg:''})
	}
    cancelPayment = () =>{
		this.setState({payment:false});
	}
    handleOfferPrice = (event) => {
        this.setState({newOffer:event.target.value})
    }
    render() {
        return(
            <React.Fragment>
                <div class="rowalert alert alert-primary" role="alert">
                            {this.state.offer.is_counter_offer ? <h1>Counter offer:</h1> :
                            this.state.offer.is_purchasable ?
                            <h1>Offer:</h1>
                             :
                             <h1>Pending Offer:</h1>}

                            <h3>Shop: {this.state.offer.shop_name} Product: {this.state.offer.product_name}({this.state.offer.product_id}) Total: {this.state.offer.amount*this.state.offer.price_per_unit}(Amount:{this.state.offer.amount} Price:{this.state.offer.price_per_unit})</h3>
                            {this.state.offer.is_purchasable && this.state.offer.is_counter_offer ?
                            <div className="offer">
                            <input type="number" className="amount form-control" placeholder={"Offer price"}  onChange={this.handleOfferPrice}/>
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handleCounterOffer}> Counter Offer </button>   
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handlePay}> Purchase </button>
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handleDecline}> Decline </button>
                            {this.state.payment  && 
					        <div>
						        <Payment isOffer={true} handleFailedPayment={this.handleFailedPayment} refreshOffers ={this.props.refreshOffers} offer_id ={this.offer.offer_id} cancelPayment={this.cancelPayment}/>
					        </div>
				            }
                            </div>
                            :this.state.offer.is_purchasable ?
                            <div>
                            {this.state.payment  && 
                                <div>
                                   <Payment isOffer={true} handleFailedPayment={this.handleFailedPayment} refreshOffers ={this.props.refreshOffers} offer_id ={this.offer.offer_id}  cancelPayment={this.cancelPayment}/>
					        </div>
                                }
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handlePay}> Purchase </button>
                            </div>
                            : <button className="offer2 btn btn-secondary btn-block" onClick={(e) => e.preventDefault()}> Offer pending </button> }
                        </div>
                        <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>   
                </React.Fragment>
        )
    }
}
export default Offer;