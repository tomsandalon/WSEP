import React, { useEffect,useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Noti.css';
import SocketIO from 'socket.io-client';

function Notifications(props){
    // console.log(props);
    const cookie = document.cookie;
    // const port = 8000;
    // const localhost = 'https://localhost:' + port;
    const [notifications, setNotifications] = useState({ 
    alerts:[]
    });
    // const [socket, setSocket] = useState(SocketIO(localhost));
    props.socket.emit("Hello", cookie);
    props.socket.emit("Send Notifications",cookie);
    props.socket.on("Get Notifications", (message) => {
        if(message.length > 2){
            setNotifications({alerts:[message,...notifications.alerts]});
        }
    });
    // props.socket.on("Pending Notifications", (amount) => {
    //     console.log("amountnofiti",amount);
    //     props.socket.emit("Send Notifications",cookie);
    // });
    
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