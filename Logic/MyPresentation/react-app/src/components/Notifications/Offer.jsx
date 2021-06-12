import React,{ Component} from 'react';

import Payment from '../Payment';
class Offer extends Component{
    constructor(props)
    {
        super(props);
        this.state = {offer:props.offer}
    }
    handleDecline = () =>{

    }
    handleFailedPayment = (message) =>{
		console.log(message);
		this.setState({visible:true,errorMsg:message});
	}
    handlePay = (e) =>{
		this.setState({payment:true});
        e.preventDefault();
	}
    cancelPayment = () =>{
		this.setState({payment:false});
	}
    render() {
        return(
            <React.Fragment>
                <div class="rowalert alert alert-primary" role="alert">
                            {this.state.offer.is_counter_offer ? <h1>Counter offer:</h1> :
                            this.state.offer.is_purchaseable ?
                            <h1>Offer:</h1>
                             :
                             <h1>Pending Offer:</h1>}

                            <h3>Shop: {this.state.offer.shop_name} Product: {this.state.offer.product_name}({this.state.offer.product_id}) Total: {this.state.offer.amount*this.state.offer.price_per_unit}(Amount:{this.state.offer.amount} Price:{this.state.offer.price_per_unit})</h3>
                            {this.state.offer.is_purchaseable && this.state.offer.is_counter_offer ?
                            <div className="offer">
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handlePay}> Purchase </button>
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handleDecline}> Decline </button>
                            {this.state.payment  && 
					        <div>
						        <Payment handleFailedPayment={this.handleFailedPayment} refreshCart ={this.displayOffers} shop_id={1} cancelPayment={this.cancelPayment}/>
					        </div>
				            }
                            </div>
                            :this.state.offer.is_purchaseable ?
                            <div>
                            {this.state.payment  && 
                                <div>
                                    <Payment handleFailedPayment={this.handleFailedPayment} refreshCart ={this.displayOffers} shop_id={1} cancelPayment={this.cancelPayment}/>
                                </div>
                                }
                            <button className="offer2 btn btn-primary btn-block" onClick={this.handlePay}> Purchase </button>
                            </div>
                            : <button className="offer2 btn btn-secondary btn-block" onClick={(e) => e.preventDefault()}> Offer pending </button> }
                        </div>
                </React.Fragment>
        )
    }
}
export default Offer;