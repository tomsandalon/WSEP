import React, { Component } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Navigation from "./components/Navbar/Navigation";
import ShopItems from "./components/ShopItems";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ManagerHome from "./pages/ManagerHome";
import ShoppingCart from "./components/ShoppingCart";
import "./App.css";
import AddManager from "./pages/Add_Manager";
import AddStore from "./pages/Add_Store";
import ManagersStore from "./pages/ManagersStore";
class App extends Component {
  state = {
    shopsInfo: [],
  };
  handleLogout = () => {
    console.log("Logged out");
  };
  displayShops = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/home", requestOptions)
      .then((response) => response.json())
      .then((shops) => {
        let shopsInfo = [];
        shops.map((shop) => {
          const tempShop = JSON.parse(shop);
          const products_string = JSON.parse(tempShop.products);
          const products = products_string.map((product) =>
            JSON.parse(product)
          );
          // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
          const shopInfo = {
            id: tempShop.shopID,
            name: tempShop.name,
            products: products,
          };
          shopsInfo.push(shopInfo);
        });
        this.setState({ shopsInfo: shopsInfo });
        console.log(this.state.session);
      });
  };
  openSession = () => {
    if (localStorage.getItem("loggedUser") == null) {
      localStorage.setItem("loggedUser", "true");
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/guest", requestOptions).then(async (response) => {
        switch (response.status) {
          case 200: //welcome
            break;
          case 404:
            const err_message = await response.text();
            console.log(err_message);
            break;
          default:
            break;
        }
      });
    }
  };
  componentDidMount() {
    this.openSession();
    this.displayShops();
  }

  handleFilter = (filters) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_names: filters.categoriesFilter,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        search_name_term: filters.search,
      }),
    };
    fetch("/home/filter", requestOptions)
      .then((response) => response.json())
      .then((shops) => {
        let shopsInfo = [];
        shops.map((shop) => {
          const tempShop = JSON.parse(shop);
          const products_string = JSON.parse(tempShop.products);
          const products = products_string.map((product) =>
            JSON.parse(product)
          );
          // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
          const shopInfo = {
            id: tempShop.shopID,
            name: tempShop.name,
            products: products,
          };
          shopsInfo.push(shopInfo);
        });
        this.setState({ shopsInfo: shopsInfo });
      });
  };
  render() {
    return (
      <Router>
        <div className="app">
          <Navigation handleLogout={this.handleLogout} />
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route
              path="/home"
              render={() => (
                <ShopItems
                  handleFilter={this.handleFilter}
                  shopsInfo={this.state.shopsInfo}
                />
              )}
            />
            <Route path="/my-cart" component={ShoppingCart} />
            <Route path="/login" component={Login} />
            <Route path="/managerHome/:managerID" component={ManagerHome} />
            <Route path="/register" component={Register} />
            <Route path="/addmanager/:storeID">
              <AddManager />
            </Route>
            <Route path="/addstore/:managerID">
              <AddStore />
            </Route>
            <Route path="/managersStore/:storeID">
              <ManagersStore />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
