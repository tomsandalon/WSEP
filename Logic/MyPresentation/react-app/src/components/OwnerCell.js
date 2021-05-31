import React from "react";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

const OwnerCell = (props) => {
  const id = props.id;
  const ownerName = props.ownerName;

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
            {/* <p className="user-description">{userId} </p> */}
          </div>
        </div>
      </td>

      <td className="text-right ">
        <figcaption className="info align-self-center ">
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
        </figcaption>
      </td>
    </tr>
  );
};

export default OwnerCell;
