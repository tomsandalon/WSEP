import React, {Component} from 'react';
import Reactlogo from './images/login.png'
import {Alert} from 'reactstrap';
import '../index.css';
class Login extends Component {
state = {
    email:'',
    password:'',
    visible:false,
    errorMsg:''
    
};

handleSubmit = (event) =>{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email:this.state.email,
            password:this.state.password
        })
    };
    fetch('/login',requestOptions)
        .then(async response => {
            switch (response.status) {
                case 200: //welcome
                    this.setState({errorMsg:"Login sucessfully",visible:true})
                    break;
                case 401:
                    const err_message = await response.text();
                    this.setState({errorMsg:err_message,visible:true})
                    break;
                case 404: //server not found
                    break;
                default:
                    break;
            }
        })
    event.preventDefault();
}
handleUserEmail = (event) =>{
    this.setState({email:event.target.value});
}
handlePassword = (event) =>{
    this.setState({password:event.target.value});
}
toggle(){
    this.setState({visible:!this.state.visible, errorMsg:''})
}
    render() {
        return(
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <div className="fadeIn first">
      <             img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" id="login" className="fadeIn second" name="login" placeholder="example@example.com" onChange={this.handleUserEmail}/>
                    <input type="password" id="password" className="fadeIn third" name="login" placeholder="Password" onChange={this.handlePassword}/>
                <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                    <input type="submit" className="fadeIn fourth" value="Login"/>
                </form>
            </div>
        </div>
        );
    }
}
export default Login;