import React from "react";
import ManagerStoresList from "../components/ManagerStoresList";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
const ManagerHome = () => {
  const { data: stores, isPending, error } = useFetch("/user");
  return (
    <div className="center-screen">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      {stores && <ManagerStoresList stores={stores}></ManagerStoresList>}
      <Link to={`/addstore/`}>
        <button className="btn btn-outline-primary btn-sm ">
          {" "}
          Add Store <i className="fa fa-plus"></i>
        </button>
      </Link>
    </div>
  );
};

export default ManagerHome;
