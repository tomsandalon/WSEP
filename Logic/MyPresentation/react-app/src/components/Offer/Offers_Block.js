import React from "react";
import Offer from "./Offer";

const OffersBlock = (props) => {
  const offers = props.offers;
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
          {offers &&
            offers.map((unparsed_offer) => {
              const offer = JSON.parse(unparsed_offer).offer;
              // console.log(offer);
              return (
                <Offer
                  key={offer.id}
                  storeID={storeID}
                  storeName={storeName}
                  offer_id={offer.offer_id}
                  itemID={offer.product_id}
                  offered_by={offer.user_email}
                  product_name={offer.product_name}
                  amount={offer.amount}
                  price_per_unit={offer.price_per_unit}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default OffersBlock;
