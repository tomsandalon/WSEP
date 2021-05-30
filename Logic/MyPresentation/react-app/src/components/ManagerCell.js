import React from "react";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";

const ManagerCell = (props) => {
  const id = props.id;
  const managerName = props.managerName;
  const storeID = props.storeID;
  const storeName = props.storeName;
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

      <td className="text-right ">
        <figcaption className="info align-self-center ">
          <Link to={`/editpermissionspre/${storeID}/${storeName}/${id}`}>
            <EditIcon />
          </Link>
        </figcaption>
      </td>
    </tr>
  );
};

export default ManagerCell;
