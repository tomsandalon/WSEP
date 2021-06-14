import React,{Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offer from './Offer';
class UserOffers extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user_offers:[
            ],
            payment:false,
            
        }
    }
    displayOffers = () =>{
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie
			},
		  };
		  fetch('/offer/user',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					response.json().then(
						offers => {
							let user_offers =[]
							// console.log("myoffers" ,offers)
							user_offers = offers.map(offer => {
                                console.log("offer",JSON.parse(offer))
								const temp =
                                {
									shop_id:JSON.parse(offer).shop_id,
									shop_name:JSON.parse(offer).shop_name,
                                    product_id:JSON.parse(offer).product_id,
                                    product_name:JSON.parse(offer).product_name,
                                    price_per_unit:JSON.parse(offer).price_per_unit,
                                    amount:JSON.parse(offer).amount,
                                    is_purchaseable:JSON.parse(offer).is_purchaseable,
                                    is_counter_offer:JSON.parse(offer).is_counter_offer,
                                    offer_id:JSON.parse(offer).offer_id,
								}
                                // console.log("temp",temp)
								return temp;
							})
							this.setState({user_offers})
						}
						)
					break;
					case 400:
					const err_message = await response.text();
					console.log("My offers error message", err_message)
                    // this.setState({cart:[],alertMsg:'',visible:false,showPayment:false,name:'',cardNo:'',data:''})
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
	}
    componentDidMount() {
        this.displayOffers();
    }
    
    render() {
        return (
            <div className="wrapper2 fadeInDown">
            <div id="form3">
                <div className="fadeIn first">
                    <h1>My Offers</h1>
                </div>
                <form>
                    <ul>
                        { this.state.user_offers.length === 0 ? <div class="rowalert alert alert-danger" role="alert">
                                                                <i className="icon3 far fa-bell"><h4>No offers available.</h4></i> 
                                                            </div>
                        : this.state.user_offers.map((offer) => 
                        <Offer offer={offer}></Offer>
                        )}
                    </ul>
                </form>
            </div>
        </div>
        )
    }
}
export default UserOffers;