import React, {Component} from 'react';
import Image from './images/cart.png';
import BasketItem from './BasketItem';

class ShoppingCart extends Component {
	state = {
		cart:[]
	}
	componentDidMount() {
		console.log("cookies",document.cookie);
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
								console.log(JSON.parse(basket))
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
		this.setState({visible:!this.state.visible, errorMsg:''})
	}
    render() {
        return(
            <div className="row">
		<main className="col-md-9">
            {this.state.cart.map((basket,index) =>(
			basket.products.map(product => 
				<BasketItem img={Image} shop_id={basket.shop_id} amount={product.amount} basket_id={basket.basket_id} shop_name={basket.shop_name} product_id={product.product._product_id} item_name={product.product._name} price={product.product._base_price}/>
				)
            ))}
		</main> 
		<aside className="col-md-3">
			<div className="card">
			<div className="card-body">
				<div className="input-group mb-3">
					<input type="text" className="form-control" name="" placeholder="Promo code"/>
					<span className="input-group-append"> 
						<button className="btn btn-primary">Ok</button>
					</span>
				</div>
				<dl className="dlist-align">
				  <dt>Subtotal:</dt>
				  <dd className="text-right">$938.50</dd>
				</dl>
				<dl className="dlist-align">
				  <dt>Discount:</dt>
				  <dd className="text-right text-danger">10%</dd>
				</dl>
				<dl className="dlist-align">
				  <dt>Grand Total:</dt>
				  <dd className="text-right text-dark"><strong>$948.50</strong></dd>
				</dl>
				<button href="#" className="btn btn-primary btn-block"> Purchase </button>
				<p className="small my-3 text-muted">Some extra informative text  can be placed here as dummy text will be replaced</p>
			</div> 
			</div> 
		</aside> 
	</div>
        );
    }
}
export default ShoppingCart;