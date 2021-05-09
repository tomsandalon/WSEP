import React, {Component} from 'react';
import Basket from './Basket';
class ShoppingCart extends Component {
	state = {
		cart:[],
		totalPrice:0
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
							let price = 0;
							cart.forEach(basket => 
								basket.products.forEach(product => price+=(product.amount*product.product._base_price))
								)
							this.setState({cart:cart,price:price})
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
					{this.state.cart.map(basket =>
					<Basket basket_products={basket.products} selected_basket={basket}></Basket>
					)}
				</div>
		  );
	  }
	}
	// calculateTotalPrices() {
	// 	let price = 0;
	// 	this.state.cart.forEach(basket => 
	// 		basket.products.forEach(product => price+=(product.amount*product.product._base_price))
	// 		)	//<Basket selected_basket={basket} basket_products={basket.products}></Basket>)}
	// 	this.setState({price:price})
	// }
	// toggle(){
	// 	this.setState({visible:!this.state.visible, errorMsg:''})
	// }
    
	
export default ShoppingCart;