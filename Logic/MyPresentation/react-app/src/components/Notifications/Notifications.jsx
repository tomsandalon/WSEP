import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Noti.css'
class Notifications extends Component {
    state = {
        alerts:["Alert from user 1",
        "Alert from user 2",
        "Alert from user 3",
        "Alert from user 4",
        "Alert from user 5",
        "Alert from user 6"]
    };
    fetchNotifications = () =>{
        console.log("Notifications")
    }
    componentDidMount(){
        this.fetchNotifications();
    }
    render() {
        return(
            <div className="wrapper2 fadeInDown">
            <div id="form2">
                <div className="fadeIn first">
      {/* <             img src={Reactlogo} id="icon" alt="User Icon" /> */}
                    <h1>Notifications</h1>
                </div>
                <form>
                    <ul>
                        {this.state.alerts.map((alert) => 
                        <div class="rowalert alert alert-primary" role="alert">
                            <i className="icon3 far fa-bell"></i>{alert}
                        </div>
                        )}
                    </ul>
                </form>
            </div>
        </div>
        )
    }
}
export default Notifications;