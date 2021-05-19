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
import UserHistory from "./components/UserHistory/UserHistory";
import AdminMenu from "./components/Admin/AdminMenu";
import Notifications from "./components/Notifications/Notifications";
import Unatho from "./components/Unatho";
function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Switch>
          <Route exact path="/"><Redirect to="/home" /></Route>
          <Route path="/home" render={() => <ShopItems />} />
          <ProtectedRoute path="/notifications" component={Notifications}/>
          <ProtectedRoute path="/roles" component={RoleSelection} />
          <ProtectedRoute path="/user-history" component={UserHistory} />
          <Route path="/my-cart" component={ShoppingCart} />
          <Route path="/login" render={() => <Login />} />
          <Route path="/managerHome" component={ManagerHome} />
          <Route path="/register" component={Register} />
          <ProtectedRoute role={"admin"} path="/admin-menu" component={AdminMenu} />
          <Route path="/unauthorized" component={Unatho}/>
          <Route path="/addmanager/:storeID"><AddManager/></Route>
          <Route path="/addstore"><AddStore/></Route>
          <Route path="/managersStore/:storeID/:name"><ManagersStore/></Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
