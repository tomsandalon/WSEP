import React, {Component} from 'react';
import RadioUser from './RadioUser';
import RadioShop from './RadioShop';
import UserHistory from './UserHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from 'reactstrap';
class AdminMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users:[],
            shops:[],
            userInfo:[],
            shopInfo:[],
            successVisible:false,
            errorMsg:'' ,
            successVisibleShop:false,
            errorMsgShop:''  
        }
        this.fetchUsers();
        this.fetchShops();
    }
    onShowAlert = ()=>{
        this.setState({successVisible:true,errorMsg:"No inormation available"},()=>{
            window.setTimeout(()=>{
            this.setState({successVisible:false})
            },2000)
        });
    }
    onShowAlertShop = ()=>{
        this.setState({successVisibleShop:true,errorMsgShop:"No inormation available"},()=>{
            window.setTimeout(()=>{
            this.setState({successVisibleShop:false})
            },2000)
        });
    }
    
    handleUserDisplay = (id) => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie}
        };
        fetch("/user/admin/history/user?user_inspect="+id.toString(), requestOptions)
            .then((response) => {
                switch(response.status){
                    case 200:
                        response.json().then((histories)=>{
                            let userInfo = [];
                            histories.forEach((history) => {
                                const tempHistory = JSON.parse(history);
                                const products = tempHistory.products;
                                // const products = products_string.map((product) =>
                                //     JSON.parse(product)
                                // );
                                // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
                                const historyInfo = {
                                order_id: tempHistory.order_id,
                                shop_id: tempHistory.shop,
                                shop_name: tempHistory.shop_name,
                                products: products,
                                date:tempHistory.date
                                };
                                userInfo.push(historyInfo);
                            });
                            this.setState({userInfo: userInfo});
                        })
                    break;
                    case 401:
                        this.onShowAlert();
                        // window.location.reload("/home");
                    break;
                    case 404:
                        const err_message = response.text();
                        console.log("err",err_message);
                    break;
                    default:
                    break;
                    
                }
            });
    }
    handleShopDisplay = (id) => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie}
        };
        fetch("/user/admin/history/shop?shop_id="+id.toString(), requestOptions)
            .then((response) => {
                switch(response.status){
                    case 200:
                        response.json().then((histories)=>{
                            if(histories.length === 0){
                                this.onShowAlertShop();
                            }
                            let shopInfo = [];
                            histories.forEach((history) => {
                                const tempHistory = JSON.parse(history);
                                const products = tempHistory.products;
                                // const products = products_string.map((product) =>
                                //     JSON.parse(product)
                                // );
                                // products.forEach(product => product._category.forEach(cat => console.log(cat._name)))
                                const historyInfo = {
                                order_id: tempHistory.order_id,
                                shop_id: tempHistory.shop,
                                shop_name: tempHistory.shop_name,
                                products: products,
                                date:tempHistory.date
                                };
                                shopInfo.push(historyInfo);
                            });
                            this.setState({shopInfo: shopInfo});
                        })
                    break;
                    case 401:
                        console.log("alert")
                        this.onShowAlertShop();
                        // window.location.reload("/home");
                    break;
                    case 404:
                        const err_message = response.text();
                        console.log("err",err_message);
                    break;
                    default:
                    break;
                    
                }
            });
    }
    fetchUsers = () =>{
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie},
        };
        fetch("/user/admin/users", requestOptions)
            .then((response) => {
                switch(response.status){
                    case 200:
                        response.json().then((users)=>{
                            let usersDisplay = []
                            usersDisplay = users.map(user => JSON.parse(user))
                            this.setState({users:usersDisplay})
                        })
                    break;
                    case 401:
                        window.location.reload("/home");
                    break;
                    case 404:
                        const err_message = response.text();
                        console.log(err_message);
                    break;
                    default:
                    break;
                    
                }
            });
    }
    fetchShops = () =>{
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json",
                        'Cookie': document.cookie },
        };
        fetch("/user", requestOptions)
            .then((response) => {
                switch(response.status){
                    case 200:
                        response.json().then((shops)=>{
                            // console.log("hey",shops)
                            let shopDisplay = []
                            shopDisplay = shops.map(shop => JSON.parse(shop))
                            this.setState({shops:shopDisplay})
                        })
                    break;
                    case 401:
                        window.location.reload("/home");
                    break;
                    case 404:
                        const err_message = response.text();
                        console.log(err_message);
                    break;
                    default:
                    break;
                    
                }
            });
    }
    render() {
        return (
            <div>
                <h1>Welcome admin</h1>
                <div className="row">
                    <div className="col-6">
                    <h1>Choose a user to display</h1>
                    <ul id="stats">
                        {this.state.users.length > 0 && this.state.users.map((user,index) => 
                            <RadioUser id={index} user_id={user.user_id} user_email={user.user_email} handleUserDisplay={this.handleUserDisplay}/>
                        )}
                    </ul>
                    </div>
                    <div className="col-6">
                    <h1>Choose a shop to display</h1>
                    <ul id="stats">
                        {this.state.shops.length > 0 && this.state.shops.map((shop,index) => 
                            <RadioShop id={index} shop_id={shop.shop_id} shop_name={shop.shop_name} handleShopDisplay={this.handleShopDisplay}/>
                        )}
                    </ul>
                    </div>
                </div>
                <div className="row">
                        <div className="col-6">
                            {this.state.userInfo.length > 0 && 
                            this.state.userInfo.map(history =>
                                <UserHistory history={history}/>
                            )
                            }
                            <Alert color="danger" isOpen={this.state.successVisible}>{this.state.errorMsg}</Alert>
                        </div>
                        <div className="col-6">
                            {this.state.shopInfo.length > 0 && 
                            this.state.shopInfo.map(history =>
                                <UserHistory history={history}/>
                            )
                            }
                            <Alert color="danger" isOpen={this.state.successVisibleShop}>{this.state.errorMsgShop}</Alert>
                        </div>
                </div>
            </div>              
        )
    }
}
export default AdminMenu;