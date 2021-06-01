import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EditPermissions from "./Edit_Permissions";
import { Confirmation } from "./Confirmation";
import { useHistory, useParams } from "react-router-dom";
import useFetch from "../useFetch";

const EditPermissionsPre = () => {
  const { storeID, managerID } = useParams();
  const {
    data: staff,
    staffIsPending,
    staffError,
  } = useFetch(`/user/shop/management?shop_id=${storeID}`);
  const parsedStaff = JSON.parse(staff);
  const getManager = (managers) => {
    return managers.find(
      (manager) => JSON.parse(manager)._user_email == managerID
    );
  };

  const pizza = {
    id: 1,
    name: "Chicago Pizza",
    image: "/images/chicago-pizza.jpg",
    desc: "The pan in which this pizza is baked gives the pizza its characteristically high edge which provides ample space for large amounts of cheese and a chunky tomato sauce. A fantastic Pizza.",
    price: 9,
  };

  return (
    <div className="center-screen">
      <Col xs={3} className="mb-5" key={`${pizza.id}`}>
        {staffError && <div> {staffError}</div>}
        {staffIsPending && <div>Loading...</div>}
        {parsedStaff && (
          <EditPermissions
            manager={JSON.parse(getManager(parsedStaff.managers))}
          />
        )}
      </Col>
    </div>
  );
};
export default EditPermissionsPre;
