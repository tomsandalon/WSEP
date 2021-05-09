import ItemsBlock from "./ItemsBlock";
import ManagersBlock from "./ManagersBlock";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

const StoreList = (props) => {
  const stores = props.stores;
  const title = props.title;

  return (
    <div class="container">
      <div className="store-list">
        <h2> {title}</h2>
        {stores.map((store) => (
          <div class="row">
            <div className="col-xl-4">
              <p>Store {store.id} Managers:</p>

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
                <ItemsBlock id={store.id} title={store.title}></ItemsBlock>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
