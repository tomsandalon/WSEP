import ItemsBlock from "./ItemsBlock";
import ManagersBlock from "./ManagersBlock";

const ManagersStore = (props) => {
  const store = props.store;
  <div class="row">
    <div className="col-xl-4">
      <p>Store Managers:</p>
      <div className="jr-card jr-full-card">
        <ManagersBlock storeID={store.id} />
        <button className="btn btn-outline-primary btn-sm ">
          {" "}
          Add Manager <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
    <div className="col-xl-8 ">
      <div className="store-view" key={store.id}>
        <h3 className="mb-0">{store.name}</h3>
        <p>{store.description}</p>
        <ItemsBlock id={store.id} title={store.storeName}></ItemsBlock>
      </div>
    </div>
  </div>;
};

export default ManagersStore;
