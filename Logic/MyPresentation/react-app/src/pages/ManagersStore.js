import ItemsBlock from "../components/ItemsBlock";
import ManagersBlock from "../components/ManagersBlock";
import { Link, useParams } from "react-router-dom";
import useFetch from "../useFetch";

const ManagersStore = () => {
  const { storeID } = useParams();
  const { data: storeItems, isPending, error } = useFetch(
    `http://localhost:8000/store_${storeID.toString()}_items`
  );

  return (
    <div class="row">
      <div className="col-xl-4">
        <p>Store Managers:</p>
        <div className="jr-card jr-full-card">
          <ManagersBlock storeID={storeID} />
          <Link to={`/addmanager/${storeID}`}>
            <button className="btn btn-outline-primary btn-sm ">
              {" "}
              Add Manager <i className="fa fa-plus"></i>
            </button>
          </Link>
        </div>
      </div>
      <div className="col-xl-8 ">
        <div className="store-view" key={storeID}>
          <h3 className="mb-0">STORE NAME</h3>
          <p>Description</p>
          <ItemsBlock id={storeID} title="Store Title"></ItemsBlock>
        </div>
      </div>
    </div>
  );
};

export default ManagersStore;
