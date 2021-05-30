import React, { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";
import EditPermissions from "./Edit_Permissions";
import {Confirmation} from "./Confirmation";

const EditPermissionsPre = (props) => {
  const [ordered, setOrdered] = useState(false);
  const pizzas = [
    {
      id: 1,
      name: "Chicago Pizza",
      image: "/images/chicago-pizza.jpg",
      desc: "The pan in which this pizza is baked gives the pizza its characteristically high edge which provides ample space for large amounts of cheese and a chunky tomato sauce. A fantastic Pizza.",
      price: 9,
    },
    {
      id: 2,
      name: "Neapolitan Pizza",
      image: "/images/neapolitan-pizza.jpg",
      desc: "This style of pizza is prepared with simple and fresh ingredients: a basic dough, raw tomatoes, fresh mozzarella cheese, fresh basil, and olive oil. A fantastic original pizza.",
      price: 7,
    },
    {
      id: 3,
      name: "New York Pizza",
      image: "/images/ny-pizza.jpg",
      desc: "New York-style pizza has slices that are large and wide with a thin crust that is foldable yet crispy. It is traditionally topped with tomato sauce and mozzarella cheese.",
      price: 8,
    },
    {
      id: 4,
      name: "Sicilian Pizza",
      image: "/images/sicilian-pizza.jpg",
      desc: "Sicilian pizza is pizza prepared in a manner that originated in Sicily, Italy. Sicilian pizza is also known as sfincione or focaccia with toppings. A great tasteful pizza all around.",
      price: 9,
    },
  ];
  function displayConfirmation() {
    setOrdered(true);

    setTimeout(() => {
      setOrdered(false);
    }, 3000);
  }

  return (
    <Container>
      {ordered && <Confirmation toggle={setOrdered} />}
      <Row>
        {pizzas.map((data) => (
          <Col xs={3} className="mb-5" key={`${data.id}`}>
            <EditPermissions data={data} setOrdered={displayConfirmation} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default EditPermissionsPre;
