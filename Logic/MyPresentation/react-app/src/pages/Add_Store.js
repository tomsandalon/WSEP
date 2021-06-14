import { useState } from "react";
import { useHistory } from "react-router-dom";
import postFetch from "../postFetch.js";
import { Alert } from "reactstrap";
import serverResponse from "../components/ServerResponse.js";

const AddStore = () => {
  const [name, setStoreName] = useState();
  const [description, setStoreDescription] = useState();
  const [location, setLocation] = useState();
  const [bank_info, setBankInfo] = useState();
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
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

  const onDismiss = () => setVisible(false);

  const success = () => {
    setError("Store Added Successfully");
    setVisible(true);
    setIsPending(false);
    history.push(`/managerHome`);
  };
  const failure401 = (err_message) => {
    setError(err_message);
    setVisible(true);
    setIsPending(false);
  };
  const thenFunc = async (response) => {
    setIsPending(false);
    serverResponse(response, success, failure401);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newStore = {
      name: name,
      description: description,
      location: location,
      bank_info: bank_info,
    };
    setIsPending(true);
    postFetch("/user/shop", newStore, thenFunc);
  };

  return (
    <div className="add-manager">
      <h2> Add new store</h2>
      <form onSubmit={handleSubmit}>
        <label>Store name: </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setStoreName(e.target.value)}
        />
        <label>Description: </label>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setStoreDescription(e.target.value)}
        />
        <label>Location: </label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>Bank Information: </label>
        <input
          type="text"
          required
          value={bank_info}
          onChange={(e) => setBankInfo(e.target.value)}
        />
        {!isPending && <button>Add Store</button>}
        {isPending && <button diabled>Adding store...</button>}
      </form>
      <Alert color="danger" isOpen={visible} toggle={onDismiss}>
        {error}
      </Alert>
    </div>
  );
};
export default AddStore;
