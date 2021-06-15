import React from "react";
import ManagerStoresList from "../components/ManagerOwner/ManagerStoresList";
import useFetch from "../useFetch";
import { Link, useHistory } from "react-router-dom";

const ManagerHome = () => {
  const { data: stores, isPending, error } = useFetch("/user");
  const history = useHistory();

  const isUser = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: document.cookie },
    };
    fetch("/user/is/loggedin", requestOptions).then(async (response) => {
      switch (response.status) {
        case 200:
          let value = await response.text();
          value = value === "true" ? true : false;
          if (!value) history.push("/home");
          // return value;
          break;
        default:
          history.push("/home");
          break;
      }
    });
  };

  isUser();
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
