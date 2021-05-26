import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Noti.css';

function Notifications(props){
    const cookie = document.cookie;
    const [notifications, setNotifications] = useState({ 
    alerts:[]
    });
    props.socket.emit("Hello", cookie);
    props.socket.emit("Send Notifications",cookie);
    props.socket.on("Get Notifications", (message) => {
        const alerts = message.map(val => JSON.stringify(val));
        console.log("alerts",alerts);
        if(alerts.length > 0){
            setNotifications({alerts:alerts});
        }
    });
    props.socket.on("Pending Notifications", (amount) => {
        props.socket.emit("Send Notifications",cookie);
    });
    
        return(
            <div className="wrapper2 fadeInDown">
            <div id="form2">
                <div className="fadeIn first">
                    <h1>Notifications</h1>
                </div>
                <form>
                    <ul>
                        {notifications.alerts.length === 0 ? <div class="rowalert alert alert-danger" role="alert">
                                                                <i className="icon3 far fa-bell"><h4>No alerts available.</h4></i> 
                                                            </div>
                        : notifications.alerts.map((alert) => 
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
export default Notifications;