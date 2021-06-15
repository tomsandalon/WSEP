import React from "react";
import EditableItems from "../EditableItems";

const ItemsBlock = (props) => {
  const storeItems = props.storeItems;
  const storeID = props.storeID;
  const storeName = props.storeName;
  return (
    <div className="store block">
      {storeItems && (
        <EditableItems
          items={storeItems}
          storeID={storeID}
          storeName={storeName}
        ></EditableItems>
      )}
    </div>
  );
};
export default ItemsBlock;
