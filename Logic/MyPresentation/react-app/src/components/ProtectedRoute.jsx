import React  ,{ useEffect } from 'react';
import {Redirect,Route, useHistory} from 'react-router-dom';
export function ProtectedRoute ({component:Component , ...rest}) {
    //auth.checker({...rest}.isUser,{...rest}.isOwner,{...rest}.isManager,{...rest}.isAdmin
    // const [token, setToken] = useState('');
    const history = useHistory();
    const handleHistory = () => {
        history.push("/unatohrized");
    }
  useEffect(() => {
    if({...rest}.role === "owner")
        isOwner();
    if({...rest}.role === "manager")
        isManager();
    if({...rest}.role === "admin")
        isAdmin(); 
  }, []);

  const isManager = async () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    let response = await fetch("/user/is/manager", requestOptions);
    switch (response.status){
        case 200:
            let value = await response.text();
            value = value === "true" ? true:false;
            if(value)
                break;
            handleHistory();
            break;
        default:
            handleHistory();
            break;
    }
  };
  const isOwner = async () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    let response = await fetch("/user/is/owner", requestOptions);
    switch (response.status){
        case 200:
            let value = await response.text();
            value = value === "true" ? true:false;
            if(value)
                break;
            handleHistory();
            break;
        default:
            handleHistory();
            break;
    }
  };
  const isAdmin = async () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    let response = await fetch("/user/is/admin", requestOptions);
    switch (response.status){
        case 200:
            let value = await response.text();
            value = value === "true" ? true:false;
            if(value)
                break;
            handleHistory();
            break;
        default:
            handleHistory();
            break;
    }
  };

    return(
        <Route {...rest} render ={
            (props) => {
                // sessionStorage.setItem("loggedUser","LoggedIn")
                if(sessionStorage.getItem("loggedUser") === "LoggedIn"){   
                    return <Component {...props}/>
                }
                else{
                    console.log("hihi");
                    return <Redirect to="/unatohrized"/> 
                }
            }
        }
    />
    )
}