import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditableItem from "./EditableItem";

const EditableItems = (props) => {
  const items = props.items;
  console.log(items); //TODO access item fields!
  return (
    <div class="container">
      <div className="jr-card">
        {/* <div className="jr-card-header d-flex align-items-center"></div> */}
        <div class="row">
          {items.map((item, _) => {
            const parsedItem = JSON.parse(item);
            return (
              <EditableItem
                name={parsedItem.name}
                available={parsedItem.available}
                amount={parsedItem.amount}
                price={parsedItem.price}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditableItems;
