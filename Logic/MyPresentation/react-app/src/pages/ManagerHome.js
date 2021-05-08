import React from "react";

import ManagerStoreList from "../components/ManagerStoreList";
import useFetch from "../useFetch";

const ManagerHome = () => {
  const { data: stores, isPending, error } = useFetch(
    "http://localhost:8000/user/shop/management"
  );
  return (
    <div className="shops-user-manages">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      {stores && <ManagerStoreList stores={stores}></ManagerStoreList>}
    </div>
  );
};
