import { DialogTitle } from "@material-ui/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

const AddManager = () => {
  //   const { storeID } = useParams(); TODO: change
  const storeID = 1;
  const [managerName, setManagerName] = useState();
  return (
    <div className="add-manager">
      <h2> Add Manager to store {storeID}</h2>
      <form>
        <label>Manager name: </label>
        <input
          type="text"
          required
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
        />
        <label>Manager name: </label>
        <textArea required></textArea>
        <label>Permissions</label>
        <select>
          {" "}
          <option value="Permission1"> Permission1 </option>
          <option value="Permission2">Permission2</option>
        </select>
        <button>Add Manager</button>
      </form>
    </div>
  );
};

export default AddManager;
