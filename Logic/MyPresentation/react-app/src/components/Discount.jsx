import React from "react";
import deleteFetch from "../deleteFetch";
import "./Product.css";
import serverResponse from "../components/ServerResponse.js";
import { useState } from "react";
import { Alert } from "reactstrap";

const Discount = (props) => {
  const storeID = props.storeID;
  const condition = props.condition;
  const parameter = props.parameter;
  const id = props.id;
  const itemID = props.itemID;
  const value = props.value;
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorColor, setErrorColor] = useState("success");

  const numToCondition = {
    0: "Category",
    1: "Product name",
    2: "Amount",
    3: "Shop",
  };
  const consditionToNum = {
    Category: 0,
    "Product name": 1,
    Amount: 2,
    Shop: 3,
  };
  const onDismiss = () => {
    setVisible(false);
    window.location.reload();
  };
  const success = () => {
    setErrorColor("success");
    setError("Discount Deleted Successfully");
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

  const removeDiscount = () => {
    const args = { shop_id: storeID, id: id };
    deleteFetch("/user/shop/discount", args, thenFunc);
  };
  if (condition != undefined)
    return (
      <div className="col-md-3">
        <figure className="itemside mb-4">
          {/* <div className="right-aside">
          <img src={Image} alt="E" className="img-sm" />
        </div> */}
          <figcaption className="info align-self-center">
            <h4 className="center">Discount ID: {id}</h4>
            <h4>{"Item ID: " + itemID}</h4>
            <h4>{"discount value: " + value}</h4>
            <h4>{"Condition: " + numToCondition[condition]}</h4>
            <h4>{"parameter: " + parameter}</h4>
            <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
              {error}
            </Alert>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => removeDiscount({ id })}
            >
              Delete Discount <i className="fa fa-trash"></i>
            </button>
            <button className="btn btn-outline-primary btn-sm">
              Add Condition <i className="fa fa-plus"></i>
            </button>
          </figcaption>
        </figure>
      </div>
    );
  else
    return (
      <div className="col-md-3">
        <figure className="itemside mb-4">
          {/* <div className="right-aside">
        <img src={Image} alt="E" className="img-sm" />
      </div> */}
          <figcaption className="info align-self-center">
            <h4 className="center">Discount ID: {id}</h4>
            <h4>{"Item ID: " + itemID}</h4>
            <h4>{"discount value: " + value}</h4>
            <h4>{"Condition: NONE"}</h4>
            <h4>{"parameter: NONE"}</h4>
            <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
              {error}
            </Alert>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => removeDiscount({ id })}
            >
              Delete Discount <i className="fa fa-trash"></i>
            </button>
            <button className="btn btn-outline-primary btn-sm">
              Add Condition <i className="fa fa-plus"></i>
            </button>
          </figcaption>
        </figure>
      </div>
    );
};
export default Discount;
