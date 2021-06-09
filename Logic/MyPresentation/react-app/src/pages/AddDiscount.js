import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import postFetch from "../postFetch.js";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";

const AddDiscount = (props) => {
  const [condition, setCondition] = useState();
  const [value, setValue] = useState();
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("success");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const { storeID, storeName } = useParams();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const submit = (e) => {
    e.preventDefault();
    postFetch(
      "/user/shop/discount",
      { shop_id: storeID, value: value, request: 1 },
      thenFunc
    );
  };
  const success = async () => {
    setErrorColor("success");
    setError("Discount added successfully");
    setVisible(true);
    await sleep(2000);
    history.push(`/managersStore/${storeID}/${storeName}`);
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
    <Card className="h-100 shadow-sm bg-white rounded">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex mb-2 justify-content-between">
          <Card.Title className="mb-0 font-weight-bold">Add Policy</Card.Title>
        </div>
        <Card.Text className="text-secondary">
          Add a new Purchase Policy
        </Card.Text>
        <form onSubmit={submit}>
          <label>value: </label>
          <input
            type="text"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {<input type="submit" value="Add Discount" />}
        </form>
        <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
          {error}
        </Alert>
        {/* <Button
          onClick={() => submit()}
          className="mt-auto font-weight-bold"
          block
        >
          Add Policy
        </Button> */}
      </Card.Body>
    </Card>
  );
};
export default AddDiscount;
