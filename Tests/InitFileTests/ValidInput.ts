export const validInput = `
{
  "users": [
    {
      "username": "Liorpev@gmail.com",
      "password": "123456"
    },
    {
      "username": "Mark@gmail.com",
      "password": "123456"
    },
    {
      "username": "TomAndSons@gmail.com",
      "password": "123456"
    },
    {
      "username": "Tomer@gmail.com",
      "password": "123456"
    },
    {
      "username": "a@gmail.com",
      "password": "123456"
    },
    {
      "username": "b@gmail.com",
      "password": "123456"
    }
  ],
  "shops": [
    {
      "original_owner": "TomAndSons@gmail.com",
      "name": "NVIDIA",
      "description": "BEST GPU 4 Ever",
      "location": "Taiwan",
      "bank_info": "Taiwan 4 ever",
      "purchase_type": "Offer"
    },
    {
      "original_owner": "TomAndSons@gmail.com",
      "name": "ZARA",
      "description": "Best style in UK",
      "location": "China",
      "bank_info": "Budaa 4 ever",
      "purchase_type": "Offer"
    }
  ],
  "products": [
    {
      "shop_name": "NVIDIA",
      "name": "GTX 1060",
      "description": "6GB RAM",
      "amount": 50,
      "categories": ["GPU"],
      "base_price": 1000
    },
    {
      "shop_name": "NVIDIA",
      "name": "RTX 3080",
      "description": "Best performance",
      "amount": 10,
      "categories": ["GPU"],
      "base_price": 2000,
      "purchase_type": "Offer"
    },
    {
      "shop_name": "NVIDIA",
      "name": "RTX 2080",
      "description": "Best power consumption",
      "amount": 0,
      "categories": ["GPU"],
      "base_price": 3000,
      "purchase_type": "Offer"
    },
    {
      "shop_name": "NVIDIA",
      "name": "GTX 280",
      "description": "Innovative tech",
      "amount": 30,
      "categories": ["GPU"],
      "base_price": 4000
    },
    {
      "shop_name": "NVIDIA",
      "name": "GTX 980",
      "description": "Economic power device",
      "amount": 10,
      "categories": ["GPU"],
      "base_price": 5000
    },
    {
      "shop_name": "ZARA",
      "name": "Leather Jacket",
      "description": "Leather from black mamba",
      "amount": 500,
      "categories": ["Winter", "Men"],
      "base_price": 1000,
      "purchase_type": "Offer"
    },
    {
      "shop_name": "ZARA",
      "name": "Fur for lady",
      "description": "From white fox",
      "amount": 400,
      "categories": ["Winter", "Evening"],
      "base_price": 1000
    },
    {
      "shop_name": "ZARA",
      "name": "Lycra shirt",
      "description": "made in Japan",
      "amount": 100,
      "categories": ["Evening", "Men"],
      "base_price": 1000
    },
    {
      "shop_name": "ZARA",
      "name": "Boots",
      "description": "made in USA",
      "amount": 70,
      "categories": ["Shoes"],
      "base_price": 1000
    },
    {
      "shop_name": "ZARA",
      "name": "Shoes",
      "description": "Made form plastic",
      "amount": 800,
      "categories": ["Shoes"],
      "base_price": 1000
    }
  ],
  "discounts": [
    {
      "id": 1,
      "type": "simple",
      "shop_name": "NVIDIA",
      "value": 0.5
    },
    {
      "id": 2,
      "type": "conditional",
      "shop_name": "NVIDIA",
      "apply_on": 1,
      "condition": "Amount",
      "parameter": "3"
    },
    {
      "id": 3,
      "type": "simple",
      "shop_name": "NVIDIA",
      "value": 0.2
    },
    {
      "id": 4,
      "type": "composite",
      "shop_name": "NVIDIA",
      "apply_on_first": 3,
      "apply_on_second": 2,
      "operator": "And"
    }
  ],
  "purchase_policies": [

  ],
  "offers": [

  ]
}`