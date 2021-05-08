import React, {Component} from 'react';
import Reactlogo from './images/register.png'
class Register extends Component {
state = {
    email:'',
    password:''
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
      fetch('/register',requestOptions)
          .then(response => console.log(response.status))
    event.preventDefault();
}
handleGuest = () =>{
    console.log("guest");
}
handleUserEmail = (event) =>{
    this.setState({email:event.target.value});
}
handlePassword = (event) =>{
    this.setState({password:event.target.value});
}
    render() {
        return(
        <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
      <             img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" id="login" className="fadeIn second" name="login" placeholder="example@example.com" onChange={this.handleUserEmail}/>
                    <input type="password" id="password" className="fadeIn third" name="login" placeholder="Password" onChange={this.handlePassword}/>
                    <input type="button" id="guest" className="fadeIn third" name="guest" value="Guest login" onClick={this.handleGuest}/> 
                    <input type="submit" className="fadeIn fourth" value="Register" onSubmit={this.handleSubmit}/>
                </form>
            </div>
        </div>
        );
    }
}
export default Register;