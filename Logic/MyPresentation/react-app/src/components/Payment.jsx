import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Reactlogo from './images/payment.png'
class Payment extends Component {

    state = {
        name:'',
        cardNo:'',
        mm:'',
        yy:'',
        cvv:''

    }
    handleName = (event) => {this.setState({name:event.target.value});} 
    handleCard = (event) => {this.setState({cardNo:event.target.value});}
    handleMM = (event) => {this.setState({mm:event.target.value});}
    handleYY = (event) => {this.setState({yy:event.target.value});}
    handleCVV = (event) => {this.setState({cvv:event.target.value});}
    handleSubmit = (event) => 
    {
        console.log(this.state);
    }    
    on
    render() {
        return (
            <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
                <img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" className="fadeIn second" placeholder="Ex. John Smith" onChange={this.handleName}/>
                    <input type="text" className="fadeIn third" placeholder="Card No." onChange={this.handleCard}/>
                    <div className="row">
                        <div className="col-4">
                        <input type="text" className="fadeIn third" placeholder="MM" onChange={this.handleMM} />
                        </div>
                        <div className="col-4">
                        <input type="text" className="fadeIn third" placeholder="YY" onChange={this.handleYY}/>
                        </div>
                        <div className="col-4">
                        <input type="text" className="fadeIn third" placeholder="CVV" onChange={this.handleCVV}/>
                        </div>
                    </div>
                    <input type="submit" className="fadeIn fourth" value="Confirm"/>
                </form>
            </div>
        </div> 
        );
    }
}
export default Payment;