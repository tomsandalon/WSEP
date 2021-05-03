import React, { Component} from 'react';
import './Product.css';
class ItemOfShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:this.props.name,
            available:this.props.available,
            amount:this.props.amount,
            price:this.props.price
        }
    }
    render() {
        return (
            <React.Fragment>
                <tr>
                    <td>
                        <img src="https://dummyimage.com/50x50/55595c/fff" /> </td>
                                        <td>{this.state.name}</td>
                                        <td>{this.state.available}</td>
                                        <td>{this.state.amount}</td>
                                        <td>{this.state.price}</td>
                </tr>
            </React.Fragment>
        );
    }
}
export default ItemOfShop;