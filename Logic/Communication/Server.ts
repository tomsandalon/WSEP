import {Data} from "ws";
import WebSocket = require("ws");
import {sleep} from "async-parallel";
import {System} from "../../Tests/AcceptanceTests/System";
import {SystemDriver} from "../../Tests/AcceptanceTests/SystemDriver";

// const wss = new WebSocket.Server({
//     port: 8080,
//     perMessageDeflate: {
//         zlibDeflateOptions: {
//             // See zlib defaults.
//             chunkSize: 1024,
//             memLevel: 7,
//             level: 3
//         },
//         zlibInflateOptions: {
//             chunkSize: 10 * 1024
//         },
//         // Other options settable:
//         clientNoContextTakeover: true, // Defaults to negotiated value.
//         serverNoContextTakeover: true, // Defaults to negotiated value.
//         serverMaxWindowBits: 10, // Defaults to negotiated value.
//         // Below options specified as default values.
//         concurrencyLimit: 10, // Limits zlib concurrency for perf.
//         threshold: 1024 // Size (in bytes) below which messages
//         // should not be compressed.
//     }
// });
const system: System = SystemDriver.getSystem(true);
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function connection(ws: WebSocket) {
    let id = system.openSession();
    ws.on('message', function incoming(message: Data) {
        sleep(1000).then(_ => ws.send(`Hey you are client ${id}`))
        console.log('received: %s', message);
    });
});
console.log("Server successful boot")
