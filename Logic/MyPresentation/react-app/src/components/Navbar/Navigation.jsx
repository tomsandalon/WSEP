import React, {Component} from 'react';
import {MenuItems} from './MenuItems';
import '../../index.css';
import './Navbar.css'

class Navigation extends Component {
    state ={
        clicked:false,
        index:MenuItems.length
    }

handleClick = () =>{
    this.setState({clicked:!this.state.clicked})
}
    render(){
        return (
            <nav className="navbarItems">
                <h3 className="navbar-logo"><a className="fab fa-react" href="/">Mikasa Eccomerce</a></h3>
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
                    <li key={100}><a className="nav-links cartButton btn btn-sm"  value="Logout" onClick={() => this.props.handleLogout}>Logout</a></li>
                    <li key={101}><a className="nav-links cartButton btn btn-sm" href="/my-cart">
                            MyCart
                            </a>
                        </li>
                      
                </ul>
            </nav>
        );
    }
}
export default Navigation;
