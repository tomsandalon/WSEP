import React, {Component} from 'react';
import Image from './images/cart.png';
import BasketItem from './BasketItem';
class Basket extends Component {
    constructor(props) {
        super(props);
        let price = 0;
        this.state={
            price:0
        }
        this.props.selected_basket.products.map(product => price+=(product.amount*product.product._base_price))
        this.state = {price:price}
    }
   render() {
       return(
           <React.Fragment>
			<main className="col-md-8">
            <h1>Basket ID: {this.props.selected_basket.basket_id}</h1>
			{this.props.basket_products.map(product => 
				<BasketItem img={Image}
                shop_id={this.props.selected_basket.shop_id} amount={product.amount} basket_id={this.props.selected_basket.basket_id} 
                shop_name={this.props.selected_basket.shop_name} product_id={product.product._product_id} item_name={product.product._name} 
                price={product.product._base_price}></BasketItem>)
            }
		</main> 
		<aside className="col-md-3">
			<div className="card">
			<div className="card-body">
				<div className="input-group mb-3">
					<input type="text" className="form-control" name="" placeholder="Promo Code"/>
					<span className="input-group-append"> 
						<button className="btn btn-primary">Ok</button>
					</span>
				</div>
				<dl className="dlist-align">
				  <dt>Subtotal:</dt>
				  <dd className="text-right">{this.state.price}</dd>
				</dl>
				<dl className="dlist-align">
				  <dt>Discount:</dt>
				  <dd className="text-right text-danger">0%</dd>
				</dl>
				<dl className="dlist-align">
				  <dt>Grand Total:</dt>
				  <dd className="text-right text-dark"><strong>{this.state.price}</strong></dd>
				</dl>
				<button href="#" className="btn btn-primary btn-block"> Purchase </button>
				<p className="small my-3 text-muted">Some extra informative text  can be placed here as dummy text will be replaced</p>
			</div> 
			</div> 
		</aside> 
        </React.Fragment>
       )
   }
}
export default Basket;