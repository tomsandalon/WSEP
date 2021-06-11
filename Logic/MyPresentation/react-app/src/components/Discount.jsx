import React from "react";
import Image from "./images/shirt.jpg";
import "./Product.css";
const Discount = (props) => {
  const condition = props.condition;
  const parameter = props.parameter;
  const id = props.id;
  const itemID = props.itemID;
  const value = props.value;

  console.log(condition);

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
  if (condition != undefined)
    return (
      <div className="col-md-3">
        <figure className="itemside mb-4">
          {/* <div className="right-aside">
          <img src={Image} alt="E" className="img-sm" />
        </div> */}
          <figcaption className="info align-self-center">
            <h4 className="center">Discount ID: {id}</h4>
            <h4>{"Condition: " + numToCondition[condition]}</h4>
            <h4>{"parameter: " + parameter}</h4>
            <h4>{"Item ID: " + itemID}</h4>
            <h4>{"discount value: " + value}</h4>
            <button className="btn btn-outline-primary btn-sm">
              Edit Item <i className="fa fa-edit"></i>
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
            <button className="btn btn-outline-primary btn-sm">
              Edit Item <i className="fa fa-edit"></i>
            </button>
          </figcaption>
        </figure>
      </div>
    );
};
export default Discount;
