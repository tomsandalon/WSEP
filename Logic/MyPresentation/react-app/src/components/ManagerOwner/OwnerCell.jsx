import React from "react";
import { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import deleteFetch from "../../deleteFetch.js";
import serverResponse from "../ServerResponse";
import { Alert } from "reactstrap";

const OwnerCell = (props) => {
  const id = props.id;
  const ownerName = props.ownerName;
  const isEditable = props.isEditable;
  const storeID = props.storeID;
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const onDismiss = () => {
    setVisible(false);
    window.location.reload();
  };
  const success = () => {
    setError("Owner Deleted Successfully");
    setVisible(true);
  };
  const failure401 = (err_message) => {
    setError(err_message);
    setVisible(true);
  };
  const thenFunc = async (response) => {
    serverResponse(response, success, failure401);
  };

  const removeOwner = () => {
    const args = { shop_id: storeID, target: id };
    deleteFetch("/user/shop/ownership/assign/owner", args, thenFunc);
  };
  return (
    <tr tabIndex={-1} key={id}>
      <td>
        <div className="user-profile d-flex flex-row align-items-center">
          <Avatar
            alt={ownerName}
            src={"./images/Anon_Avatar.png"}
            className="user-avatar"
          />
          <div className="user-detail">
            <h5 className="user-name ">{ownerName} </h5>
          </div>
        </div>
      </td>
      <Alert color="success" isOpen={visible} toggle={onDismiss}>
        {error}
      </Alert>
      <td className="text-right ">
        <figcaption className="info align-self-center ">
          {isEditable && (
            <IconButton aria-label="delete" onClick={removeOwner}>
              <DeleteIcon />
            </IconButton>
          )}
        </figcaption>
      </td>
    </tr>
  );
};

export default OwnerCell;
