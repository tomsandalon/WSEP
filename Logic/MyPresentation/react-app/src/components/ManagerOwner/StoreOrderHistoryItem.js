import React from "react";
const StoreOrderHistoryItem = (props) => {
  return (
    <article className="card card-body mb-3">
      <div className="row align-items-center">
        <div className="col-md-4">
          <figure className="itemside">
            <div className="aside">
              <img src={props.img} className="photoCart border img-sm" alt="" />
            </div>
            <figcaption className="info">
              <span className="text-muted">
                {props.shop_name}(ID:{props.shop_id}) {props.item_name}{" "}
                {props.item_desc}
                (ID:{props.product_id})
              </span>
            </figcaption>
          </figure>
        </div>
        <div className="col-2">
          <div className="input-group input-spinner">
            <h6>
              Amount: {props.amount}
              {/* <span type="text" className="badge badge-pill badge-info">
              </span> */}
            </h6>
          </div>
        </div>
        <div className="col-2">
          <h6>
            Price: {props.price}
            {/* <span type="number" className="badge badge-pill badge-info">
              
            </span> */}
          </h6>
        </div>
        <div className="col-4"></div>
      </div>
    </article>
  );
};
export default StoreOrderHistoryItem;
