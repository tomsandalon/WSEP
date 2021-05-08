import React from "react";

import ManagerStoresList from "../components/ManagerStoresList";
import useFetch from "../useFetch";

const ManagerHome = () => {
  const { data: stores, isPending, error } = useFetch(
    "http://localhost:8000/user/shop/management"
  );
  return (
    <div className="shops-user-manages">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      {stores && <ManagerStoresList stores={stores}></ManagerStoresList>}
    </div>
  );
};

export default ManagerHome;
