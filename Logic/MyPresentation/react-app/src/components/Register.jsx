import React, {Component} from 'react';
import Reactlogo from './images/register.png'
import {Alert} from 'reactstrap';

class Register extends Component {
state = {
    email:'',
    password:'',
    visible:false,
    successVisible:false,
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
      fetch('/register',requestOptions)
      .then(async response => {
        switch (response.status) {
            case 200: //welcome
                // const err_message_sucess = await response.text();
                this.onShowAlert();
                break;
            case 400:
                const err_message_fail = await response.text();
                this.setState({errorMsg:err_message_fail,visible:true})
                break;
            case 404: //server not found
                break;
            default:
                break;
        }
      })
      event.preventDefault();
}  
onShowAlert = ()=>{
    this.setState({successVisible:true,errorMsg:"Successfully registered!",desiredAmount:0},()=>{
        window.setTimeout(()=>{
        this.setState({successVisible:false})
        },1000)
    });
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
        <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
      <             img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" id="login" className="fadeIn second" name="login" placeholder="example@example.com" onChange={this.handleUserEmail}/>
                    <input type="password" id="password" className="fadeIn third" name="login" placeholder="Password" onChange={this.handlePassword}/>
                    <Alert color="success" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert>
                    <Alert color="danger" toggle={this.toggle.bind(this)} isOpen={this.state.visible}>{this.state.errorMsg}</Alert>
                    <input type="submit" className="fadeIn fourth" value="Register" onSubmit={this.handleSubmit}/>
                </form>
            </div>
        </div>
        );
    }
}
export default Register;