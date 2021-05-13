import React, {Component} from 'react';
import Reactlogo from './images/roles.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { Link } from 'react-router-dom';
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
                    <Link to="/home">
                    {this.isUser() && <div className="row-3"><button className="role btn btn-info btn-lg" > User </button></div>}
                    </Link>
                    <Link to="/home">
                    {this.isManager() && <div className="row-3"><button className="role btn btn-info btn-lg" > Manager </button></div>}
                    </Link>
                    <Link to="/home">
                    {this.isAdmin() && <div className="row-3"><button className="role btn btn-info btn-lg" > Admin </button></div>}
                    </Link>
                </form>
            </div>
        </div>
        );
    }
}

export default RoleSelection;