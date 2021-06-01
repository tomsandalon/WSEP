import React from "react";
import { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import deleteFetch from "../deleteFetch.js";
import serverResponse from "../components/ServerResponse.js";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "reactstrap";

const ManagerCell = (props) => {
  const id = props.id;
  const managerName = props.managerName;
  const storeID = props.storeID;
  const storeName = props.storeName;
  const isEditable = props.isEditable;
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

  const removeManager = () => {
    const args = { shop_id: storeID, target: id };
    deleteFetch("/user/shop/ownership/assign/manager", args, thenFunc);
  };

  return (
    <tr tabIndex={-1} key={id}>
      <td>
        <div className="user-profile d-flex flex-row align-items-center">
          <Avatar
            alt={managerName}
            src={"./images/Anon_Avatar.png"}
            className="user-avatar"
          />
          <div className="user-detail">
            <h5 className="user-name ">{managerName} </h5>
            {/* <p className="user-description">{userId} </p> */}
          </div>
        </div>
      </td>
      <Alert color="success" isOpen={visible} toggle={onDismiss}>
        {error}
      </Alert>
      <td className="text-right ">
        <figcaption className="info align-self-center ">
        {isEditable && (
            <IconButton aria-label="delete" onClick={removeManager}>
              <DeleteIcon />
            </IconButton>
          )}
          {isEditable && (
            <Link to={`/editpermissionspre/${storeID}/${storeName}/${id}`}>
              <EditIcon />
            </Link>
          )}
        </figcaption>
      </td>
    </tr>
  );
};

export default ManagerCell;
