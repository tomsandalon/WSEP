import React, {Component} from 'react';
import Register from './components/Register'
import Login from './components/Login'
import Navigation from './components/Navbar/Navigation'
import ShopItems from './components/ShopItems';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Payment from './components/Payment';
import ShoppingCart from './components/ShoppingCart';
class App extends Component{
  state = {
    shopsInfo:[]
  };
  handleLogout = () =>{
    console.log("Logged out");
  }
  openSession = () =>{
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/home',requestOptions)
        .then(response => response.json())
        .then(shops=>{
          let shopsInfo = [];
          shops.map(shop =>{
            const tempShop = JSON.parse(shop);
            const products_string = JSON.parse(tempShop.products);
            const products = products_string.map(product => JSON.parse(product));
            // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
            const shopInfo = {id:tempShop.shopID,name:tempShop.name,products:products};
            shopsInfo.push(shopInfo);
          })
          this.setState({shopsInfo:shopsInfo})
          console.log("hey")
          console.log(this.state.session)
        })
  }
  componentDidMount() {
    this.openSession()
  }

  handleCategory = (category) => {
    // const requestOptions = {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     category_name:category
    // })
    // };
    // fetch('/home/filter',requestOptions)
    //     .then(response => response.json())
    //     .then(shops=>{
    //       let shopsInfo = [];
    //       shops.map(shop =>{
    //         const tempShop = JSON.parse(shop);
    //         const products_string = JSON.parse(tempShop.products);
    //         const products = products_string.map(product => JSON.parse(product));
    //         // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
    //         const shopInfo = {id:tempShop.shopID,name:tempShop.name,products:products};
    //         shopsInfo.push(shopInfo);
    //       })
    //       this.setState({shopsInfo:shopsInfo})
    //       console.log("hey")
    //       console.log(this.state.session)
    //     })
    console.log(category)
  }
  render(){
    return (
      <Router>
        <div className="app">
          <Navigation handleLogout={this.handleLogout}/>
          <Switch>
            <Route path="/home" render={() => (<ShopItems handleCategory={this.handleCategory} shopsInfo={this.state.shopsInfo}/>)}/>
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
