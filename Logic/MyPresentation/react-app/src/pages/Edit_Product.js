import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import putFetch from "../putFetch.js";
import { Alert } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const EditProduct = () => {
  const { storeID, storeName, productID } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [action, setAction] = useState();
  const [parameter, setParameter] = useState();
  const [errorColor, setErrorColor] = useState("success");

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const actionOptions = [
    { label: "Add Amount", value: 0 },
    { label: "Change Name", value: 1 },
    { label: "Add Category", value: 2 },
    { label: "RemoveCategory", value: 3 },
    { label: "Change Price", value: 4 },
    { label: "Change Description", value: 5 },
  ];
  const submit = (e) => {
    e.preventDefault();
    const args = {
      shop_id: storeID,
      product_id: productID,
      value: parameter,
      action: action.value,
    };
    console.log(args);
    putFetch("/user/shop/product", args, thenFunc);
  };
  const success = async () => {
    setErrorColor("success");
    setError("Product Edited successfully");
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
      <p>Edit Product</p>
      <div className="d-flex mb-2 justify-content-between"></div>
      <form onSubmit={submit}>
        <label>operator: </label>
        <Select
          components={makeAnimated()}
          onChange={setAction}
          options={actionOptions}
          className="mb-3"
          placeHolder="Select Operator"
          noOptionsMessage={() => "No more conditions available"}
          defaultValue={[]}
          isMulti={false}
          autoFocus
          isSearchable
        />
        <label>Value: </label>
        <input
          type="text"
          required
          value={parameter}
          onChange={(e) => setParameter(e.target.value)}
        />
        <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
          {error}
        </Alert>
        {<input type="submit" value="Edit Product" />}
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

export default EditProduct;
