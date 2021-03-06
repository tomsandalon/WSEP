import { Divider } from "@material-ui/core";
import React from "react";
import PurchasePolicy from "./PurchasePolicy";

const PurchasePoliciesBlock = (props) => {
  const policies = props.policies;
  const error = props.error;
  const isPending = props.isPending;
  const storeID = props.storeID;

  return (
    <div className="container">
      <div className="jr-card">
        {/* {error && <div> {error}</div>}
      {isPending && <div>Loading...</div>} */}
        <div className="row">
          {policies &&
            policies.map((unparsed_policy) => {
              const policy = JSON.parse(unparsed_policy);
              return (
                <PurchasePolicy
                  storeID={storeID}
                  condition={policy.condition}
                  value={policy.value}
                  id={policy.id}
                  conditions={policy.conditions}
                  key={policy.id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PurchasePoliciesBlock;
