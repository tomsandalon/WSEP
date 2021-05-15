import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'
class RadioUser extends Component {
    render() {
        return(
            <li key={this.props.id}>
                <button type="button" class="test btn btn-info" onClick={() => this.props.handleUserDisplay(this.props.user_id)}>
                    ID:{this.props.user_id}   {this.props.user_email}
                    </button>
            </li>
        )
    }
}
export default RadioUser;