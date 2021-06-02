import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import postFetch from "../postFetch.js";
import { Alert } from "reactstrap";

const AddDiscount = () => {
  const { storeID, storeName } = useParams();
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState();
  const [categories, setCategories] = useState();
  const [price, setPrice] = useState();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const onDismiss = () => setVisible(false);
  const success = () => {
    setError("Product Added Successfully");
    setVisible(true);
    setIsPending(false);
    history.push(`/managersStore/${storeID}/${storeName}`);
  };
  const failure401 = (err_message) => {
    setError(err_message);
    setVisible(true);
    setIsPending(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      shop_id: storeID,
      name: name,
      description: description,
      amount: amount,
      categories: categories.split(" "),
      base_price: price,
    };
    setIsPending(true);
    postFetch("/user/shop/product", newProduct, thenFunc);
  };
  const thenFunc = async (response) => {
    setIsPending(false);
    serverResponse(response, success, failure401);
  };
  return (
    <div className="add-manager">
      {<h2> Add Product to {storeName}</h2>}
      <form onSubmit={handleSubmit}>
        <label>Product name: </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Amount: </label>
        <input
          type="text"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label>Description: </label>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Categories: </label>
        <input
          type="text"
          required
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
        <label>Price: </label>
        <input
          type="text"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {!isPending && <input type="submit" value="Add Product" />}
        {isPending && <button diabled>Adding product...</button>}
      </form>
      <Alert color="danger" isOpen={visible} toggle={onDismiss}>
        {error}
      </Alert>
    </div>
  );
};

export default AddDiscount;
