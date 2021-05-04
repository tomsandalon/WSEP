import React, {Component} from 'react';
import Register from './components/Register'
import Login from './components/Login'
import Navigation from './components/Navbar/Navigation'
import Home from './components/Home';
import ShopItems from './components/ShopItems';
import FiltersItems from './components/FiltersItems';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Payment from './components/Payment';

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
            <Route path="/" exact component={ShopItems}/>
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
