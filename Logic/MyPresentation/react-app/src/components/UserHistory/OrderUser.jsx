import React,{Component} from 'react';
import Image from '../images/cart.png';
import OrderItem from './OrderItem';
class OrderHistory extends Component {
    render() {
        return (
            <React.Fragment>
			<main className="col-md-8">
            <h1>Order ID: {this.props.order_id}</h1>
			{this.props.products.map(product => 
				<OrderItem img={Image}
                shop_id={this.props.shop_id}
                shop_name={this.props.shop_name}
                amount={product._amount} 
                product_id={product._product_id}
                item_name={product._name}
                item_desc={product._description} 
                price={product._actual_price}/>
            )
            }
		</main> 
        </React.Fragment>
        )
    }
    
}
export default OrderHistory;