import React, { Component} from 'react';

class Unatho extends Component {
    render() {
        return(
            <React.Fragment>
            <div className="gandalf">
            <div className="fireball"></div>
            <div className="skirt"></div>
            <div className="sleeves"></div>
            <div className="shoulders">
                <div className="hand left"></div>
                <div className="hand right"></div>
            </div>
            <div className="head">
                <div className="hair"></div>
                <div className="beard"></div>
            </div>
            </div>
            <div className="message">
            <h3>403 - You Shall Not Pass</h3>
            <h4>Uh oh, Gandalf is blocking the way!<br/>Maybe you have a typo in the url? Or you meant to go to a different location? Like...Hobbiton?</h4>
            <h3>
                <a className="nav-links cartButton2 btn-primary btn-sm" href="/home">
                            Go Home
                </a>
            </h3>
            </div>
            </React.Fragment>
        )
    }
}
export default Unatho;