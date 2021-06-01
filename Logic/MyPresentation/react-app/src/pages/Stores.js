import React from "react";

import StoreList from "../components/StoreList";
import useFetch from "../useFetch";

const Stores = () => {
  const { data: stores, isPending, error } = useFetch(
    "http://localhost:8000/stores"
  );
  return (
    <div className="shops">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      {stores && <StoreList stores={stores}></StoreList>}
    </div>
  );
};

export default Stores;
