import React, { Component } from "react";
import Image from "./images/shirt.jpg";
import "./Product.css";
class EditableItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      available: this.props.available,
      amount: this.props.amount,
      price: this.props.price,
    };
  }
  render() {
    return (
      <div className="col-md-3">
        <figure className="itemside mb-4">
          <div className="right-aside">
            <img src={Image} alt="E" className="img-sm" />
          </div>
          <figcaption className="info align-self-center">
            <h4 classNameName="center">{this.state.name}</h4>
            <h4>{this.state.available}</h4>
            <h4>{this.state.amount}</h4>
            <h4>{this.state.price}</h4>
            <button className="btn btn-outline-primary btn-sm">
              {" "}
              Edit Item <i className="fa fa-edit"></i>
            </button>
          </figcaption>
        </figure>
      </div>
    );
  }
}
export default EditableItem;
