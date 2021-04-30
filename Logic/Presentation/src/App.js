import logo from './logo.svg';
import './App.css';
// const webSocketsServerPort = 8000;
// const webSocketServer = require('websocket').server;
// const http = require('http');
// // Spinning the http server and the websocket server.
// const server = http.createServer();
// server.listen(webSocketsServerPort);
// const wsServer = new webSocketServer({
//     httpServer: server
// });
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8080');

class Cons extends Component {
  componentDidMount() {
    console.log('I was triggered during componentDidMount')
  }

  render() {
    console.log('I was triggered during render')
    return (
        <div> I am the App component </div>
    )
  }
}
function App() {
  client.onopen = () => {
    client.send("Heyyyyyy")
    console.log('WebSocket Client Connected');
  };
  client.onmessage = (message) => {
    console.log(message);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
