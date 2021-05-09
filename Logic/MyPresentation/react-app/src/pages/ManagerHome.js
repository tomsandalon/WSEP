import React from "react";
import { useParams } from "react-router-dom";
import ManagerStoresList from "../components/ManagerStoresList";
import useFetch from "../useFetch";

const ManagerHome = () => {
  // const { data: stores, isPending, error } = useFetch(
  //   "http://localhost:8000/user/shop/management"
  // );
  const { data: stores, isPending, error } = useFetch(
    "http://localhost:8000/stores"
  );
  const { managerID } = useParams();
  console.log("ManagerID: " + managerID);

  return (
    <div className="shops-user-manages">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}

      {stores && <ManagerStoresList stores={stores}></ManagerStoresList>}
    </div>
  );
};

export default ManagerHome;
