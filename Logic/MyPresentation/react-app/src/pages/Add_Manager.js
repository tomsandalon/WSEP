import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import postFetch from "../postFetch.js";

const AddManager = () => {
  const { storeID } = useParams();
  const [newManagerEmail, setNewManagerEmail] = useState();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const success = () => {
    setError("Manager Added Successfully");
    setVisible(true);
    setIsPending(false);
    history.push(`/managersStore/${storeID}`);
  };
  const failure401 = (err_message) => {
    console.log(err_message);
    setError(err_message);
    setVisible(true);
    setIsPending(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newManager = { shop_id: storeID, email: newManagerEmail };
    setIsPending(true);
    console.log(newManager);
    postFetch("/user/shop/ownership/assign/manager", newManager, thenFunc);
  };
  const thenFunc = async (response) => {
    setIsPending(false);
    const answer = serverResponse(response, success, failure401);
  };
  return (
    <div className="add-manager">
      <h2> Add Manager to store {storeID}</h2>
      <form onSubmit={handleSubmit}>
        <label>Manager name: </label>
        <input
          type="text"
          required
          value={newManagerEmail}
          onChange={(e) => setNewManagerEmail(e.target.value)}
        />
        {/* <label>Manager name: </label>
        <textArea required></textArea> */}
        {/* <label>Permissions</label> */}
        {/* <select>
          {" "}
          <option value="Permission1"> Permission1 </option>
          <option value="Permission2">Permission2</option>
        </select> */}
        {!isPending && <button>Add Manager</button>}
        {isPending && <button diabled>Adding manager...</button>}
      </form>
    </div>
  );
};

export default AddManager;
