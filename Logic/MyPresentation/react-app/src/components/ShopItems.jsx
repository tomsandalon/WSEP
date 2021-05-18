import React, {Component} from 'react';
import FiltersItems from './FiltersItems';
import ItemOfShop from './ItemOfShop';
import 'bootstrap/dist/css/bootstrap.min.css';
class ShopItems extends Component {

    state = {
        shopsInfo: null
    }
    handleFilter = (filters) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category_names: filters.categoriesFilter,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating,
            search_name_term: filters.search,
          }),
        };
        fetch("/home/filter", requestOptions)
          .then((response) => response.json())
          .then((shops) => {
                let shopsInfo = [];
                shops.forEach((shop) => {
                 const tempShop = JSON.parse(shop);
                 const products = tempShop.products;
                const shopInfo = {
                id: tempShop.shop_id,
                name: tempShop.shop_name,
                products: products,
                };
                shopsInfo.push(shopInfo);
            });
            this.setState({ shopsInfo: shopsInfo });
            console.log("aftertase",this.state)
            });
      };
    displayShops = () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };
    fetch("/home", requestOptions)
        .then((response) => response.json())
        .then((shops) => {
        let shopsInfo = [];
        shops.forEach((shop) => {
            const tempShop = JSON.parse(shop);
            const products_string = JSON.parse(tempShop.products);
            const products = products_string.map((product) =>
            JSON.parse(product)
            );
            console.log("products shop",products)
            // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
            const shopInfo = {
            id: tempShop.shopID,
            name: tempShop.name,
            products: products,
            };
            shopsInfo.push(shopInfo);
        });
        this.setState({ shopsInfo: shopsInfo });
        });
    };
    openSession = () => {
    if (sessionStorage.getItem("loggedUser") == null) {
        const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        };
        fetch("/guest", requestOptions).then(async (response) => {
        switch (response.status) {
            case 200: //welcome
            sessionStorage.setItem("loggedUser","Guest")
            break;
            case 404:
            const err_message = await response.text();
            console.log(err_message);
            break;
            default:
            break;
        }
        });
    }
    };
componentDidMount(){
    this.openSession();
    this.displayShops();
}
    render() {
        return (
            <div className="container">  
                <div className="row">
                    <div className="col-4">
                        <FiltersItems handleFilter={this.handleFilter} shopsInfo={this.state.shopsInfo}/>
                    </div> 
                    <div className="col-8">
                        <div className="row">
                            {((this.state.shopsInfo !== null) && (this.state.shopsInfo.length !== 0)) &&
                            (this.state.shopsInfo.map(shop =>
                                    shop.products.map(item =>
                                        <ItemOfShop rating={item._rating.number_of_rating} productID={item._product_id} shopID={shop.id} shopName={shop.name} name={item._name} available="Available" amount={item._amount} price={item._base_price}/>
                                    )
                            ))}
                        </div>   
                    </div>
                </div> 
        </div>
        );
    }
}
export default ShopItems;