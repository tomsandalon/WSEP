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

  return (
    <div className="row">
      <div className="col-xl-4">
        <h3>Store Owners:</h3>
          <OwnersBlock storeID={storeID} />
          <Link to={`/addmanager/${storeID}/owner/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Owner <i className="fa fa-plus"></i>
            </button>
          </Link>
        <h3>Store Managers:</h3>
          <ManagersBlock storeID={storeID} />
          <Link to={`/addmanager/${storeID}/manager/${name}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Manager <i className="fa fa-plus"></i>
            </button>
          </Link>
      </div>
      <div className="col-xl-8">
        <div className="store-view" key={storeID}>
          <h3 className="mb-0">{name}</h3>
          {itemsError && <div> {itemsError}</div>}
          {itemsIsPending && <div>Loading...</div>}
          <ItemsBlock
            id={storeID}
            storeItems={storeItems}
            title="Store Title"
          ></ItemsBlock>
        </div>
      </div>
    </div>
  );
};

export default ManagersStore;
