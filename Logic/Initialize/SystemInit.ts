import * as fs from "fs";
import {Service} from "../Service/Service";

// const {Service} = require('../Service/Service')
// const {fs} = require('fs')

const service  = new Service();

const registerUsers = (users: any) => {
    //TODO: check for legal input
    users.forEach(function (val : any) {
        //console.log(val.email)
        service.performRegister(val.email,val.password,val.age)
    });
    console.log("done registering")
}

const addShops = (shops: any) => {
    //TODO: check for legal input
    shops.forEach(function (val:any){
        //FIXME: how do i get the user id ??
        service.addShop(0,val.name,val.description,val.string,val.bankInfo)
    })
}

const addManager = (managers : any ) => {
    //TODO
}

const addDiscounts = (discounts : any) => {

}

const initTables = () => {
    console.log('Starting...')

    //write to json file
    // const json = {
    //     users: [ { email: "example@example.com" , password: "123"}, { email: "example2@example.com" , password: "123456"}],
    //     shops: [ {name: "AllIsGood" , manager: "example@example.com"}]
    // }
    // const jsonString = JSON.stringify(json)
    // const fs = require('fs')
    // fs.writeFile('./users_example.json', jsonString, err => {
    //     if(err){
    //         console.log('Error writing',err)
    //     } else {
    //         //console.log('Successfully wrote')
    //     }
    // } );

    //read the json file
    fs.readFile('./users_example.json', 'utf8' ,
        (err:any,jString:any) => {
        if (err) {
            console.log('read failed', err)
            return
        }
        let  result  = JSON.parse(jString);
        let users = result.users
        registerUsers(users)

    })
}

initTables();