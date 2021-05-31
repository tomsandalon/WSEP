import ItemsBlock from "../components/ItemsBlock";
import ManagersBlock from "../components/ManagersBlock";
import OwnersBlock from "../components/OwnersBlock";
import { Link, useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { React } from "react";

const ManagersStore = () => {
  const { storeID, name } = useParams();
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

  return (
    <div className="row">
      {parsedStaff && (
        <div className="col-xl-4">
          <h3>Store Owners:</h3>
          <OwnersBlock
            owners={parsedStaff.owners}
            error={staffError}
            isPending={staffIsPending}
          />
          <Link to={`/addmanager/${storeID}/owner/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Owner <i className="fa fa-plus"></i>
            </button>
          </Link>
          <h3>Store Managers:</h3>
          <ManagersBlock
            managers={parsedStaff.managers}
            error={staffError}
            isPending={staffIsPending}
          />
          <Link to={`/addmanager/${storeID}/manager/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Manager <i className="fa fa-plus"></i>
            </button>
          </Link>
        </div>
      )}
      <div className="col-xl-8">
        <div className="store-view" key={storeID}>
          <h3 className="mb-0">{name}</h3>
          <Link to={`/addproduct/${storeID}/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Product <i className="fa fa-plus"></i>
            </button>
          </Link>
          {itemsError && <div> {itemsError}</div>}
          {itemsIsPending && <div>Loading...</div>}
          <ItemsBlock id={storeID} storeItems={storeItems}></ItemsBlock>
        </div>
      </div>
    </div>
  );
};

export default ManagersStore;
