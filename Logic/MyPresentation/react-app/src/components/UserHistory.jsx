import React,{Component} from 'react';

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
		  fetch('/user-history',requestOptions)
			  .then(async response => {
				switch(response.status){
					case 200: //welcome
					response.json().then(
						baskets => {
							let cart =[]
							cart = baskets.map(basket => {
								const temp ={
									basket_id:JSON.parse(basket).basket_id,
									shop_id:JSON.parse(basket).shop.id,
									shop_name:JSON.parse(basket).shop.name,
									products:JSON.parse(basket).products,
								}
								return temp;
								// JSON.parse(basket).products.forEach(product => console.log(product))
							})
							this.setState({cart:cart})
						}
						)
					break;
					case 400:
					const err_message = await response.text();
                    this.setState({cart:[]})
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
            <h1>Sup</h1>
        )
    }
}
export default UserHistory;