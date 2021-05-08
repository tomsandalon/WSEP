import React from "react";

import ManagerStoresList from "../components/ManagerStoresList";
import useFetch from "../useFetch";

const ManagerHome = () => {
  // const { data: stores, isPending, error } = useFetch(
  //   "http://localhost:8000/user/shop/management"
  // );
  const stores = [
    { id: 1, storeName: "Store1" },
    { id: 2, storeName: "Store2" },
  ];
  return (
    <div className="shops-user-manages">
      {/* {error && <div> {error}</div>} */}
      {/* {isPending && <div>Loading...</div>} */}
      {stores && <ManagerStoresList stores={stores}></ManagerStoresList>}
    </div>
  );
};

export default ManagerHome;
