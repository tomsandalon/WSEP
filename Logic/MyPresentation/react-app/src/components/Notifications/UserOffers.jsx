import React,{Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offer from './Offer';
class UserOffers extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            offers:[
                {
                    shop_id:'1',
                    shop_name:'NVIDIA',
                    product_name:'gtx',
                    product_id:'1',
                    amount:'15',
                    price_per_unit:'25',
                    is_purchaseable:true,
                    is_counter_offer:true,
                },
                {
                    shop_id:'2',
                    shop_name:'KSP',
                    product_name:'rtx',
                    product_id:'2',
                    amount:'25',
                    price_per_unit:'25',
                    is_purchaseable:true,
                    is_counter_offer:false,
                },
                {
                    shop_id:'3',
                    shop_name:'IVORY',
                    product_name:'amd',
                    product_id:'3',
                    amount:'25',
                    price_per_unit:'25',
                    is_purchaseable:false,
                    is_counter_offer:false,
                }
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
		  fetch('/cart',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					response.json().then(
						offers => {
							let offer =[]
							console.log(offers)
							offer = offers.map(offer => {
								const temp ={
									// basket_id:JSON.parse(basket).basket_id,
									// shop_id:JSON.parse(basket).shop.id,
									// shop_name:JSON.parse(basket).shop.name,
									// products:JSON.parse(basket).products,
								}
								return temp;
								// JSON.parse(basket).products.forEach(product => console.log(product))
							})
							this.setState({})
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
        // this.displayOffers();
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
                        { this.state.offers.length === 0 ? <div class="rowalert alert alert-danger" role="alert">
                                                                <i className="icon3 far fa-bell"><h4>No offers available.</h4></i> 
                                                            </div>
                        : this.state.offers.map((offer) => 
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