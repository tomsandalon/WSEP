import React from "react";
// import { useState, useEffect } from "react";
// import useFetch from "../useFetch";
import EditableItems from "./EditableItems";

const ItemsBlock = (props) => {
  const storeItems = props.storeItems;
  return (
    <div className="store block">
      {storeItems && <EditableItems items={storeItems}></EditableItems>}
    </div>
  );
};
export default ItemsBlock;
