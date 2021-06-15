# System Initiation

- If the system is run with an 'initialize' flag in its parameters (last parameter), it will initiate the database
  according to 'Actions.json' file. //TODO add link

- Initiating from a file will cause the DB to reset and only have the values in the initialization file

- How IDs work:
    - Whenever an ID is required (e.g. AddProduct, etc.), the IDs start counting from 0. For example, creating three
      users will result in the creation of users with IDs 0, 1, 2, with the first receiving ID 0 and so on.
    - Adding conditions to purchase conditions or discounts, as well as composing two discounts or two purchase
      conditions will result in a new ID of the new discounts or purchas conditions

- The format of 'Actions.json' should be as JSON file with an attribute 'Operations', which holds an array of the
  following:
    - An action from the below mentioned list at [0]
    - The parameters at [1, ..., n]

- The parameters at described at the links next to each command

<i>

[AcceptOfferAsManagement](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L348)

[AddConditionToDiscount](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L62)

[AddDiscount](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L66)

[AddItemToBasket](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L94)

[AddLogicComposeDiscount](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L70)

[AddNumericComposeDiscount](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L74)

[AddPermissions](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L98)

[AddProduct](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L102)

[AddPurchasePolicy](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L78)

[AddPurchaseType](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L376)

[AddShop](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L106)

[AppointManager](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L118)

[AppointOwner](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L122)

[ComposePurchasePolicy](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L82)

[CounterOfferAsManager](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L356)

[CounterOfferAsUser](httphttps://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L380)

[DenyCounterOfferAsUser](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L360)

[DenyOfferAsManagement](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L352)

[EditPermissions](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L142)

[EditProduct](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L146)

[EditShoppingCart](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L150)

[Logout](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L189)

[MakeOffer](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L336)

[PerformLogin](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L201)

[PerformRegister](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L205)

[PurchaseCart](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L239)

[PurchaseOffer](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L368)

[PurchaseShoppingBasket](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L243)

[RateProduct](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L315)

[RemoveDiscount](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L275)

[RemoveItemFromBasket](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L154)

[RemoveManager](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L247)

[RemoveOwner](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L86)

[RemovePermission](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L319)

[RemoveProduct](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L251)

[RemovePurchasePolicy](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L90)

[RemovePurchaseType](https://github.com/tomsandalon/WSEP/blob/0b74d356737dec9bdf3e98002bac1500269240e7/Logic/Service/Service.ts#L372)

</i>

