The flow of offers
=============
Offers are as follows:

1. A user creates an offer for an item which is marked as purchasable by offer. These items have<code>purchase_type:
   Purchase_Type.Offer</code>, which is also <code>purchase_type: 1</code>
   The function to call is <code>makeOffer</code>


2. Now, all of the shop's management should have received a notification that there is a new offer, and that they should
   check the shop's offers.


3. The shop's offers are found using<code>getActiveOfferForShop</code>. Alternatively, the user may get its offers
   using<code>getActiveOfferAsUser</code>. When getting the offers as a user, you will get basic information about it,
   and as a shop you will also get two lists representing who didn't accept the offer yet.


4. Each person in the shop's management has three possible actions:

- Accept the offer using<code>acceptOfferAsManagement</code>. After all have accepted, continue to point #5
- Deny the offer using<code>denyOfferAsManagement</code>. This will terminate the offer.
- Counter the offer using<code>counterOfferAsManager</code>. This will reset all the manager's acceptances, and they
  will have to reaccept the offer. After all have accepted, go to point 5.


5. The user will now have to possible course of actions:

- Deny the offer using<code>denyCounterOfferAsUser</code>.
- Perform a purchase using<code>purchaseOffer</code>. You can check at any time if the offer is purchasable using<code>
  offerIsPurchasable</code>.
