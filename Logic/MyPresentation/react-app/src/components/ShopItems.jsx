import React, {Component} from 'react';
import FiltersItems from './FiltersItems';
import ItemOfShop from './ItemOfShop';
import 'bootstrap/dist/css/bootstrap.min.css';
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
            
            <div class="container">  
                <div class="row">
                    <div class="col-4">
                        <FiltersItems/>
                    </div> 
                    <div class="col-8">
                        <div class="row">
                    {this.state.items.map((item,index) => (
                        <ItemOfShop name={item.name} available={item.available} amount={item.amount} price={item.price}/>
                    ))}
                        </div>   
                    </div>
                </div> 
        </div>
        );
    }
}
export default ShopItems;