const user = {
    name: 'user',
    pk: 'user_id',
    build: (builder) => builder.createTable(user.name, (table) => {
        table.integer(user.pk).unsigned().primary();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.integer('age').unsigned();
        table.boolean('admin').defaultTo(false)
    })
};
exports.user = user;
const shop = {
    name: 'shop',
    pk: 'shop_id',
    build: (builder) => builder.createTable(shop.name, (table) =>{
        table.integer(shop.pk).unsigned().primary();
        table.integer(user.pk).unsigned().notNullable().references(user.pk).inTable(user.name);
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.string('location').notNullable();
        table.string('bank_info').notNullable();
        table.boolean('active').notNullable();
    })
};
exports.shop = shop;
const product = {
    name: 'product',
    pk: 'product_id',
    build: (builder) => builder.createTable(product.name, (table) => {
        table.integer(product.pk).unsigned().primary();
        table.integer(shop.pk).unsigned().notNullable().references(shop.pk).inTable(shop.name);
        table.integer('purchase_type').unsigned().notNullable().references(purchase_type.pk).inTable(purchase_type.name);
        table.string('name').notNullable();
        table.integer('amount').unsigned().notNullable();
        table.float('base_price').unsigned().notNullable();
        table.string('description').notNullable();
        table.text('categories').notNullable();
    })
};
exports.product = product;
const purchase = {
    name: 'purchase',
    build: (builder) => builder.createTable(purchase.name, (table) => {
        table.integer(user.pk).unsigned().references(user.pk).inTable(user.name);
        table.integer(shop.pk).unsigned().references(shop.pk).inTable(shop.name);
        table.integer('purchase_id').unsigned();
        table.integer(product.pk).unsigned().references(product.pk).inTable(product.name);
        table.text('name').notNullable();
        table.text('categories');
        table.text('description');
        table.float('base_price');
        table.integer('amount').unsigned().notNullable();
        table.float('actual_price').unsigned().notNullable();
        table.timestamp('timestamp')
        table.primary([user.pk, shop.pk, 'purchase_id', product.pk]);
    })
};
exports.purchase = purchase;
const basket = {
    name: 'basket',
    build: (builder) => builder.createTable(basket.name, (table) => {
        table.integer(user.pk).references(user.pk).inTable(user.name).unsigned();
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.integer(product.pk).references(product.pk).inTable(product.name).unsigned();
        table.integer('amount').unsigned().notNullable();
        table.primary([user.pk, shop.pk, product.pk]);
    })
};
exports.basket = basket;
const purchase_type = {
    name: 'purchase_type',
    pk: 'purchase_type_id',
    build: (builder) => builder.createTable(purchase_type.name, (table) => {
        table.integer(purchase_type.pk).unsigned().primary();
    })
};
exports.purchase_type = purchase_type;
const offer = {
    name: 'offer',
    pk: 'offer_id',
    build: (builder) => builder.createTable(offer.name, (table) => {
        table.integer(user.pk).references(user.pk).inTable(user.name).unsigned();
        table.integer(product.pk).references(product.pk).inTable(product.name).unsigned();
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.integer(offer.pk).unsigned().primary();
        table.integer('isCounterOffer').unsigned().notNullable();
        table.integer('amount').unsigned().notNullable();
        table.float('price_per_unit').unsigned().notNullable();
    })
};
exports.offer = offer;
const offer_not_accepted_by = {
    name: 'offer_not_accepted_by',
    build: (builder) => builder.createTable(offer_not_accepted_by.name, (table) => {
        table.integer(user.pk).unsigned().references(user.pk).inTable(user.name);
        table.integer(offer.pk).references(offer.pk).inTable(offer.name).unsigned().onDelete('CASCADE');
        table.primary([user.pk, offer.pk]);
    })
};

