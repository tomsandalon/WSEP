let server_host = 'localhost';
let server_port = 8000;
let externalServices = "https://cs-bgu-wsep.herokuapp.com/";
let db_client = 'mysql'
let db_connection = {
    host: '127.0.0.1',
    database: 'wsep',
    user:     'Mark',
    password: 'FuckUniv2021',
    charset: 'utf8'
};
let isLoaded = false;
exports.getServerHost = () => {
    if (!isLoaded){
        isLoaded = true;
    }
    return server_host;
}
exports.getServerPort = () => {
    if (!isLoaded){
        isLoaded = true;
    }
    return server_port;
}
exports.getExternalServices = () => {
    if (!isLoaded){
        isLoaded = true;
    }
    return externalServices;
}
exports.getDB_Client = () => {
    if (!isLoaded){
        isLoaded = true;
    }
    return db_client;
}
exports.getDB_Connection = () => {
    if (!isLoaded){
        isLoaded = true;
    }
    return db_connection;
}
