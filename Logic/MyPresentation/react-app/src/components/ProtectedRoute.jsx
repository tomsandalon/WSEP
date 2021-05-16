import React from 'react';
import {Redirect,Route} from 'react-router-dom';
import auth from './Auth';
export const ProtectedRoute = ({component:Component , ...rest}) => {
    return(
        <Route {...rest} render ={
            (props) => {
                if(auth.checker(props.isUser,props.isOwner,props.isManager,props.isAdmin)){
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