import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class Payment extends Component {
    render() {
        return (
    <div className="card">
        <div className="card-body">
            <h4 className="card-title mb-4">Payment info</h4>
            <form role="form">
      <div className="form-group">
      <label for="username">Name on card</label>
      <input type="text" className="form-control" name="username" placeholder="Ex. John Smith" required=""/>
      </div> 
      
      <div className="form-group">
      <label for="cardNumber">Card number</label>
      <div className="input-group">
          <input type="text" className="form-control" name="cardNumber" placeholder=""/>
          <div className="input-group-append">
              <span className="input-group-text">
                  <i className="fab fa-cc-visa"></i> &nbsp; <i className="fab fa-cc-amex"></i> &nbsp; 
                  <i className="fab fa-cc-mastercard"></i> 
              </span>
          </div>
      </div> 
      </div> 
      <div className="row">
            <figure className="itemside mb-4">
                <input type="text" className="form-control" placeholder="MM"/>
                <input type="text" className="form-control" placeholder="YY"/>
                <input type="text" className="form-control" placeholder="CVV"/>
            </figure>
      </div> 
      <button className="subscribe btn btn-primary btn-block" type="button"> Confirm  </button>
      </form>
            </div> 
          </div>  
        );
    }
}
export default Payment;