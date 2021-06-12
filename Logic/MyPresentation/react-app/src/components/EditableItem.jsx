import React from "react";
import Image from "./images/shirt.jpg";
import "./Product.css";
import { Link } from "react-router-dom";

const EditableItem = (props) => {
  const name = props.name;
  const amount = props.amount;
  const price = props.price;
  const id = props.id;
  const storeID = props.storeID;
  const storeName = props.storeName;

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
          <Link to={`/editproduct/${storeID}/${storeName}/${id}`}>
            <button className="btn btn-outline-primary btn-sm">
              Edit Item <i className="fa fa-edit"></i>
            </button>
          </Link>
        </figcaption>
      </figure>
    </div>
  );
};
export default EditableItem;
