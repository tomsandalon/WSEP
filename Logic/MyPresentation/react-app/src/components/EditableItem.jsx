import React from "react";
import Image from "./images/shirt.jpg";
import "./Product.css";
const EditableItem = (props) => {
  const name = props.name;
  const amount = props.amount;
  const price = props.price;
  const id = props.id;

  return (
    <div className="col-md-3">
      <figure className="itemside mb-4">
        <div className="right-aside">
          <img src={Image} alt="E" className="img-sm" />
        </div>
        <figcaption className="info align-self-center">
          <h4 className="center">{name}</h4>
          <h4>{"Amount: " + amount}</h4>
          <h4>{"Price: " + price}</h4>
          <button className="btn btn-outline-primary btn-sm">
            Edit Item <i className="fa fa-edit"></i>
          </button>
        </figcaption>
      </figure>
    </div>
  );
};
export default EditableItem;
