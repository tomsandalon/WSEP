import React, { useEffect,useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Noti.css';
import SocketIO from 'socket.io-client';
import Helper from './Helper';

function Notifications(){
    const cookie = document.cookie;
    const port = 8000;
    const localhost = 'https://localhost:' + port;
    const [notifications, setNotifications] = useState({ 
    alerts:[]
    });
    const [socket, setSocket] = useState(SocketIO(localhost));
    socket.emit("Hello", cookie);
    // socket.emit("Send Notifications",cookie);
    socket.on("Get Notifications", (message) => {
        if(message.length > 2){
            setNotifications({alerts:[message,...notifications.alerts]});
        }
    });
    socket.on("Pending Notifications", () => {
        socket.emit("Send Notifications",cookie);
    });
    
    // useEffect(() => {
    //     socket.emit("Hello", cookie);
    //     // socket.emit("Send Notifications",cookie);
    //   }, []);
        return(
            <div className="wrapper2 fadeInDown">
            <div id="form2">
                <div className="fadeIn first">
      {/* <             img src={Reactlogo} id="icon" alt="User Icon" /> */}
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