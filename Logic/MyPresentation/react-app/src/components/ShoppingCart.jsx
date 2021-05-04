import React, {Component} from 'react';
import Image from './images/cart.png';
import BasketItem from './BasketItem';

class ShoppingCart extends Component {
    state = {items:[
        {
            name:'Jeanse for hiking Jeanse for hiking ',
            price:129
        },
        {
            name:'Vodka for drinking Vodka for drinking',
            price:150
        },
        {
            name:'Pizza for eating Pizza for eating',
            price:30
        },
        {
            name:'Guns for shooting Guns for shooting',
            price:1500
        },
]};
    render() {
        return(
            <div className="row">
		<main classNameName="col-md-9">
            {this.state.items.map((item,index) =>(
            <BasketItem img={Image} text={item.name} price={item.price}/>
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
				<a href="#" className="btn btn-primary btn-block"> Purchase </a>
				<p className="small my-3 text-muted">Some extra informative text  can be placed here as dummy text will be replaced</p>
				<a href="#" className="btn btn-outline-warning btn-block">Installment</a>
			</div> 
			</div> 
		</aside> 
	</div>
        );
    }
}
export default ShoppingCart;