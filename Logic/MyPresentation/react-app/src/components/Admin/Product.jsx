import React, { Component} from 'react';

class Product extends Component {
    render() {
        return (
            <React.Fragment>
                <h1>Product {this.props.index}</h1>
                <h4>{this.props.product._name} {this.props.product._description}</h4>
                <h4>Categories: 
                    {this.props.product._category.map(cat => <h4>{cat._name}</h4>)}
                </h4>
                <h4>Original Price: {this.props.product._actual_price} Discount Price: {this.props.product._actual_price} Amount: {this.props.product._amount}</h4>
            </React.Fragment>
        )
    }
}
export default Product;