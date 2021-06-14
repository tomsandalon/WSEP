import React, { Component}from 'react';
import Reactlogo from './images/error_503.jpg'
class Error503 extends Component {
    render() {
        return(
            <React.Fragment>
                 <img src={Reactlogo} id="icon" alt="User Icon" />
                
                {/* <h1>The service you requested is not available at this time, please try again later.</h1> */}
    
            </React.Fragment>
    
        )
    }
};
export default Error503;