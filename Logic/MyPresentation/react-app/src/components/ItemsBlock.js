import React from "react";
import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import EditableItems from "./EditableItems";

const ItemsBlock = (props) => {
  const id = props.id;
  const title = props.title;
  const { data: items, isPending, error } = useFetch(
    "http://localhost:8000/store_" + id.toString() + "_items"
  );
  return (
    <div className="store block">
      {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>}
      {items && <EditableItems items={items}></EditableItems>}
    </div>
  );
};
export default ItemsBlock;
