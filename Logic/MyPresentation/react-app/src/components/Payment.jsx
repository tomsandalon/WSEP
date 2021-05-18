import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Reactlogo from './images/payment.png'
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            cardNo:'',
            data:'',
            successVisible:false,
            errorMsg:''
        };
    };
    //purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string)
    handleName = (event) => {this.setState({name:event.target.value})};
    handleCard = (event) => {this.setState({cardNo:event.target.value});}
    handleData = (event) => {this.setState({data:event.target.value});
    console.log(this.state.name+this.state.cardNo +this.state.data);
}
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                shop_id:this.props.shop_id,
                payment:this.state.name+this.state.cardNo +this.state.data
            })
        };
        fetch('/purchase',requestOptions)
            .then(async response => {
                switch (response.status) {
                    case 200: //welcome
                        console.log("sucesss>>>")
                        // this.props.refreshCart();
                        break;
                    case 400:
                        const err_message_fail = await response.text();
                        console.log("payment error>>>>>>>>",err_message_fail);        
                        break;
                    case 404: //server not found
                        break;
                    default:
                        break;
                }
            });
    }    
    render() {
        return (
            <div className="wrapper fadeInDown" href="#register">
            <div id="formContent">
                <div className="fadeIn first">
                <img src={Reactlogo} id="icon" alt="User Icon" />
                </div>
                <form>
                    <input type="text" className="pay fadeIn second" placeholder="Ex. John Smith" onChange={this.handleName}/>
                    <input type="text" className="pay fadeIn third" placeholder="Card No." onChange={this.handleCard}/>
                    <input type="text" className="pay fadeIn third" placeholder="MM/YY/CVV" onChange={this.handleData}/>
                    <button type="submit" class="pay2 btn btn-primary" onClick={this.handleSubmit}>Pay</button>
                    <button type="submit" class="pay2 btn btn-primary" onClick={() => this.props.cancelPayment}>Cancel</button>
                  </form>
            </div>
        </div> 
        );
    }
}
export default Payment;