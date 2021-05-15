import React, {Component} from 'react';
import Reactlogo from './images/roles.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { Link } from 'react-router-dom';
class RoleSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedUser:false,
            isManager:false,
            isAdmin: false
        };
    }
    componentDidMount() {
        this.isUser();
        this.isManager();
        this.isAdmin();
        // const user = this.isUser();
        // console.log("mountuser->",user)
        // const manager = this.isManager();
        // const admin = this.isAdmin();
        // this.setState({isLoggedUser:user, isManager:manager, isAdmin:admin})
        // console.log("state->>>",this.state)
    }
    isUser = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie},
        };
        fetch("/user/is/loggedin", requestOptions)
            .then(async response => {
                switch(response.status){
                    case 200:
                        let value = await response.text();
                        value = value === "true" ? true : false;
                        this.setState({isLoggedUser:value})
                        // return value;
                        break;
                    default:
                        this.setState({isLoggedUser:false})
                        // return false;
                        break;       
                }
            });
    }
    isManager = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie},
        };
        fetch("/user/is/manager", requestOptions)
            .then(async response => {
                switch(response.status){
                    case 200:
                        let value = await response.text();
                        value = value === "true" ? true : false;
                        this.setState({isManager:value})
                        // return value;
                        break;
                    default:
                        this.setState({isManger:false})
                        // return false;
                        break;
                }
            });
    }
    isAdmin = () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie},
        };
        fetch("/user/is/admin", requestOptions)
            .then(async response => {
                switch(response.status){
                    case 200:
                        let value = await response.text();
                        value = value === "true" ? true : false;
                        this.setState({isAdmin:value})
                        // return value;
                        break;
                    default:
                        this.setState({isAdmin:false})
                        // return false;
                        break;
                }
            });
    }

    render() {
        return(
        <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
                 <img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form>
                    {this.state.isLoggedUser && 
                    <Link to="/home">
                    <div className="row-3"><button className="role btn btn-info btn-lg" > User </button></div>
                    </Link>}
                    {this.state.isManager && 
                    <Link to="/managerHome">
                    <div className="row-3"><button className="role btn btn-info btn-lg" > Manager </button></div>
                    </Link>}
                    {this.state.isAdmin &&
                    <Link to="/admin-menu">
                    <div className="row-3"><button className="role btn btn-info btn-lg" > Admin </button></div>
                    </Link>}
                </form>
            </div>
        </div>
        );
    }
}

export default RoleSelection;