import React, {Component} from 'react';
import {MenuItems} from './MenuItems';
import {Alert} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../index.css';
import './Navbar.css'

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state ={
            clicked:false,
            index:MenuItems.length,
            errorMsg:'',
            visible:false,
            successVisible:false,
            loggedUser:false,
            socket:props.socket,
            notifications:0
        };
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
                    sessionStorage.removeItem("loggedUser");
                    //this.setState({errorMsg:"Logged out sucessfully",visible:true})
                    //this.onShowAlert();
                    window.location.reload("/home")
                    break;
                case 400:
                    // const err_message = await response.text();
                    //this.setState({errorMsg:err_message,visible:true})
                    sessionStorage.removeItem("loggedUser");
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
                    this.setState({loggedUser:value})
                    // return value;
                    break;
                default:
                    this.setState({loggedUser:false})
                    // return false;
                    break;       
            }
        });
}
socketFunc = () => {
    this.state.socket.emit("Hello", document.cookie);
    this.state.socket.emit("Get pending notifications",document.cookie);
    this.state.socket.on("Get pending notifications", (amount) => {
        if(amount >= 0)
            this.setState({notifications:amount});
    });
}
componentDidMount() {
    this.isUser();
    this.interval = setInterval(() => this.socketFunc(), 1000);
}
componentWillUnmount() {
    clearInterval(this.interval);
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
addShop = () =>{
    window.location.assign("/addstore")
    // e.preventDefault();
}
toggle(){
    this.setState({visible:!this.state.visible, errorMsg:''})
}
    render(){
        return (
            <nav className="navbarItems">
                <h3 className="navbar-logo"><a className="fab fa-react" href="/">E-commerce</a></h3>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active':'nav-menu'}>
                 {this.state.loggedUser && <li key={104}><a className="nav-links cartButton3 btn-primary btn-sm" href="/notifications">
                            Notifications ({this.state.notifications})<i className="icon3 far fa-bell"></i>
                            </a>
                        </li>}
                    {this.state.loggedUser && <li key={150}><a className="nav-links cartButton btn-primary btn-sm" href="/my-offers">My Offers</a></li>}
                    {!this.state.loggedUser && MenuItems.map((item,index) => {
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
                        {this.state.loggedUser && <li key={103}>
                        <a className="nav-links cartButton2 btn-primary btn-sm" href="/user-history">
                            Purchase History</a>
                        </li>}    
                        {this.state.loggedUser && <li key={102}>
                        <a className="nav-links cartButton btn-primary btn-sm" href="/roles">
                            Roles</a>
                        </li>}
                        {this.state.loggedUser && <li key={148}><button className="nav-links cartButton btn-primary btn-sm" onClick={this.addShop}>
                        Add Shop</button></li>}
                        {this.state.loggedUser && <li key={100}><button className="nav-links cartButton btn-dark btn-sm" onClick={this.handleLogout}>
                        Logout</button>
                        <Alert color="success" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert>
                        <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                        </li>}
                       
                </ul>
            </nav>
        );
    }
}
export default Navigation;
