import React from "react";
import ManagerCell from "./ManagerCell";
import useFetch from "../useFetch";

const ManagersBlock = (props) => {
  const storeID = props.storeID;
  const { data: managers, isPending, error } = useFetch(
    "http://localhost:8000/store_" + storeID.toString() + "_managers"
  );
  return (
    <div className="table-responsive-material table-userdetail-mmin">
      <table className={`default-table table-sm table full-table mb-0`}>
        <tbody>
          {error && <div> {error}</div>}
          {isPending && <div>Loading...</div>}
          {managers &&
            managers.map((manager) => {
              return (
                <ManagerCell
                  id={manager.id}
                  managerName={manager.managerName}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ManagersBlock;
