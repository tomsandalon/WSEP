import React from "react";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
// import "../pages/_stores.scss";
import EditIcon from "@material-ui/icons/Edit";

const ManagerCell = (props) => {
  const id = props.id;
  const managerName = props.managerName;

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
          <IconButton aria-label="delete">
            <EditIcon />
          </IconButton>
        </figcaption>
      </td>
    </tr>
  );
};

export default ManagerCell;
