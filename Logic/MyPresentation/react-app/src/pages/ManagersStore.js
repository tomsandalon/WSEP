import ItemsBlock from "../components/ItemsBlock";
import ManagersBlock from "../components/ManagersBlock";
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
    <div class="row">
      <div className="col-xl-4">
        <h3>Store Managers:</h3>
          <ManagersBlock storeID={storeID} />
          <Link to={`/addmanager/${storeID}`}>
            <button className="btn btn-outline-primary btn-sm ">
              Add Manager <i className="fa fa-plus"></i>
            </button>
          </Link>
      </div>
      <div className="col-xl-8 ">
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
