import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'
class RadioUser extends Component {
    render() {
        return(
            <li key={this.props.id}>
                <button type="button" class="test btn btn-info" onClick={() => this.props.handleUser(this.props.user)} >{this.props.user}</button>
            </li>
        )
    }
}
export default RadioUser;