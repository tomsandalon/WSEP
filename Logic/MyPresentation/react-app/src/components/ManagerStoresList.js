import React from "react";
import useFetch from "../useFetch";
import { useHistory, Link } from "react-router-dom";

const ManagerStoresList = (props) => {
  const stores = props.stores;
  // const history = useHistory();

  return (
    <div className="center-screen">
      <div className="container">
        <h3>Stores you manage:</h3>
        <div className="manager-store-list">
          {stores.map((store) => (
            <div className="store-preview" key={store.id}>
              <Link to={`/managersStore/${store.id}`}>
                <h3>{store.storeName} </h3>
                <p> Click to edit</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerStoresList;
