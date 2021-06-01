import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import putFetch from "../putFetch.js";
import { useHistory, useParams } from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import { Alert } from "reactstrap";

const Action = {
  _add_item: "Add Item",
  _manage_policies: "Manage Policies",
  _remove_item: "Remove Item",
  _view_shop_history: "View Shop History",
  _get_staff_info: "Get Staff Info",
  _edit_policies: "Edit Policies",
};
const ActionToInt = {
  "Add Item": 0,
  "Manage Policies": 1,
  "Remove Item": 2,
  "View Shop History": 3,
  "Get Staff Info": 4,
  "Edit Policies": 5,
};
const permOptions = [
  {
    label: "Get Staff Info",
    value: 4,
  },
  { label: "Add Item", value: 0 },
  { label: "Manage Policies", value: 1 },
  { label: "Remove Item", value: 2 },
  { label: "View Shop History", value: 3 },
  { label: "Edit Policies", value: 5 },
];

const EditPermissions = (props) => {
  const [perms, setPerms] = useState([]);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const { storeID, storeName } = useParams();

  const manager = props.manager;
  const permissions = manager._permissions;
  var defaultPermissions = [];

  Object.keys(permissions).forEach((perm) => {
    if (permissions[perm]) {
      const valueAndLabel = {
        label: Action[perm],
        value: ActionToInt[Action[perm]],
      };
      if (!defaultPermissions.includes(valueAndLabel))
        defaultPermissions.push(valueAndLabel);
    }
  });
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const submit = () => {
    var out = [];
    perms.forEach((p) => {
      out.push(p.value);
    });
    console.log(out);
    putFetch(
      "/user/shop/ownership/assign/manager/permissions",
      { shop_id: storeID, target: manager._user_email, actions: out },
      thenFunc
    );
  };
  const success = async () => {
    setError("Permissions edited successfully");
    setVisible(true);
    await sleep(2000);
    history.push(`/managersStore/${storeID}/${storeName}`);
  };
  const failure401 = (err_message) => {
    setError(err_message);
    setVisible(true);
  };
  const thenFunc = async (response) => {
    serverResponse(response, success, failure401);
  };
  const onDismiss = () => setVisible(false);
  return (
    <Card className="h-100 shadow-sm bg-white rounded">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex mb-2 justify-content-between">
          <Card.Title className="mb-0 font-weight-bold">
            {manager._user_email}
          </Card.Title>
        </div>
        <Card.Text className="text-secondary">
          Select permissions you would like to bestow upon {manager._user_email}
        </Card.Text>
        <Select
          components={makeAnimated()}
          onChange={setPerms}
          options={permOptions}
          className="mb-3"
          placeHolder="Select Pizza toppings"
          noOptionsMessage={() => "No more permissions available"}
          defaultValue={defaultPermissions}
          isMulti
          autoFocus
          isSearchable
        />
        <Alert color="success" isOpen={visible} toggle={onDismiss}>
          {error}
        </Alert>
        <Button
          onClick={() => submit()}
          className="mt-auto font-weight-bold"
          block
        >
          Update Permissions
        </Button>
      </Card.Body>
    </Card>
  );
};
export default EditPermissions;
