# System Initiation

![Our best logo ever](Logo.png)

- If the system is run with an 'initialize' flag in its parameters (last parameter), it will initiate the database
  according to 'Actions.json' file. //TODO add link

- Initiating from a file will cause the DB to reset and only have the values in the initialization file

- How IDs work:
    - Whenever an ID is required (e.g. AddProduct, etc.), the IDs start counting from 0, except for user-id which starts at 1 (0 is set for system admin). For example, creating three
      users will result in the creation of users with IDs 0, 1, 2, with the first receiving ID 0 and so on.
    - Adding conditions to purchase conditions or discounts, as well as composing two discounts or two purchase
      conditions will result in a new ID of the new discounts or purchas conditions

- The format of 'Actions.json' should be as JSON file with an attribute 'Operations', which holds an array of the
  following:
    - An action from the below mentioned list at [0]
    - The parameters at [1, ..., n]

- The parameters at described at the links next to each command

<i>

[AcceptOfferAsManagement](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L544)

[AddConditionToDiscount](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L62)

[AddDiscount](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L74)

[AddItemToBasket](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L151)

[AddLogicComposeDiscount](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L84)

[AddNumericComposeDiscount](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L96)

[AddPermissions](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L162)

[AddProduct](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L173)

[AddPurchasePolicy](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L108)

[AddPurchaseType](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L608)

[AddShop](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L188)

[AppointManager](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L208)

[AppointOwner](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L218)

[ComposePurchasePolicy](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L119)

[CounterOfferAsManager](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L564)

[CounterOfferAsUser](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L618)

[DenyCounterOfferAsUser](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L575)

[DenyOfferAsManagement](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L554)

[EditPermissions](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L244)

[EditProduct](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L255)

[EditShoppingCart](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L267)

[Logout](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L319)

[MakeOffer](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L524)

[PerformLogin](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L335)

[PerformRegister](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L344)

[PurchaseCart](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L384)

[PurchaseOffer](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L588)

[PurchaseShoppingBasket](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L393)

[RateProduct](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L489)

[RemoveDiscount](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L443)

[RemoveItemFromBasket](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L278)

[RemoveManager](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L403)

[RemoveOwner](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L131)

[RemovePermission](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L500)

[RemoveProduct](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L413)

[RemovePurchasePolicy](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L141)

[RemovePurchaseType](https://github.com/tomsandalon/WSEP/blob/9e893fd29080d371259a425ed519485a4f2a9119/Logic/Service/Service.ts#L598)

</i>

# System configuration

The system configuration is located in 'Logic/Config.json'. This is a JSON file with the following attributes:

    - server_host: Address of the server
    - server_port: Port of the server
    - externalServices: Address to the external services
    - db_client: Type of DB
    - DB_connection:
        - host: Address of the DB
        - database: DB name
        - user: User to log with
        - password: Password to use
        - charset: Charset to use
        - port: Port of the SQL server
