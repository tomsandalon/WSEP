import React, {Component} from 'react';
import Basket from './Basket';
import Image from './images/payment.png'
import {Alert} from 'reactstrap';
class ShoppingCart extends Component {
	state = {
		cart:[],
		alertMsg:'',
		visible:false,
		showPayment:false,
		name:'',
		cardNo:'',
		data:'',
	}
	handleName = (event) => {
		this.setState({name:event.target.value})
	}
    handleCard = (event) => {
		this.setState({cardNo:event.target.value})
	}
    handleData = (event) => {
		this.setState({data:event.target.value})
	}
	cancelPayment = () => {
		this.setState({showPayment:false})
	}
	refreshCart = () =>{
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
						baskets => {
							let cart =[]
							console.log(baskets)
							cart = baskets.map(basket => {
								const temp ={
									basket_id:JSON.parse(basket).basket_id,
									shop_id:JSON.parse(basket).shop.id,
									shop_name:JSON.parse(basket).shop.name,
									products:JSON.parse(basket).products,
								}
								return temp;
								// JSON.parse(basket).products.forEach(product => console.log(product))
							})
							this.setState({cart:cart,alertMsg:'',visible:false,showPayment:false,name:'',cardNo:'',data:''})
						}
						)
					break;
					case 400:
					const err_message = await response.text();
					console.log("shopping cart error msg", err_message)
                    this.setState({cart:[],alertMsg:'',visible:false,showPayment:false,name:'',cardNo:'',data:''})
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
	}
	buyCart = () => {
		this.setState({showPayment:true})
	}
	purchaseCart = () =>{
		const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                payment:this.state.name+this.state.cardNo +this.state.data
            })
        };
        fetch('/purchase/all',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        console.log("sucesss>>>cart");
						
                        this.refreshCart();
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        this.setState({alertMsg:err_message_fail,visible:true});
                        break;
                    case 404: //server not found
                        break;
                    default:
                        break;
                }
            });
	}
	componentDidMount() {
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
						baskets => {
							console.log(baskets);
							const cart = baskets.map(basket => {
								const temp ={
									basket_id:JSON.parse(basket).basket_id,
									shop_id:JSON.parse(basket).shop.id,
									shop_name:JSON.parse(basket).shop.name,
									products:JSON.parse(basket).products,
									basket_total_price:JSON.parse(basket).total_price_after_discount
								}
								return temp;
								// JSON.parse(basket).products.forEach(product => console.log(product))
							})
							this.setState({cart:cart})
						}
						)
					break;
					case 400:
					const err_message = await response.text();
                    console.log(err_message)
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
	  }
	  toggle(){
		this.setState({visible:!this.state.visible, alertMsg:''})
	}
	  render(){
		  return(
			  <div>
				  <h1>Buy all provided baskets: <button class="buyCart btn btn-primary" onClick={this.buyCart}>Buy Cart!</button></h1>
				  {this.state.showPayment && (
					  <div className="wrapper fadeInDown" href="#register">
					  <div id="formContent">
						  <div className="fadeIn first">
						  <img src={Image} id="icon" alt="User Icon" />
						  </div>
						  <form>
							  <input type="text" className="pay fadeIn second" placeholder="Ex. John Smith" onChange={this.handleName}/>
							  <input type="text" className="pay fadeIn third" placeholder="Card No." onChange={this.handleCard}/>
							  <input type="text" className="pay fadeIn third" placeholder="MM/YY/CVV" onChange={this.handleData}/>
							  <button type="button" class="pay2 btn btn-primary" onClick={this.purchaseCart}>Pay</button>
							  <button type="button" class="pay2 btn btn-primary" onClick={this.cancelPayment}>Cancel</button>
							</form>
					  </div>
					  <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.alertMsg}</Alert>   
				  </div> 

				   ) }
				<div className="row">
					{this.state.cart.length === 0 ? <div className="col-4"><h1>Cart is empty!</h1></div> : this.state.cart.map(basket => 
					<Basket refreshCart={this.refreshCart} basket_products={basket.products} selected_basket={basket}></Basket>
					)}
				</div>
			</div>
		  );
	  }
	}
	
export default ShoppingCart;