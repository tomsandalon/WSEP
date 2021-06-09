import React from "react";
import "./Product.css";
const PurchasePolicy = (props) => {
  const condition = props.condition;
  const id = props.id;
  const value = props.value;

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
          <button className="btn btn-outline-primary btn-sm">
            Edit Item <i className="fa fa-edit"></i>
          </button>
        </figcaption>
      </figure>
    </div>
  );
};
export default PurchasePolicy;
