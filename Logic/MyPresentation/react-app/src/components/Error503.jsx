import React, { Component}from 'react';
import Reactlogo from './images/error_503.png'
class Error503 extends Component {
    render() {
        return(
            <React.Fragment>
                 <img src={Reactlogo} id="icon" alt="User Icon" />
                
                <h1>The service you requests is not available at this time.</h1>
    
            </React.Fragment>
    
        )
    }
};
export default Error503;