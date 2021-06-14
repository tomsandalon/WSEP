import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import postFetch from "../postFetch.js";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";

const Action = {
  NotCategory: "Not in category",
  BeforeTime: "Before Time",
  AfterTime: "After Time",
  LowerAmount: "Amount Lower Than",
  GreaterAmount: "Amount Greater Than",
  UnderAge: "Age Is Under",
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
const conditionOptions = [
  {
    label: "Not in category",
    value: 0,
  },
  { label: "Before Time", value: 1 },
  { label: "After Time", value: 2 },
  { label: "Amount Lower Than", value: 3 },
  { label: "Amount Greater Than", value: 4 },
  { label: "Age Is Under", value: 5 },
];

const AddPolicy = (props) => {
  const [condition, setCondition] = useState();
  const [value, setValue] = useState();
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("success");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const { storeID, storeName } = useParams();
  const isUser = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: document.cookie },
    };
    fetch("/user/is/loggedin", requestOptions).then(async (response) => {
      switch (response.status) {
        case 200:
          let value = await response.text();
          value = value === "true" ? true : false;
          if (!value) history.push("/home");
          // return value;
          break;
        default:
          history.push("/home");
          break;
      }
    });
  };

  isUser();
  
  var defaultCondition = [];

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const submit = (e) => {
    console.log(condition);
    e.preventDefault();
    postFetch(
      "/user/shop/policy",
      { shop_id: storeID, condition: condition.value, value: value },
      thenFunc
    );
  };
  const success = async () => {
    setErrorColor("success");
    setError("Policy added successfully");
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
    <Card className="add-manager">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex mb-2 justify-content-between">
          <Card.Title className="mb-0 font-weight-bold">Add Policy</Card.Title>
        </div>
        <Card.Text className="text-secondary">
          Add a new Purchase Policy
        </Card.Text>
        <Select
          components={makeAnimated()}
          onChange={setCondition}
          options={conditionOptions}
          className="mb-3"
          placeHolder="Select Condition"
          noOptionsMessage={() => "No more conditions available"}
          defaultValue={defaultCondition}
          isMulti={false}
          autoFocus
          isSearchable
        />
        <form onSubmit={submit}>
          <label>value: </label>
          <input
            type="text"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {<input type="submit" value="Add Policy" />}
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
export default AddPolicy;