exports.offer_not_accepted_by = offer_not_accepted_by;
const notification = {
    name: 'notification',
    build: (builder) => builder.createTable(notification.name, (table) => {
        table.integer(user.pk).references(user.pk).inTable(user.name).unsigned();
        table.integer('notification_id').unsigned();
        table.text('notification').notNullable();
        table.primary(['notification_id', user.pk]);
    })
};
exports.notification = notification;
const owns = {
    name: 'owns',
    build: (builder) => builder.createTable(owns.name, (table) => {
        table.integer(user.pk).references(user.pk).inTable(user.name).unsigned();
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.integer('appointer_id').unsigned().notNullable().references(user.pk).inTable(user.name);
        table.primary([user.pk, shop.pk]);
    })
};
exports.owns = owns;
const manages = {
    name: 'manages',
    build: (builder) => builder.createTable(manages.name, (table) => {
        table.integer(user.pk).references(user.pk).inTable(user.name).unsigned();
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.integer(permission.pk).unsigned().references(permission.pk).inTable(permission.name);
        table.integer('appointer_id').unsigned().notNullable().references(user.pk).inTable(user.name);
        table.primary([user.pk, shop.pk, permission.pk]);
    })
};
exports.manages = manages;
const permission = {
    name: 'permission',
    pk: 'permission_id',
    build: (builder) => builder.createTable(permission.name, (table) => {
        table.integer(permission.pk).unsigned().primary();
    })
};
exports.permission = permission;
const rates = {
    name: 'rates',
    build: (builder) => builder.createTable(rates.name, (table) => {
        table.integer(user.pk).references(user.pk).inTable(user.name).unsigned();
        table.integer('p_id').references(product.pk).inTable(product.name).unsigned();
        table.integer('rate').unsigned().notNullable();
        table.primary([user.pk, 'p_id']);
    })
};
exports.rates = rates;
const available = {
    name: 'available',
    build: (builder) => builder.createTable(available.name, (table) => {
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.integer(purchase_type.pk).references(purchase_type.pk).inTable(purchase_type.name).unsigned();
        table.primary([shop.pk, purchase_type.pk]);
    })
};
exports.available = available;
const purchase_condition_operator = {
    name: 'purchase_condition_operator',
    pk: 'operator_id',
    build: (builder) => builder.createTable(purchase_condition_operator.name, (table) => {
        table.integer(purchase_condition_operator.pk).unsigned().primary();
    })
};
exports.purchase_condition_operator = purchase_condition_operator;
const purchase_condition_type = {
    name: 'purchase_condition_type',
    pk: 'type_id',
    build: (builder) => builder.createTable(purchase_condition_type.name, (table) => {
        table.integer(purchase_condition_type.pk).unsigned().primary();
    })
};
exports.purchase_condition_type = purchase_condition_type;
const purchase_simple_condition = {
    name: 'purchase_simple_condition',
    pk:'simple_id',
    build: (builder) => builder.createTable(purchase_simple_condition.name, (table) => {
        table.integer(purchase_simple_condition.pk).references(purchase_condition.pk).inTable(purchase_condition.name).unsigned().primary().onDelete('CASCADE');
        table.string('value').notNullable();
    })
};
exports.purchase_simple_condition = purchase_simple_condition;
const purchase_composite_condition = {
    name: 'purchase_composite_condition',
    pk: 'composite_id',
    build: (builder) => builder.createTable(purchase_composite_condition.name, (table) => {
        table.integer(purchase_composite_condition.pk).references(purchase_condition.pk).inTable(purchase_condition.name).unsigned().primary().onDelete('CASCADE');
    })
};
exports.purchase_composite_condition = purchase_composite_condition;
const purchase_condition = {
    name: 'purchase_condition',
    pk: 'p_condition_id',
    build: (builder) => builder.createTable(purchase_condition.name, (table) => {
        table.integer(purchase_condition.pk).unsigned().primary();
    })
};
exports.purchase_condition = purchase_condition;
const purchase_comprised = {
    name: 'purchase_comprised',
    build: (builder) => builder.createTable(purchase_comprised.name, (table) => {
        table.integer(purchase_condition_operator.pk).references(purchase_condition_operator.pk).inTable(purchase_condition_operator.name).unsigned();
        table.integer(purchase_composite_condition.pk).references(purchase_composite_condition.pk).inTable(purchase_composite_condition.name).unsigned().onDelete('CASCADE');
        table.integer('first').references(purchase_condition.pk).inTable(purchase_condition.name).unsigned().onDelete('CASCADE');
        table.integer('second').references(purchase_condition.pk).inTable(purchase_condition.name).unsigned().onDelete('CASCADE');
        table.primary([purchase_condition_operator.pk, purchase_composite_condition.pk]);
    })
};
exports.purchase_comprised = purchase_comprised;
const purchase_condition_allowed_in = {
    name: 'purchase_condition_allowed_in',
    build: (builder) => builder.createTable(purchase_condition_allowed_in.name, (table) => {
        table.integer(purchase_condition.pk).references(purchase_condition.pk).inTable(purchase_condition.name).unsigned().onDelete('CASCADE');
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.primary([purchase_condition.pk, shop.pk]);
    })
};
exports.purchase_condition_allowed_in = purchase_condition_allowed_in;
const purchase_simple_condition_type_of = {
    name: 'purchase_simple_condition_type_of',
    build: (builder) => builder.createTable(purchase_simple_condition_type_of.name, (table) => {
        table.integer(purchase_simple_condition.pk).references(purchase_simple_condition.pk).inTable(purchase_simple_condition.name).unsigned().onDelete('CASCADE');
        table.integer(purchase_condition_type.pk).references(purchase_condition_type.pk).inTable(purchase_condition_type.name).unsigned();
        table.primary([purchase_simple_condition.pk, purchase_condition_type.pk]);
    })
};
exports.purchase_simple_condition_type_of = purchase_simple_condition_type_of;
const discount_condition_type = {
    name: 'discount_condition_type',
    pk: 'discount_condition_type_id',
    build: (builder) => builder.createTable(discount_condition_type.name, (table) => {
        table.integer(discount_condition_type.pk).unsigned().primary();
    })
};
exports.discount_condition_type = discount_condition_type;
const discount_conditional = {
    name: 'discount_conditional',
    pk: 'discount_conditional_id',
    build: (builder) => builder.createTable(discount_conditional.name, (table) => {
        table.integer(discount_conditional.pk).references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE').primary();
        table.string('discount_param').notNullable();
    })
};
exports.discount_conditional = discount_conditional;
const discount_composite = {
    name: 'discount_composite',
    pk: 'discount_composite_id',
    build: (builder) => builder.createTable(discount_composite.name, (table) => {
        table.integer(discount_composite.pk).references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE').primary();
    })
};
exports.discount_composite = discount_composite;
const discount_simple = {
    name: 'discount_simple',
    build: (builder) => builder.createTable(discount_simple.name, (table) => {
        table.integer(discount.pk).references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE').primary();
        table.float('value').unsigned().notNullable();
    })
};
exports.discount_simple = discount_simple;
const discount_operator = {
    name: 'discount_operator',
    pk: 'discount_operator_id',
    build: (builder) => builder.createTable(discount_operator.name, (table) => {
        table.integer(discount_operator.pk).unsigned().primary();
    })
};
exports.discount_operator = discount_operator;
const discount = {
    name: 'discount',
    pk: 'discount_id',
    build: (builder) => builder.createTable(discount.name, (table) => {
        table.integer(discount.pk).unsigned().primary();
    })
};
exports.discount = discount;
const discount_allowed_in = {
    name: 'discount_allowed_in',
    build: (builder) => builder.createTable(discount_allowed_in.name, (table) => {
        table.integer(discount.pk).references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE');
        table.integer(shop.pk).references(shop.pk).inTable(shop.name).unsigned();
        table.primary([discount.pk, shop.pk]);
    })
};
exports.discount_allowed_in = discount_allowed_in;
const discount_comprised_composite = {
    name: 'discount_comprised_composite',
    build: (builder) => builder.createTable(discount_comprised_composite.name, (table) => {
        table.integer('first').references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE');
        table.integer('second').references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE');
        table.integer(discount_composite.pk).references(discount_composite.pk).inTable(discount_composite.name).unsigned().onDelete('CASCADE');
        table.integer(discount_operator.pk).references(discount_operator.pk).inTable(discount_operator.name).unsigned();
        table.primary([discount_composite.pk, discount_operator.pk]);
    })
};
exports.discount_comprised_composite = discount_comprised_composite;
const discount_comprised_conditional = {
    name: 'discount_comprised_conditional',
    build: (builder) => builder.createTable(discount_comprised_conditional.name, (table) => {
        table.integer(discount.pk).references(discount.pk).inTable(discount.name).unsigned().onDelete('CASCADE');
        table.integer(discount_conditional.pk).references(discount_conditional.pk).inTable(discount_conditional.name).unsigned().onDelete('CASCADE');
        table.primary([discount.pk, discount_conditional.pk]);
    })
};
exports.discount_comprised_conditional = discount_comprised_conditional;
const discount_conditional_type_of = {
    name: 'discount_conditional_type_of',
    build: (builder) => builder.createTable(discount_conditional_type_of.name, (table) => {
        table.integer(discount_conditional.pk).references(discount_conditional.pk).inTable(discount_conditional.name).unsigned().onDelete('CASCADE');
        table.integer(discount_condition_type.pk).references(discount_condition_type.pk).inTable(discount_condition_type.name).unsigned();
        table.primary([discount_conditional.pk, discount_condition_type.pk]);
    })
};
exports.discount_conditional_type_of = discount_conditional_type_of;