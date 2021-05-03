import React, {Component} from 'react';
import './Product.css';
import ItemOfShop from './ItemOfShop';
class ShopItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items:[
            {name:'Beer',available:'In Stock' ,cost:12, amount:15},
            {name:'Cola',available:'In Stock' , cost:25, amount:15},
            {name:'Vodka',available:'In Stock' , cost:13, amount:15},
            {name:'Midori', available:'In Stock' ,cost:17, amount:15},
            {name:'Apple-Juice',available:'In Stock' , cost:12, amount:15},
            {name:'Mountaindew',available:'In Stock' , cost:12, amount:15},
            {name:'Rum',available:'In Stock' , cost:12, amount:15},
            {name:'Whisky', available:'In Stock' ,cost:12, amount:15},
            {name:'Sprite',available:'In Stock' , cost:12, amount:15},
            {name:'Fanta',available:'In Stock' , cost:12, amount:15},
            ]
        };
    }
    render() {
        return (
    
    <div className="container mb-4">
        <section className="jumbotron text-center">
        <div className="container">
            <h1 className="jumbotron-heading" margin="center">Shop items</h1>
        </div>
    </section>
        <div className="row">
            <div className="col-12">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col"> </th>
                                <th scope="col">Product</th>
                                <th scope="col">Available</th>
                                <th scope="col" className="text-center">Quantity</th>
                                <th scope="col" className="text-right">Price</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map((item,index) =>
                            <ItemOfShop idKey={index} name={item.name} available={item.available} amount={item.amount} price={item.cost} ></ItemOfShop>
                            )} 
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
        );
    }
}
export default ShopItems;