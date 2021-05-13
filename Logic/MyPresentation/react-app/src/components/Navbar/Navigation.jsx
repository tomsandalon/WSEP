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
                    console.log("logout suc", response.status);
                    localStorage.removeItem("loggedUser");
                    //this.setState({errorMsg:"Logged out sucessfully",visible:true})
                    //this.onShowAlert();
                    window.location.reload("/home")
                    break;
                case 400:
                    const err_message = await response.text();
                    //this.setState({errorMsg:err_message,visible:true})
                    localStorage.removeItem("loggedUser");
                    console.log("errorMsg");
                    window.location.reload("/home")
                    break;
                case 404: //server not found
                    break;
                default:
                    break;
            }
        }
    )
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
                    {localStorage.getItem('loggedUser') === "Guest" && MenuItems.map((item,index) => {
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
                        {localStorage.getItem('loggedUser') === "LoggedIn" && <li key={103}>
                        <a className="nav-links cartButton2 btn-primary btn-sm" href="/user-history">
                            Purchase History</a>
                        </li>}    
                        {localStorage.getItem('loggedUser') === "LoggedIn" && <li key={102}>
                        <a className="nav-links cartButton btn-primary btn-sm" href="/roles">
                            Roles</a>
                        </li>}
                        {localStorage.getItem('loggedUser') === "LoggedIn" && <li key={100}><a className="nav-links cartButton btn-primary btn-sm" onClick={this.handleLogout}>
                        Logout</a>
                        <Alert color="success" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert>
                        <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                        </li>}
                       
                </ul>
            </nav>
        );
    }
}
export default Navigation;
