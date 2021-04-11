import 'mocha';
import { expect, assert } from 'chai';
import {PasswordHandler} from "./PasswordHandler";
import {RegisterImpl} from "./Register";
import {LoginImpl} from "./Login";
import {StringPair} from "./StringPair";
import {UserImpl} from "./User";
import type = Mocha.utils.type;
import {ShopInventoryImpl} from "../Shop/ShopInventory";

describe('PasswordHandler tests', () => {
    it('should return a hashed password ', () => {
        let handler = PasswordHandler.getInstance();
        expect(handler.hash("password")).to.not.equal("password")
        expect(handler.isHashed(handler.hash("password"))).eq(true)
        expect(handler.isHashed("password")).eq(false)


    });
    it('given a hashed password should return true if its hashed or false if its not ', () => {
        let handler = PasswordHandler.getInstance();
        expect(handler.isHashed(handler.hash("password"))).eq(true)
    });
    it('given a password and hashed value verify if hashed value matches the password ', () => {
        let handler = PasswordHandler.getInstance();
        const hashed1 = handler.hash("123456");
        const hashed2 = handler.hash("123456");
        expect(handler.verify("123456",hashed1)).eq(true);
        expect(handler.verify("123456",hashed2)).eq(true);
        expect(handler.verify("1234567",hashed1)).eq(false);
        expect(handler.verify("12345",hashed2)).eq(false);
    });
});
describe('RegisterImpl tests', () => {
    it('Registering with invalid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev", "123456")).eq(false)
    });
    it('Registering with valid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev@gmail.com", "123456")).eq(true)
    });
    it('Registering with a user email which is already in use ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev1@gmail.com", "123456")).eq(true)
        expect(value.register("liorpev1@gmail.com", "123456")).eq(false)
    });
});




describe('LoginImpl tests', () => {
    it('Registering and trying to login ', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
            expect(user.user_email === "liorpev@gmail.com").eq(true)

    });
    it('Login without register', () => {
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev15@gmail.com", "123456"));
        expect(typeof user == "string").eq(true)
    });
    it('Register then login and try to login again(first time login) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev1@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev1@gmail.com", "123456");
        expect(typeof (log.login("liorpev1@gmail.com", "123456")) == "string").eq(true);
    });
    it('Register then login and logout then login again(already existing user) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev2@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev2@gmail.com", "123456");
        log.logout("liorpev2@gmail.com")
        const user = (log.login("liorpev2@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
            expect( user.user_email).eq("liorpev2@gmail.com");
    });
    it('Register then login and then logout ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev3@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev3@gmail.com", "123456");
        log.logout("liorpev3@gmail.com")
        const values = log.logged_users;
        expect(values.filter(element => element === "liorpev3@gmail.com").length == 0).eq(true);
    });
    it('Register then login and check if the user is in the logged users list ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev4@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev4@gmail.com", "123456");
        const values = log.logged_users;
        expect(values.filter(element => element === "liorpev4@gmail.com").length == 0).eq(false);
    });
});


describe('LoginImpl tests', () => {
    it('Registering login and add item to basket ', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        if(typeof user == "string")
            assert.fail()
        else
        {

        }

    });

});