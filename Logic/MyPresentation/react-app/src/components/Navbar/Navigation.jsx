import React, {Component} from 'react';
import {MenuItems} from './MenuItems';
import {Alert} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../index.css';
import './Navbar.css'

class Navigation extends Component {
    state ={
        clicked:false,
        index:MenuItems.length,
        errorMsg:'',
        visible:false,
        successVisible:false,
    }
handleLogout = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
                    'Cookie': document.cookie}
    };
    fetch('/logout',requestOptions)
        .then(async response => {
            switch (response.status) {
                case 200: //welcome
                    this.setState({errorMsg:"Logged out sucessfully",visible:true})
                    this.onShowAlert();
                    break;
                case 401:
                    const err_message = await response.text();
                    this.setState({errorMsg:err_message,visible:true})
                    break;
                case 404: //server not found
                    break;
                default:
                    break;
            }
        })



    if (localStorage.getItem("loggedUser") != null) {
        console.log("here")
        localStorage.removeItem("loggedUser")
        document.cookie.delete("loggedUser")
    }
}
handleClick = () =>{
    this.setState({clicked:!this.state.clicked})
}
onShowAlert = ()=>{
    this.setState({successVisible:true,errorMsg:"Added to cart!",desiredAmount:0},()=>{
        window.setTimeout(()=>{
        this.setState({successVisible:false})
        },1000)
    });
}
toggle(){
    this.setState({visible:!this.state.visible, errorMsg:''})
}
    render(){
        return (
            <nav className="navbarItems">
                <h3 className="navbar-logo"><a className="fab fa-react" href="/">Eccomerce</a></h3>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active':'nav-menu'}>
                    {MenuItems.map((item,index) => {
                        return(
                        <li key={index}><a className={item.cName} href={item.url}>
                            {item.title}
                            </a>
                        </li>
                        );
                    })}
                    <li key={101}><a className="nav-links cartButton btn-primary btn-sm" href="/my-cart">
                            MyCart
                            </a>
                        </li>
                    <li key={100}><a className="nav-links cartButton btn-primary btn-sm" href="/home" onClick={this.handleLogout}>
                        Logout</a>
                        <Alert color="success" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert>
                        <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                        </li>
                </ul>
            </nav>
        );
    }
}
export default Navigation;
