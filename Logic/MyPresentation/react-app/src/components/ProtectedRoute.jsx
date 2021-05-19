import React  ,{ useEffect, useState } from 'react';
import {Redirect,Route} from 'react-router-dom';
import auth from './Auth';
export function ProtectedRoute ({component:Component , ...rest}) {
    //auth.checker({...rest}.isUser,{...rest}.isOwner,{...rest}.isManager,{...rest}.isAdmin
    const [token, setToken] = useState('');

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!token) {
        getToken();
    }
  }, []);

  const getToken = async () => {
    // const headers = {
    //   Authorization: authProps.idToken // using Cognito authorizer
    // };
    // const response = await axios.post(
    //   "https://MY_ENDPOINT.execute-api.us-east-1.amazonaws.com/v1/",
    //   API_GATEWAY_POST_PAYLOAD_TEMPLATE,
    //   { headers }
    // );
    // const data = await response.json();
    let response = await auth.isUser();
    console.log("response>>>>",response)
    setToken(response);
  };

    return(
        <Route {...rest} render ={
            (props) => {
                if(token){
                    console.log("inside true",token);
                return <Component {...props}/>
                }
                else{
                    console.log("inside false",token);
                    return <Redirect to="/home"/> 
                }
            }
        }
    />
    )
}