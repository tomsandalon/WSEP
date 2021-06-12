import React from "react";
import deleteFetch from "../deleteFetch";
import "./Product.css";
import { Alert } from "reactstrap";
import { useState } from "react";
import serverResponse from "../components/ServerResponse.js";

const PurchasePolicy = (props) => {
  const storeID = props.storeID;
  const condition = props.condition;
  const conditions = props.conditions;
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
    0: "Not Category",
    1: "Before Time",
    2: "After Time",
    3: "Amount Lower Than",
    4: "Amount Greater Than",
    5: "UnderAge",
  };

  const removePolicy = (id) => {
    const args = { shop_id: storeID, policy_id: id };
    console.log(args);
    deleteFetch("/user/shop/policy", args, thenFunc);
  };
  if (conditions != null) {
    return (
      <div className="col-md-3">
        <figure className="itemside mb-4">
          {/* <div className="right-aside">
          <img src={Image} alt="E" className="img-sm" />
        </div> */}
          <figcaption className="info align-self-center">
            <h4 className="center">Policy ID: {id}</h4>
            {conditions.map((cond) => {
              return (
                <p>
                  {"Condition: " +
                    numToCondition[cond.condition] +
                    "," +
                    "value: " +
                    cond.value}
                </p>
              );
            })}
            {/* <h4>{"Condition: " + numToCondition[condition]}</h4>
            <h4>{"value: " + value}</h4> */}
            <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
              {error}
            </Alert>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => removePolicy({ id })}
            >
              Delete Policy <i className="fa fa-trash"></i>
            </button>
          </figcaption>
        </figure>
      </div>
    );
  } else {
    return (
      <div className="col-md-3">
        <figure className="itemside mb-4">
          {/* <div className="right-aside">
            <img src={Image} alt="E" className="img-sm" />
          </div> */}
          <figcaption className="info align-self-center">
            <h4 className="center">Policy ID: {id}</h4>
            {/* {conditions.map((cond) => {
              const parsed = JSON.parse(cond);
              return <p>{parsed.id}</p>;
            })} */}
            <p>{"Condition: " + numToCondition[condition]}</p>
            <p>{"value: " + value}</p>
            <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
              {error}
            </Alert>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => removePolicy(id)}
            >
              Delete Policy <i className="fa fa-trash"></i>
            </button>
          </figcaption>
        </figure>
      </div>
    );
  }
};
export default PurchasePolicy;
