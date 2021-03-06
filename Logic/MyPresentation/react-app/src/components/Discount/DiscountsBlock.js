import React from "react";
import Discount from "./Discount";

const DiscountsBlock = (props) => {
  const discounts = props.discounts._discounts;
  const error = props.error;
  const isPending = props.isPending;
  const storeID = props.storeID;
  const storeName = props.storeName;

  return (
    <div className="container">
      <div className="jr-card">
        {/* {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>} */}
        <div className="row">
          {discounts &&
            discounts.map((discount) => {
              console.log(discount);
              return (
                <Discount
                  storeName={storeName}
                  key={discount.id}
                  condition={discount.condition}
                  parameter={discount.condition_param}
                  itemID={
                    discount.discount ? discount.discount.id : discount.id
                  }
                  value={
                    discount.discount ? discount.discount.value : discount.value
                  }
                  id={discount.id}
                  storeID={storeID}
                  logic={discount.logic_composition}
                  operation={discount.operation}
                  firstDiscount={
                    discount.discounts
                      ? discount.discounts[0]
                      : discount.firstDiscount
                  }
                  secondDiscount={
                    discount.discounts
                      ? discount.discounts[1]
                      : discount.secondDiscount
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DiscountsBlock;
