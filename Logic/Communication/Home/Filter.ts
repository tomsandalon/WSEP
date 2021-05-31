import {service, Session, sid} from "../Config/Config";

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
module.exports = router;
const ws_client = path.join(__dirname, 'ws_client.html');
router.post('/',(request: any, response: any) => {
    response.status(200);
    response.setHeader("Content-Type", "application/json");
    response.send(
        service.filterSearch(
            request.body.category_names,
            request.body.minPrice,
            request.body.maxPrice,
            request.body.rating,
            request.body.search_name_term,
        ));
    response.end();
})