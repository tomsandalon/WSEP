import ItemsBlock from "../components/ManagerOwner/ItemsBlock";
import ManagersBlock from "../components/ManagerOwner/ManagersBlock";
import OwnersBlock from "../components/ManagerOwner/OwnersBlock";
import { Link, useParams, useHistory } from "react-router-dom";
import useFetch from "../useFetch";
import { React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DiscountsBlock from "../components/Discount/DiscountsBlock";
import PurchasePoliciesBlock from "../components/Purchase_Policy/PurchasePoliciesBlock";
import OffersBlock from "../components/Offer/Offers_Block";
import ComposePolicy from "../components/Purchase_Policy/Compose_Purchase_Policy";
import ComposeDiscount from "../components/Discount/ComposeDiscount";
import Switch from "react-switch";
import { useState } from "react";
import { Alert } from "reactstrap";
import serverResponse from "../components/ServerResponse.js";
import deleteFetch from "../deleteFetch";
import postFetch from "../postFetch";
import StoreOrderHistory from "../components/ManagerOwner/StoreOrderHistory";

const ManagersStore = () => {
  const { storeID, name } = useParams();
  const history = useHistory();
  const [acceptOffers, setAcceptOffers] = useState(false);
  const [error, setError] = useState("");
  const [errorColor, setErrorColor] = useState("success");
  const [visible, setVisible] = useState(false);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const {
    data: storeItems,
    itemsIsPending,
    storeError: itemsError,
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
  const onDismiss = () => setVisible(false);

  const {
    data: unparsedPurchaseHistory,
    purchaseHistoryIsPending,
    purchaseHistoryError,
  } = useFetch(`/user/shop/purchase_history?shop_id=${storeID}`);
  const purchaseHistory = unparsedPurchaseHistory;
  console.log(purchaseHistory);

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
  const success = async () => {
    setErrorColor("success");
    if (acceptOffers) setError("Support for offers removed");
    else setError("Shop now supports offers");
    setVisible(true);
    await sleep(2000);
    window.location.reload();
  };
  const failure401 = (err_message) => {
    setErrorColor("warning");
    setError(err_message);
    setVisible(true);
  };
  const thenFunc = async (response) => {
    serverResponse(response, success, failure401);
  };
  const {
    data: purchaseTypes,
    acceptOffersIsPending,
    acceptOffersError,
  } = useFetch(`/user/shop/purchase_type?shop_id=${storeID}`);
  if (purchaseTypes && purchaseTypes.includes(1) && !acceptOffers) {
    setAcceptOffers(true);
  }

  const removeAcceptOffers = () => {
    deleteFetch(
      "/user/shop/purchase_type",
      {
        shop_id: storeID,
        purchase_type: 1,
      },
      thenFunc
    );
  };
  const addAcceptOffers = () => {
    postFetch(
      "/user/shop/purchase_type",
      {
        shop_id: storeID,
        purchase_type: 1,
      },
      thenFunc
    );
  };

  const toggleDoesAcceptOffers = () => {
    if (acceptOffers) removeAcceptOffers();
    else addAcceptOffers();
  };

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
            <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
              {error}
            </Alert>
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
          <h3>Order History:</h3>
          {purchaseHistory && (
            <StoreOrderHistory purchaseHistory={purchaseHistory} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagersStore;
