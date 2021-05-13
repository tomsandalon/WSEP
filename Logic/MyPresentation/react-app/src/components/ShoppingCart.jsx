import React, {Component} from 'react';
import Basket from './Basket';
class ShoppingCart extends Component {
	state = {
		cart:[]
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
							this.setState({cart:cart})
						}
						)
					break;
					case 400:
					const err_message = await response.text();
					console.log("shopping cart error msg", err_message)
                    this.setState({cart:[]})
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
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
							const cart = baskets.map(basket => {
								const temp ={
									basket_id:JSON.parse(basket).basket_id,
									shop_id:JSON.parse(basket).shop.id,
									shop_name:JSON.parse(basket).shop.name,
									products:JSON.parse(basket).products,
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
	  render(){
		  return(
				<div className="row">
					{this.state.cart.length === 0 ? <div className="col-4"><h1>Cart is empty!</h1></div> : this.state.cart.map(basket => 
					<Basket refreshCart={this.refreshCart} basket_products={basket.products} selected_basket={basket}></Basket>
					)}
				</div>
		  );
	  }
	}
	
export default ShoppingCart;