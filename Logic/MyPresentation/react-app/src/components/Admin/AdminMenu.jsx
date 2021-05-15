import React, {Component} from 'react';
import RadioUser from './RadioUser';
import RadioShop from './RadioShop';
import 'bootstrap/dist/css/bootstrap.min.css';
class AdminMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users:[],
            shops:[],
            userInfo:'',
            shopInfo:''         
        }
        this.fetchUsers()
    }
    handleUserDisplay = (info) => {
        console.log(info);
    }
    handleShopDisplay = (info) => {
        console.log(info);
    }
    fetchUsers = () =>{
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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
    render() {
        return (
                <div className="row">
                    <div className="col-6">
                    <h1>Choose a user to display</h1>
                    <ul id="stats">
                        {this.state.users.length > 0 && this.state.users.map((user,index) => 
                            <RadioUser id={index} user_id={user.user_id} user_email={user.user_email} handleUserDisplayDisplay={this.handleUserDisplay}/>
                        )}
                    </ul>
                    </div>
                    <div className="col-6">
                    <h1>Choose a shop to display</h1>
                    <ul id="stats">
                        {this.state.shops.length > 0 && this.state.shops.map((user,index) => 
                            <RadioShop id={index} user_id={user.user_id} user_email={user.user_email} handleShopDisplay={this.handleShopDisplay}/>
                        )}
                    </ul>
                    </div>
                </div>
        )
    }
}
export default AdminMenu;