import React,{Component} from 'react';
import OrderUser from './OrderUser';
class UserHistory extends Component {
    constructor(props)
    {
        super(props);
        this.state = ({
            userHistory:[]
        })
    }
    refreshHistory = () =>{
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': document.cookie
			},
		  };
		  fetch('/purchase',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					response.json().then(
						history => {
							let userHistory =[]
							userHistory = history.map(order => {
								const temp = {
								order_id:(JSON.parse(order).order_id),
								shop_id:(JSON.parse(order).shop),
								shop_name:(JSON.parse(order).shop_name),
								products:(JSON.parse(order).products)
								}
								return temp;
							});
							// cart = baskets.map(basket => {
							// 	const temp ={
							// 		basket_id:JSON.parse(basket).basket_id,
							// 		shop_id:JSON.parse(basket).shop.id,
							// 		shop_name:JSON.parse(basket).shop.name,
							// 		products:JSON.parse(basket).products,
							// 	}
							// 	return temp;
							// 	// JSON.parse(basket).products.forEach(product => console.log(product))
							// })
							this.setState({userHistory:userHistory})
						}
						)
					break;
					case 400:
					// const err_message = await response.text();
                    this.setState({userHistory:[]})
                    break;
                	case 404: //server not found
                    break;
					default:
					break;
				}
			})
	}
    componentDidMount(){
        this.refreshHistory();
    }
    render() {
        return (
            <div className="row">
					{this.state.userHistory.length === 0 ? <div className="col-4"><h1>Shopping history is empty!</h1></div> : 
					this.state.userHistory.map(purchase => 
					<OrderUser order_id={purchase.order_id} shop_name={purchase.shop_name} shop_id={purchase.shop_id} products={purchase.products}/>
					)}
				</div>
        )
    }
}
export default UserHistory;