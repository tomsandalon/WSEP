import React, {Component} from 'react';
import FiltersItems from './FiltersItems';
import ItemOfShop from './ItemOfShop';
import 'bootstrap/dist/css/bootstrap.min.css';
class ShopItems extends Component {

    render() {
        return (
            <div className="container">  
                <div className="row">
                    <div className="col-4">
                        <FiltersItems handleCategory={this.props.handleCategory} shopsInfo={this.props.shopsInfo}/>
                    </div> 
                    <div className="col-8">
                        <div className="row">
                            {((this.props !== null) && (this.props.shopsInfo.length !== 0)) &&
                            (this.props.shopsInfo.map(shop =>
                                    shop.products.map(item =>
                                        <ItemOfShop productID={item._product_id} shopID={shop.id} shopName={shop.name} name={item._name} available="Available" amount={item._amount} price={item._base_price}/>
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