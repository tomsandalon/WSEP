import React from "react";
import useFetch from "../useFetch";

const ManagerStoreList = (props) => {
  const stores = props.stores;

  return (
    <div className="manager-store-list">
      {stores.map((store) => (
        <div className="store preview" key={store.id}>
          <h2>{store.storeName} </h2>
        </div>
      ))}
    </div>
  );
};

export default ManagerStoreList;
