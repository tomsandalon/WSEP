import React from "react";
// import { useState, useEffect } from "react";
// import useFetch from "../useFetch";
import EditableItems from "./EditableItems";

const ItemsBlock = (props) => {
  // const id = props.id;
  // const title = props.title;
  const storeItems = props.storeItems;
  return (
    <div className="store block">
      {/* {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>} */}
      {storeItems && <EditableItems items={storeItems}></EditableItems>}
    </div>
  );
};
export default ItemsBlock;
