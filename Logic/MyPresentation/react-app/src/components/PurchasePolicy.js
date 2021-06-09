import React from "react";
import deleteFetch from "../deleteFetch";
import "./Product.css";
import { Alert } from "reactstrap";
import { useState } from "react";
import serverResponse from "../components/ServerResponse.js";


const PurchasePolicy = (props) => {
  const storeID = props.storeID;
  const condition = props.condition;
  const id = props.id;
  const value = props.value;
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorColor, setErrorColor] = useState("success");

  const onDismiss = () => {
    setVisible(false);
    window.location.reload();
  };
  const success = () => {
    setErrorColor("success");
    setError("Policy Deleted Successfully");
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

  const consditionToNum = {
    NotCategory: 0,
    BeforeTime: 1,
    AfterTime: 2,
    LowerAmount: 3,
    GreaterAmount: 4,
    UnderAge: 5,
  };
  const numToCondition = {
    0: "NotCategory",
    1: "BeforeTime",
    2: "AfterTime",
    3: "LowerAmount",
    4: "GreaterAmount",
    5: "UnderAge",
  };

  const removePolicy = (id) => {
    const args = { shop_id: storeID, policy_id: id };
    deleteFetch("/user/shop/policy", args, thenFunc);
  };

  return (
    <div className="col-md-3">
      <figure className="itemside mb-4">
        {/* <div className="right-aside">
          <img src={Image} alt="E" className="img-sm" />
        </div> */}
        <figcaption className="info align-self-center">
          <h4 className="center">Policy ID: {id}</h4>
          <h4>{"Condition: " + numToCondition[condition]}</h4>
          <h4>{"value: " + value}</h4>
          <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
            {error}
          </Alert>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => removePolicy({ id })}
          >
            Delete Policy <i className="fa fa-trash"></i>
          </button>
          <button className="btn btn-outline-primary btn-sm">
            Add Condition <i className="fa fa-plus"></i>
          </button>
        </figcaption>
      </figure>
    </div>
  );
};
export default PurchasePolicy;
