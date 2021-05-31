import React from "react";
import OwnerCell from "./OwnerCell";

const OwnersBlock = (props) => {
  const owners = props.owners;
  const isPending = props.isPending;
  const error = props.error;
  const myEmail = props.myEmail;
  const storeID = props.storeID;

  return (
    <div className="table-responsive-material table-userdetail-mmin">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      <table className={`default-table table-sm table full-table mb-0`}>
        <tbody>
          {owners &&
            owners.map((manager) => {
              const parsedManager = JSON.parse(manager);
              return (
                <OwnerCell
                  id={parsedManager._user_email}
                  ownerName={parsedManager._user_email}
                  key={parsedManager._user_email}
                  isEditable={myEmail === parsedManager._appointer_email}
                  storeID = {storeID}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default OwnersBlock;
