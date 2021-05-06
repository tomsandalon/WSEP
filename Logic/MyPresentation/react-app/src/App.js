import React, {Component} from 'react';
import Register from './components/Register'
import Login from './components/Login'
import Navigation from './components/Navbar/Navigation'
import ShopItems from './components/ShopItems';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Payment from './components/Payment';
import ShoppingCart from './components/ShoppingCart';
import BasketItem from './components/BasketItem';
class App extends Component{
  handleLogout = () =>{
    console.log("Logged out");
  }
    render(){
    return (
      <Router>
        <div className="app">
          <Navigation handleLogout={this.handleLogout}/>
          <Switch>
            <Route path="/home" exact component={ShopItems}/>
            <Route path="/my-cart" component={ShoppingCart}/>
            <Route path="/login" component={Login} />
            <Route path="/payment" component={Payment}/>
            <Route path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
