import React from "react";
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
import RoleSelection from "./components/RoleSelection";
import {ProtectedRoute} from "./components/ProtectedRoute";
import Payment from "./components/Payment";
import UserHistory from "./components/UserHistory/UserHistory";
import AdminMenu from "./components/Admin/AdminMenu";
import Notifications from "./components/Notifications/Notifications";
function App() {
  // isGuest = () =>{
  //   if(this.state.permissions.guest === false && this.state.permissions.admin === false && this.state.permissions.loggedUser === false)
  //     return true
  //   return false;
  // }
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" render={() => <ShopItems />} />
          <Route path="/notifications" component={Notifications}/>
          <Route role={"logged-user"} path="/roles" component={RoleSelection} />
          <Route path="/user-history" component={UserHistory} />
          <Route path="/my-cart" component={ShoppingCart} />
          <Route path="/login" render={() => <Login />} />
          <Route path="/managerHome" component={ManagerHome} />
          <Route path="/register" component={Register} />
          <Route path="/admin-menu" component={AdminMenu} />
          <Route path="/addmanager/:storeID">
            <AddManager />
          </Route>
          <ProtectedRoute isUser={true} isOwner={false} isManager={false} isAdmin={false} path="/payment" component={Payment} />
          <Route path="/addstore">
            <AddStore />
          </Route>
          <Route path="/managersStore/:storeID/:name">
            <ManagersStore />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
