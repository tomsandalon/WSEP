import React, {Component} from 'react';
import FiltersItems from './FiltersItems';
import ItemOfShop from './ItemOfShop';
import 'bootstrap/dist/css/bootstrap.min.css';
class ShopItems extends Component {
    state = {
        shopsInfo:[]
    };
    handleLogout = () =>{
        console.log("Logged out");
    }
    openSession = () =>{
        console.log(Math.random())
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('/home',requestOptions)
            .then(response => response.json())
            .then(shops=>{
                let shopsInfo = [];
                shops.map(shop =>{
                    const tempShop = JSON.parse(shop);
                    const products_string = JSON.parse(tempShop.products);
                    const products = products_string.map(product => JSON.parse(product));
                    // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
                    const shopInfo = {id:tempShop.shopID,name:tempShop.name,products:products};
                    shopsInfo.push(shopInfo)
                })
                this.setState({shopsInfo:shopsInfo})
            })
    }
    componentDidMount() {
        this.openSession()
    }
    render() {
        return (
            
            <div class="container">  
                <div class="row">
                    <div class="col-4">
                        <FiltersItems/>
                    </div> 
                    <div class="col-8">
                        <div class="row">
                            {(this.state.shopsInfo.length != 0) &&
                            (this.state.shopsInfo.map(shop =>
                                    shop.products.map(item =>
                                        <ItemOfShop name={item._name} available="Available" amount={item._amount} price={item._base_price}/>
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