import { DialogTitle } from "@material-ui/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

const AddManager = () => {
  //   const { storeID } = useParams(); TODO: change
  const storeID = 1;
  const [managerName, setManagerName] = useState();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newManager = { managerName };
    setIsPending(true);
    fetch("http://localhost:8000/store_" + storeID.toString() + "_managers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newManager),
    }).then(() => {
      console.log("New manager added");
      setIsPending(false);
    });
  };

  return (
    <div className="add-manager">
      <h2> Add Manager to store {storeID}</h2>
      <form onSubmit={handleSubmit}>
        <label>Manager name: </label>
        <input
          type="text"
          required
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
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
