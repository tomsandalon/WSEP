import React from "react";
import { Link } from "react-router-dom";

const ManagerStoresList = (props) => {
  const stores = props.stores;

  return (
    <div className="center-screen">
      <div className="container">
        <h2>Stores you manage:</h2>
        <div className="manager-store-list">
          {stores.map((store) => {
            const parsedStore = JSON.parse(store);
            return (
              <div className="store-preview" key={parsedStore.shop_id}>
                <Link
                  to={`/managersStore/${parsedStore.shop_id}/${parsedStore.shop_name}`}
                >
                  <h3>{parsedStore.shop_name} </h3>
                  {/* <p> {store.description}</p> */}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManagerStoresList;
