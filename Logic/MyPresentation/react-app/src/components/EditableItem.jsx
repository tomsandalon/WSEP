import React from "react";
import Image from "./images/shirt.jpg";
import "./Product.css";
import { Link } from "react-router-dom";
import deleteFetch from "../deleteFetch";
import { useState } from "react";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";

const EditableItem = (props) => {
  const name = props.name;
  const amount = props.amount;
  const price = props.price;
  const id = props.id;
  const storeID = props.storeID;
  const storeName = props.storeName;
  const purchaseType = props.purchaseType;
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorColor, setErrorColor] = useState("success");
  console.log(purchaseType);
  const numToType = (num) => {
    if (num == 0) return "Immediate";
    if (num == 1) return "Offer";
    return "UNDEFINED";
  };

  const onDismiss = () => {
    setVisible(false);
    window.location.reload();
  };
  const success = () => {
    setErrorColor("success");
    setError("Item Deleted Successfully");
    setVisible(true);
  };
  const failure401 = (err_message) => {
    setErrorColor("warning");
    setError(err_message);
    setVisible(true);
  };
  const thenFunc = async (response) => {
    serverResponse(response, success, failure401);
  };

  const removeProduct = () => {
    const args = { shop_id: storeID, product_id: id };
    deleteFetch("/user/shop/product", args, thenFunc);
  };
  return (
    <div className="col-md-3">
      <figure className="itemside mb-4">
        <div className="right-aside">
          <img src={Image} alt="E" className="img-sm" />
        </div>
        <figcaption className="info align-self-center">
          <h4 className="center">{name}</h4>
          <h4>{"Amount: " + amount}</h4>
          <h4>{"Purchase Type: " + numToType(purchaseType)}</h4>
          <h4>{"Price: " + price}</h4>
          <Link to={`/editproduct/${storeID}/${storeName}/${id}`}>
            <button className="btn btn-outline-primary btn-sm">
              Edit Item <i className="fa fa-edit"></i>
            </button>
          </Link>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => removeProduct({ id })}
          >
            Delete Item <i className="fa fa-trash"></i>
          </button>
          <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
            {error}
          </Alert>
        </figcaption>
      </figure>
    </div>
  );
};
export default EditableItem;
