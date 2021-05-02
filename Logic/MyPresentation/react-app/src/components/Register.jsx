import React, {Component} from 'react';
import Reactlogo from './images/register-icon-blue1.png'
class Register extends Component {
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
                    <input type="text" id="login" className="fadeIn second" name="login" placeholder="example@example.com" onChange={this.handleUserEmail}/>
                    <input type="text" id="password" className="fadeIn third" name="login" placeholder="Password" onChange={this.handlePassword}/>
                    <input type="submit" className="fadeIn fourth" value="Register"/>
                </form>
            </div>
        </div>
        );
    }
}
export default Register;