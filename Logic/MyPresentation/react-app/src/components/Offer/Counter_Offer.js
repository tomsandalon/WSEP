import React, { useState } from "react";
import postFetch from "../../postFetch";
import { useHistory } from "react-router-dom";
import serverResponse from "../ServerResponse.js";
import { Alert } from "reactstrap";

const CounterOffer = (props) => {
  const [newPrice, setNewPrice] = useState();
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("success");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const storeID = props.storeID;
  const storeName = props.storeName;
  const offerID = props.offerID;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const submit = (e) => {
    e.preventDefault();
    postFetch(
      "/offer/shop",
      {
        action: "Counter",
        shop_id: storeID,
        offer_id: offerID,
        new_price_per_unit: newPrice,
      },
      thenFunc
    );
  };
  const success = async () => {
    setErrorColor("success");
    setError("Counter sent successfully");
    setVisible(true);
    await sleep(2000);
    window.location.reload();
  };
  const failure401 = (err_message) => {
    setErrorColor("warning");
    setError(err_message);
    setVisible(true);
  };
  const thenFunc = async (response) => {
    serverResponse(response, success, failure401);
  };
  const onDismiss = () => setVisible(false);
  return (
    <div className="add-manager">
      <form onSubmit={submit}>
        <label>New price per unit: </label>
        <input
          type="text"
          required
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
          {error}
        </Alert>
        {<input type="submit" value="Counter" />}
      </form>
      {/* <Button
          onClick={() => submit()}
          className="mt-auto font-weight-bold"
          block
        >
          Add Policy
        </Button> */}
    </div>
  );
};
export default CounterOffer;
