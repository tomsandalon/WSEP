import React, { useState } from "react";
import postFetch from "../postFetch";
import "./Product.css";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";
import { Link } from "react-router-dom";
import CounterOffer from "./Counter_Offer";

const Offer = (props) => {
  const storeID = props.storeID;
  const storeName = props.storeName;
  const offer_id = props.offer_id;
  const itemID = props.itemID;
  const offered_by = props.offered_by;
  const product_name = props.product_name;
  const amount = props.amount;
  const price_per_unit = props.price_per_unit;
  const [showCounter, setShowCounter] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorColor, setErrorColor] = useState("success");

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const onDismiss = () => {
    setVisible(false);
    window.location.reload();
  };
  const acceptSuccess = async() => {
    setErrorColor("success");
    setError("Offer accepted Successfully");
    setVisible(true);
    await sleep(2000);
    window.location.reload();
  };
  const denySuccess =async () => {
    setErrorColor("success");
    setError("Offer declined Successfully");
    setVisible(true);
    await sleep(2000);
    window.location.reload();
  };
  const failure401 = (err_message) => {
    setErrorColor("warning");
    setError(err_message);
    setVisible(true);
  };
  const acceptThenFunc = async (response) => {
    serverResponse(response, acceptSuccess, failure401);
  };
  const denyThenFunc = async (response) => {
    serverResponse(response, denySuccess, failure401);
  };

  const acceptOffer = () => {
    const args = { action: "Accept", shop_id: storeID, offer_id: offer_id };
    postFetch("/offer/shop", args, acceptThenFunc);
  };
  const declineOffer = () => {
    const args = { action: "Deny", shop_id: storeID, offer_id: offer_id };
    postFetch("/offer/shop", args, denyThenFunc);
  };
  const toggleShowCounter = () => {
    setShowCounter(!showCounter);
  };

  return (
    <div className="col-md-3">
      <figure className="itemside mb-4">
        <figcaption className="info align-self-center">
          <h4 className="center">Offer ID: {offer_id}</h4>
          <p>{"Item ID: " + itemID}</p>
          <p>{"Item name: " + product_name}</p>
          <p>{"Amount: " + amount}</p>
          <p>{"Price per unit: " + price_per_unit}</p>
          <p>{"Offered by: " + offered_by}</p>
          <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
            {error}
          </Alert>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={toggleShowCounter}
          >
            Counter <i className="fa fa-recycle"></i>
          </button>
          {showCounter && (
            <CounterOffer
              storeID={storeID}
              storeName={storeName}
              offerID={offer_id}
            />
          )}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => acceptOffer({ id: offer_id })}
          >
            Accept <i className="fa fa-check"></i>
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => declineOffer({ id: offer_id })}
          >
            Deny <i className="fa fa-ban"></i>
          </button>
        </figcaption>
      </figure>
    </div>
  );
};
export default Offer;
