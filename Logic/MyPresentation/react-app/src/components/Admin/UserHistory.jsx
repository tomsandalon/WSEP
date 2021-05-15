import React, { Component} from 'react';
import Product from './Product';
class UserHistory extends Component {
    render() {
        return (
            <React.Fragment>
                {console.log(this.props.history)}
                <h1>Order ID({this.props.history.order_id}) Shop: {this.props.history.shop_name}</h1>
                <h3>PurchaseDate: {this.props.history.date}</h3>
                {this.props.history.products.map((product,index) =>
                    <Product product={product} index={index}/>
                    )}
            </React.Fragment>
        )
    }
}
export default UserHistory;