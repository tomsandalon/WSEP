import React, { useState } from "react";
import postFetch from "../postFetch.js";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const AddCondition = (props) => {
  const [condition, setCondition] = useState();
  const [parameter, setParameter] = useState();
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("success");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const { storeID, storeName, discountid } = useParams();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
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
  const conditionOptions = [
    { label: "Category", value: 0 },
    { label: "Product name", value: 1 },
    { label: "Amount", value: 2 },
    { label: "Shop", value: 3 },
  ];
  const submit = (e) => {
    e.preventDefault();
    const params = {
      request: 2,
      shop_id: storeID,
      condition_param: parameter,
      condition: condition.value,
      id: discountid,
    };
    console.log(params);
    postFetch("/user/shop/discount", params, thenFunc);
  };
  const success = async () => {
    setErrorColor("success");
    setError("Condition added successfully");
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
    <div className="add-manager">
      <p>Add condition to discount</p>
      <div className="d-flex mb-2 justify-content-between"></div>
      <form onSubmit={submit}>
        <label>condition: </label>
        <Select
          components={makeAnimated()}
          onChange={setCondition}
          options={conditionOptions}
          className="mb-3"
          placeHolder="Select Operator"
          noOptionsMessage={() => "No more conditions available"}
          defaultValue={[]}
          isMulti={false}
          autoFocus
          isSearchable
        />
        <label>parameter: </label>
        <input
          type="text"
          required
          value={parameter}
          onChange={(e) => setParameter(e.target.value)}
        />

        <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
          {error}
        </Alert>
        {<input type="submit" value="Add Condition" />}
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
export default AddCondition;
