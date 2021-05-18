import React from 'react';
import {Redirect,Route} from 'react-router-dom';
// import auth from './Auth';
export const ProtectedRoute = ({component:Component , ...rest}) => {
    //auth.checker({...rest}.isUser,{...rest}.isOwner,{...rest}.isManager,{...rest}.isAdmin
    return(
        <Route {...rest} render ={
            (props) => {
                if(true){
                return <Component {...props}/>
                }
                else{
                    return <Redirect to="/home"/> 
                }
            }
        }
    />
    )
}