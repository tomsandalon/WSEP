import React, {Component} from 'react';
import RadioUser from './RadioUser';
import RadioShop from './RadioShop';
import 'bootstrap/dist/css/bootstrap.min.css';
class AdminMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users:["email0","email1","email2","email03","email4"],
            shops:["shop0","shop1","shop2","shop3","shop4"],
            userInfo:'',
            shopInfo:''         
        }
    }
    handleUser = (info) => {
        console.log(info);
    }
    handleShop = (info) => {
        console.log(info);
    }
    render() {
        return (
                <div className="row">
                    <div className="col-6">
                    <h1>Choose a user to display</h1>
                    <ul id="stats">
                        {this.state.users.map((user,index) => 
                            <RadioUser id={index} user={user} handleUser={this.handleUser}/>
                        )}
                    </ul>
                    </div>
                    <div className="col-6">
                    <h1>Choose a shop to display</h1>
                    <ul id="stats">
                        {this.state.shops.map((user,index) => 
                            <RadioShop id={index} user={user} handleShop={this.handleShop}/>
                        )}
                    </ul>
                    </div>
                </div>
        )
    }
}
export default AdminMenu;