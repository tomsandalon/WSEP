import React from "react";
import useFetch from "../useFetch";

const ManagerStoresList = (props) => {
  const stores = props.stores;

  return (
    <div className="center-screen">
      <div className="container">
        <h3>Stores you manage:</h3>
        <div className="manager-store-list">
          {stores.map((store) => (
            <div className="store-preview" key={store.id}>
              <h3>{store.storeName} </h3>
              <p> Click to edit</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerStoresList;
