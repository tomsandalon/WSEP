import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'
class RadioShop extends Component {
    render() {
        return(
            <li key={this.props.id}>
                <button type="button" class="test btn btn-info" onClick={() => this.props.handleShop(this.props.user)}>{this.props.user}</button>
            </li>
        )
    }
}
export default RadioShop;