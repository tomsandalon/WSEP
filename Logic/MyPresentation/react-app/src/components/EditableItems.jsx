import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditableItem from "./EditableItem";

const EditableItems = (props) => {
  const items = props.items;
  return (
    <div className="container">
      <div className="jr-card">
        {/* <div className="jr-card-header d-flex align-items-center"></div> */}
        <div className="row">
          {items.map((item, _) => {
            const parsedItem = JSON.parse(item);
            return (
              <EditableItem
              key= {parsedItem._product_id}
              id= {parsedItem._product_id}
                name={parsedItem._name}
                available={parsedItem._available}
                amount={parsedItem._amount}
                price={parsedItem._base_price}
                
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditableItems;
