import React, { Component } from "react";
import FiltersItems from "./FiltersItems";
import ItemOfShop from "./ItemOfShop";
import "bootstrap/dist/css/bootstrap.min.css";
import EditableItem from "./EditableItem";

const EditableItems = (props) => {
  const items = props.items;
  return (
    <div class="container">
      <div className="jr-card">
        {/* <div className="jr-card-header d-flex align-items-center"></div> */}
        <div class="row">
          {items.map((item, index) => (
            <EditableItem
              name={item.name}
              available={item.available}
              amount={item.amount}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditableItems;
