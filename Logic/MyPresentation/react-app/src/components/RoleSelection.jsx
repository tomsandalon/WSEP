import React, {Component} from 'react';
import Reactlogo from './images/roles.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
class RoleSelection extends Component {

    isUser = () => {
        return true;
    }
    isManager = () => {
        return true;
    }
    isAdmin = () => {
        return true;
    }
    render() {
        return(
        <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
      <             img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form>
                    {this.isUser() && <div className="row-3"><button className="role btn btn-info btn-lg" onClick={this.handleRemoveItemFromBasket}> User </button></div>}
                    {this.isManager() && <div className="row-3"><button className="role btn btn-info btn-lg" onClick={this.handleRemoveItemFromBasket}> Manager </button></div>}
                    {this.isAdmin() && <div className="row-3"><button className="role btn btn-info btn-lg" onClick={this.handleRemoveItemFromBasket}> Admin </button></div>}
                </form>
            </div>
        </div>
        );
    }
}

export default RoleSelection;