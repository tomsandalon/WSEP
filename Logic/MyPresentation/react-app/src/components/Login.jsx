import React, {Component} from 'react';
import Reactlogo from './images/login.png'
import '../index.css';
class Login extends Component {
state = {
    email:'',
    password:''
};

handleSubmit = (event) =>{
    console.log(this.state);
    event.preventDefault();
}
handleUserEmail = (event) =>{
    this.setState({email:event.target.value});
}
handlePassword = (event) =>{
    this.setState({password:event.target.value});
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
                    <input type="submit" className="fadeIn fourth" value="Login"/>
                </form>
            </div>
        </div>
        );
    }
}
export default Login;