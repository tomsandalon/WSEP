import React, {useState} from "react";
import postFetch from "../postFetch.js";
import {useHistory} from "react-router-dom";
import serverResponse from "../components/ServerResponse.js";
import {Alert} from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const ComposeDiscount = (props) => {
    const [operation, setOperation] = useState();
    const [id1, setid1] = useState();
    const [id2, setid2] = useState();
    const [error, setError] = useState("");
    const [errorColor, setErrorColor] = useState("success");
    const [visible, setVisible] = useState(false);
    const history = useHistory();
    const storeID = props.storeID;
    const storeName = props.storeName;
    const logic = props.logic;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const conditionOptions = logic
        ? [
            {label: "XOR", value: 0},
            {label: "And", value: 1},
            {label: "Or", value: 2},
        ]
        : [
            {label: "Max", value: 0},
            {label: "Add", value: 1},
        ];
    const submit = (e) => {
        e.preventDefault();
        postFetch(
            "/user/shop/discount",
            {
                request: logic ? 4 : 3,
                shop_id: storeID,
                discount_id_one: id1,
                discount_id_two: id2,
                operation: operation.value,
            },
            thenFunc
        );
    };
    const success = async () => {
        setErrorColor("success");
        setError("Discounts composed successfully");
        setVisible(true);
        await sleep(2000);
        window.location.reload();
    };
    const failure401 = (err_message) => {
        setErrorColor("warning");
        setError(err_message);
        setVisible(true);
    };
    const thenFunc = async (response) => {
        serverResponse(response, success, failure401);
    };
    const onDismiss = () => setVisible(false);
    return (
        <div className="add-manager">
            <p>Compose discounts {logic ? "logically" : "numerically"}</p>
            <div className="d-flex mb-2 justify-content-between"></div>
            <form onSubmit={submit}>
                <label>id1: </label>
                <input
                    type="text"
                    required
                    value={id1}
                    onChange={(e) => setid1(e.target.value)}
                />
                <label>id2: </label>
                <input
                    type="text"
                    required
                    value={id2}
                    onChange={(e) => setid2(e.target.value)}
                />
                <label>operator: </label>
                <Select
                    components={makeAnimated()}
                    onChange={setOperation}
                    options={conditionOptions}
                    className="mb-3"
                    placeHolder="Select Operator"
                    noOptionsMessage={() => "No more conditions available"}
                    defaultValue={[]}
                    isMulti={false}
                    autoFocus
                    isSearchable
                />
                <Alert color={errorColor} isOpen={visible} toggle={onDismiss}>
                    {error}
                </Alert>
                {<input type="submit" value="Compose"/>}
            </form>
            {/* <Button
          onClick={() => submit()}
          className="mt-auto font-weight-bold"
          block
        >
          Add Policy
        </Button> */}
        </div>
    );
};
export default ComposeDiscount;
