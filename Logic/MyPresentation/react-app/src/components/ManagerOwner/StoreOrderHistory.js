import React, { Component } from "react";
import Image from "../images/cart.png";
import StoreOrderHistoryItem from "./StoreOrderHistoryItem";

const StoreOrderHistory = (props) => {
  const purchaseHistory = props.purchaseHistory;
  return purchaseHistory.map((unparsedOrder) => {
    const order = JSON.parse(unparsedOrder);

    return (
      <main className="a">
        <h1>Order ID: {order.order_id}</h1>
        {order.products.map((unparsed_product) => {
          const product = unparsed_product;
          console.log(product);
          return (
            <StoreOrderHistoryItem
              img={Image}
              shop_id={order.shop_id}
              shop_name={order.shop_name}
              amount={product._amount}
              product_id={product._product_id}
              item_name={product._name}
              item_desc={product._description}
              price={product._actual_price}
              rating={product._rating}
            />
          );
        })}
      </main>
    );
  });
};
export default StoreOrderHistory;
