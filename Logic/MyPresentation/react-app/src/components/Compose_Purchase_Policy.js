import React, { useState } from "react";
import putFetch from "../putFetch.js";
import { useHistory } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const ComposePolicy = (props) => {
  const [operator, setOperator] = useState();
  const [id1, setid1] = useState();
  const [id2, setid2] = useState();
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("success");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const storeID = props.storeID;
  const storeName = props.storeName;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const conditionOptions = [
    { label: "And", value: 0 },
    { label: "Or", value: 1 },
  ];
  const submit = (e) => {
    e.preventDefault();
    putFetch(
      "/user/shop/policy",
      {
        shop_id: storeID,
        policy_id_first: id1,
        policy_id_second: id2,
        operator: operator,
      },
      thenFunc
    );
  };
  const success = async () => {
    setErrorColor("success");
    setError("Discount added successfully");
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
      <p>Compose purchase policy</p>
      <div className="d-flex mb-2 justify-content-between"></div>
      <form onSubmit={submit}>
        <label>id1: </label>
        <input
          type="text"
          required
          value={id1}
          onChange={(e) => setid1(e.target.value)}
        />
        <label>id2: </label>
        <input
          type="text"
          required
          value={id2}
          onChange={(e) => setid2(e.target.value)}
        />
        <label>operator: </label>
        <Select
          components={makeAnimated()}
          onChange={setOperator}
          options={conditionOptions}
          className="mb-3"
          placeHolder="Select Operator"
          noOptionsMessage={() => "No more conditions available"}
          defaultValue={[]}
          isMulti={false}
          autoFocus
          isSearchable
        />
        <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
          {error}
        </Alert>
        {<input type="submit" value="Compose" />}
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
export default ComposePolicy;
