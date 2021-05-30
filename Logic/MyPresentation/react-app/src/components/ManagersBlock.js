import React from "react";
import ManagerCell from "./ManagerCell";

const ManagersBlock = (props) => {
  const managers = props.managers;
  const isPending = props.isPending;
  const error = props.error;
  const storeID = props.storeID;
  // const {
  //   data: managers,
  //   isPending,
  //   error,
  // } = useFetch(`/user/shop/management?shop_id=${storeID}`);

  return (
    <div className="Card">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      <table className={`default-table table-sm table full-table mb-0`}>
        <tbody>
          {managers &&
            managers.map((manager) => {
              const parsedManager = JSON.parse(manager);
              return (
                <ManagerCell
                  id={parsedManager._user_email}
                  managerName={parsedManager._user_email}
                  key={parsedManager._user_email}
                  storeID = {storeID}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ManagersBlock;
