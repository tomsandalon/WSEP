import ItemsBlock from "../components/ItemsBlock";
import ManagersBlock from "../components/ManagersBlock";
import OwnersBlock from "../components/OwnersBlock";
import { Link, useParams, useHistory } from "react-router-dom";
import useFetch from "../useFetch";
import { React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Divider } from "@material-ui/core";
import DiscountsBlock from "../components/DiscountsBlock";
import PurchasePoliciesBlock from "../components/PurchasePoliciesBlock";
import OffersBlock from "../components/Offers_Block";
import ComposePolicy from "../components/Compose_Purchase_Policy";
import ComposeDiscount from "../components/ComposeDiscount";
import Switch from "react-switch";
import { useState } from "react";

const ManagersStore = () => {
  const { storeID, name } = useParams();
  const history = useHistory();
  const [acceptOffers, setAcceptOffers] = useState(false);
  const {
    data: storeItems,
    itemsIsPending,
    error: itemsError,
  } = useFetch(`/user/shop?shop_id=${storeID}`);

  const {
    data: staff,
    staffIsPending,
    staffError,
  } = useFetch(`/user/shop/management?shop_id=${storeID}`);
  const parsedStaff = JSON.parse(staff);

  const {
    data: myEmail,
    detailsIsPending,
    detailsError,
  } = useFetch(`/user/details`);

  const {
    data: unparsed_purchasePolicies,
    policiesIsPending,
    policiesError,
  } = useFetch(`/user/shop/policy?shop_id=${storeID}`);
  const purchasePolicies = JSON.parse(unparsed_purchasePolicies);
  const {
    data: unparsedPendingOffers,
    offersIsPending,
    offersError,
  } = useFetch(`/offer/shop?shop_id=${storeID}`);
  const pendingOffers = unparsedPendingOffers;
  // const pendingOffers = JSON.parse(unparsedPendingOffers);
  console.log(pendingOffers);

  const {
    data: unparsed_discounts,
    discountsIsPending,
    discountsError,
  } = useFetch(`/user/shop/discount?shop_id=${storeID}`);
  const discounts = JSON.parse(unparsed_discounts);

  const isUser = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: document.cookie },
    };
    fetch("/user/is/loggedin", requestOptions).then(async (response) => {
      switch (response.status) {
        case 200:
          let value = await response.text();
          value = value === "true" ? true : false;
          if (!value) history.push("/home");
          // return value;
          break;
        default:
          history.push("/home");
          break;
      }
    });
  };

  isUser();
  const {
    data: shouldAcceptOffers,
    acceptOffersIsPending,
    acceptOffersError,
  } = useFetch(`route`);
  // console.log(shouldAcceptOffers);
  //TODO acceptOffers = shouldAcceptOffers[1] == true
  const toggleDoesAcceptOffers = () => {};

  return (
    <div className="row">
      <div className="col-3">
        <output>
          <div className="card">
            <div className="row">
              <div className="col-5">
                <p>Store accepts offers: </p>
              </div>
              <div className="col-7">
                <Switch
                  checked={acceptOffers}
                  onChange={toggleDoesAcceptOffers}
                />
              </div>
            </div>
            <hr></hr>
            {parsedStaff && (
              <article className="management">
                <div className="card-body">
                  <form className="mb-3">
                    <ul>
                      <h3>Store Owners:</h3>
                      {myEmail && (
                        <OwnersBlock
                          owners={parsedStaff.owners}
                          error={staffError}
                          isPending={staffIsPending}
                          myEmail={myEmail.email}
                          storeID={storeID}
                        />
                      )}
                      <Link to={`/addmanager/${storeID}/owner/${name}`}>
                        <button className="btn btn-outline-primary btn-sm ">
                          Add Owner <i className="fa fa-plus"></i>
                        </button>
                      </Link>
                      <hr></hr>
                      <h3>Store Managers:</h3>
                      {myEmail && (
                        <ManagersBlock
                          managers={parsedStaff.managers}
                          error={staffError}
                          isPending={staffIsPending}
                          storeID={storeID}
                          storeName={name}
                          myEmail={myEmail.email}
                        />
                      )}
                      <Link to={`/addmanager/${storeID}/manager/${name}`}>
                        <button className="btn btn-outline-primary btn-sm ">
                          Add Manager <i className="fa fa-plus"></i>
                        </button>
                      </Link>
                    </ul>
                  </form>
                </div>
              </article>
            )}
          </div>
        </output>
      </div>

      <div className="col-8">
        <div className="store-view" key={storeID}>
          <h3 className="mb-0">{name}</h3>
          <Link to={`/addproduct/${storeID}/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Product <i className="fa fa-plus"></i>
            </button>
          </Link>
          {itemsError && <div> {itemsError}</div>}
          {itemsIsPending && <div>Loading...</div>}
          <ItemsBlock
            id={storeID}
            storeItems={storeItems}
            storeID={storeID}
            storeName={name}
          ></ItemsBlock>
        </div>
        <hr></hr>
        <div classname="store-view">
          <h3>Discounts:</h3>
          <Link to={`/adddiscount/${storeID}/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Discount <i className="fa fa-plus"></i>
            </button>
          </Link>
          {discounts && (
            <DiscountsBlock
              storeName={name}
              storeID={storeID}
              error={discountsError}
              isPending={discountsIsPending}
              discounts={discounts}
            />
          )}
          <div className="row">
            <ComposeDiscount
              storeID={storeID}
              storeName={name}
              logic={true}
            ></ComposeDiscount>
            <ComposeDiscount
              storeID={storeID}
              storeName={name}
              logic={false}
            ></ComposeDiscount>
          </div>
          <hr></hr>
          <h3>Purchase Policies:</h3>
          <Link to={`/addpolicy/${storeID}/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Purchase Policy <i className="fa fa-plus"></i>
            </button>
          </Link>
          {purchasePolicies && (
            <PurchasePoliciesBlock
              storeID={storeID}
              error={policiesError}
              isPending={policiesIsPending}
              policies={purchasePolicies}
            />
          )}
          <ComposePolicy storeID={storeID} storeName={name}></ComposePolicy>
          <hr></hr>
          <h3>Offers:</h3>
          {pendingOffers && (
            <OffersBlock
              storeName={name}
              storeID={storeID}
              error={discountsError}
              isPending={discountsIsPending}
              offers={pendingOffers}
            />
          )}
          <hr></hr>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default ManagersStore;
