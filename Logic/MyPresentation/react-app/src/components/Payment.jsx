import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Reactlogo from './images/payment.png'
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successVisible:false,
            errorMsg:'',
            id:'',
		name:'',
		cardNo:'',
		month:'',
		year:'',
		ccv:'',
		delivery_name:'',
		address:'',
		city:'',
		country:'',
		zip:''
        };
    }

    //purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string)
  
    handleDeliveryName = (event) => {
		this.setState({delivery_name:event.target.value})
	}
	handleAddress = (event) => {
		this.setState({address:event.target.value})
	}
	handleCity = (event) => {
		this.setState({city:event.target.value})
	}
	handleCountry = (event) => {
		this.setState({country:event.target.value})
	}
	handleZip = (event) => {
		this.setState({zip:event.target.value})
	}
	handleCCV = (event) => {
		this.setState({ccv:event.target.value})
	}
	handleYear = (event) => {
		this.setState({year:event.target.value})
	}
	handleMonth = (event) => {
		this.setState({month:event.target.value})
	}
	handleId = (event) => {
		this.setState({id:event.target.value})
	}
	handleName = (event) => {
		this.setState({name:event.target.value})
	}
    handleOffer = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                offer_id:this.props.offer_id,
                payment:{
                    payment_info:{
						holder_id:this.state.id,
						holder_name:this.state.name,
						card_number:this.state.cardNo,
						month:this.state.month,
						year:this.state.year,
						ccv:this.state.ccv
					},
					delivery_info:{
						name:this.state.delivery_name,
						address:this.state.address,
						city:this.state.city,
						country:this.state.country,
						zip:this.state.zip,

					},
                }
            })
        };
        fetch('/offer',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        // console.log("sucesss>>>")
                        this.props.refreshOffers();
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        this.props.handleFailedPayment(err_message_fail);
                        break;
                    case 404: //server not found
                        break;
                    default:
                        break;
                }
            });
    } 
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                shop_id:this.props.shop_id,
                payment:{
                    payment_info:{
						holder_id:this.state.id,
						holder_name:this.state.name,
						card_number:this.state.cardNo,
						month:this.state.month,
						year:this.state.year,
						ccv:this.state.ccv
					},
					delivery_info:{
						name:this.state.delivery_name,
						address:this.state.address,
						city:this.state.city,
						country:this.state.country,
						zip:this.state.zip,

					},
                }
            })
        };
        fetch('/purchase',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        console.log("sucesss>>>")
                        this.props.refreshCart();
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        this.props.handleFailedPayment(err_message_fail);
                        break;
                    case 404: //server not found
                        break;
                    default:
                        break;
                }
            });
    }    
    render() {
        return (
            <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
                <img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form>
                <h1>Payment Info</h1>	
						  	  <input type="text" className="pay fadeIn second" placeholder="ID" onChange={this.handleId}/>
							  <input type="text" className="pay fadeIn second" placeholder="Ex. John Smith" onChange={this.handleName}/>
							  <input type="text" className="pay fadeIn third" placeholder="Card No." onChange={this.handleCard}/>
							  <input type="text" className="pay fadeIn third" placeholder="MM" onChange={this.handleMonth}/>
							  <input type="text" className="pay fadeIn second" placeholder="YY" onChange={this.handleYear}/>
							  <input type="text" className="pay fadeIn second" placeholder="CCV" onChange={this.handleCCV}/>
							  <h1>Delivery Info</h1>
							  <input type="text" className="pay fadeIn second" placeholder="Ex. John Smith" onChange={this.handleDeliveryName}/>
							  <input type="text" className="pay fadeIn second" placeholder="Address" onChange={this.handleAddress}/>
							  <input type="text" className="pay fadeIn second" placeholder="City" onChange={this.handleCity}/>
							  <input type="text" className="pay fadeIn second" placeholder="Country" onChange={this.handleCountry}/>
							  <input type="text" className="pay fadeIn second" placeholder="Zip" onChange={this.handleZip}/>
					{this.props.isOffer ?  
                    <button type="button" class="pay2 btn btn-primary" onClick={this.handleOffer}>Pay</button>
					:
					<button type="button" class="pay2 btn btn-primary" onClick={this.handleSubmit}>Pay</button>
					}
                    <button type="button" class="pay2 btn btn-primary" onClick={() => this.props.cancelPayment()}>Cancel</button>
                  </form>
            </div>
        </div> 
        );
    }
}
export default Payment;