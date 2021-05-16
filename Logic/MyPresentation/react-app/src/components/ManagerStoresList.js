import React from "react";
import { useParams, Link } from "react-router-dom";

const ManagerStoresList = (props) => {
  const stores = props.stores;
  const { managerID } = useParams();

  return (
    <div className="center-screen">
      <div className="container">
        <Link to={`/addstore/${managerID}`}> 
          <button className="btn btn-outline-primary btn-sm ">
            {" "}
            Add Store <i className="fa fa-plus"></i>
          </button>
        </Link>
        <h3>Stores you manage:</h3>
        <div className="manager-store-list">
          {stores.map((store) => {
            const parsedStore = JSON.parse(store);
            return (
              <div className="store-preview" key={parsedStore.shop_id}>
                <Link to={`/managersStore/${parsedStore.shop_id}`}>
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
