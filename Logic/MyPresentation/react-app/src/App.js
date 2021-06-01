import React, {useState,useEffect} from "react";
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
import AddProduct from "./pages/Add_Product";
import EditProduct from "./pages/Edit_Product";
import EditPermissionsPre from "./pages/EditPermissionsPre";
import Notifications from "./components/Notifications/Notifications";
import Unatho from "./components/Unatho";
import SocketIO from 'socket.io-client';

function App() {
  const [counter,setCounter] = useState(0);
  const cookie = document.cookie;
  const port = 8000;
  const localhost = 'https://localhost:' + port;
  const [socket, setSocket] = useState(SocketIO(localhost));
  useEffect(() => {
    console.log("Hello react",counter);
    setCounter(counter + 1);
  },[]);
  return (
    <Router>
      <div className="app">
        <Navigation socket={socket} />
        <Switch>
          <Route exact path="/"><Redirect to="/home" /></Route>
          <Route path="/home" render={() => <ShopItems />} />
          <ProtectedRoute path="/notifications"><Notifications socket={socket}/></ProtectedRoute>
          <ProtectedRoute path="/roles" component={RoleSelection} />
          <ProtectedRoute path="/user-history" component={UserHistory} />
          <Route path="/my-cart" component={ShoppingCart} />
          <Route path="/login" render={() => <Login socket={socket}/>} />
          <Route path="/managerHome" component={ManagerHome} />
          <Route path="/register" component={Register} />
          <ProtectedRoute role={"admin"} path="/admin-menu" component={AdminMenu} />
          <Route path="/unauthorized" component={Unatho}/>
          <Route path="/addmanager/:storeID/:managerOwner/:storeName"><AddManager/></Route>
          <Route path="/addstore"><AddStore/></Route>
          <Route path="/managersStore/:storeID/:name"><ManagersStore/></Route>
          <Route path="/addproduct/:storeID/:storeName"><AddProduct /></Route>
          <Route path="/editproduct/:storeID/:storeName"><EditProduct /></Route>
          <Route path="/editpermissionspre/:storeID/:storeName/:managerID"><EditPermissionsPre /></Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
