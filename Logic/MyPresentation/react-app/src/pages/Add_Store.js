import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const AddStore = () => {
  const { managerID } = useParams();
  const [name, setStoreName] = useState();
  const [description, setStoreDescription] = useState();
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  const active = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStore = { name, description, active };
    setIsPending(true);
    fetch("http://localhost:8000/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStore),
    }).then(() => {
      console.log("New store added");
      setIsPending(false);
      history.push(`/managerHome/${managerID}`);
    });
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
        {/* <label>Permissions</label> */}
        {/* <select>
          {" "}
          <option value="Permission1"> Permission1 </option>
          <option value="Permission2">Permission2</option>
        </select> */}
        {!isPending && <button>Add Store</button>}
        {isPending && <button diabled>Adding store...</button>}
      </form>
    </div>
  );
};
export default AddStore;
