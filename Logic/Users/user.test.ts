import 'mocha';
import { expect, assert } from 'chai';
import {PasswordHandler} from "./PasswordHandler";
import {RegisterImpl} from "./Register";
import {LoginImpl} from "./Login";
import {StringPair} from "./StringPair";

describe('PasswordHandler tests', () => {
    it('should return a hashed password ', () => {
        let handler = PasswordHandler.getInstance();
        expect(handler.hash("password")).to.not.equal("password")
        expect(handler.isHashed(handler.hash("password"))).eq(true)
        let value:StringPair[] = []
        value.push(new StringPair("hihi","byebye"));
        let v:StringPair[] = value.filter(ele => "hihi" === ele.user_email)
        console.log(v);
        v[0].user_email = "rotem";
        console.log(value);

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
    it('Registering with invalid email format ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev@gmail.com", "123456")).eq(true)
    });
    it('Registering with a useremail which is already in use ', () => {
        let value = RegisterImpl.getInstance();
        expect(value.register("liorpev@gmail.com", "123456")).eq(true)
        expect(value.register("liorpev@gmail.com", "123456")).eq(false)
    });
});
describe('LoginImpl tests', () => {
    it('Registering and trying to login ', () => {
        let reg = RegisterImpl.getInstance();
        reg.register("liorpev@gmail.com","123456");
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        expect(user !== null&& user.user_email === "liorpev@gmail.com")

    });
    it('Login without register', () => {
        let log = LoginImpl.getInstance();
        const user = (log.login("liorpev@gmail.com", "123456"));
        expect(user).eq(null)
    });
    it('Register then login and try to login again(first time login) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev@gmail.com", "123456");
        expect(log.login("liorpev@gmail.com", "123456")).eq(null);
    });
    it('Register then login and logout then login again(already existing user) ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev@gmail.com", "123456");
        log.logout("liorpev@gmail.com")
        const user = (log.login("liorpev@gmail.com", "123456"));
        expect(user !== null && user.user_email).eq("liorpev@gmail.com");
    });
    it('Register then login and then logout ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev@gmail.com", "123456");
        log.logout("liorpev@gmail.com")
        const values = log.logged_users;
        expect(values.filter(element => element === "liorpev@gmail.com").length == 0).eq(true);
    });
    it('Register then login and check if the user is in the logged users list ', () => {
        let value = RegisterImpl.getInstance();
        value.register("liorpev@gmail.com", "123456");
        let log = LoginImpl.getInstance();
        log.login("liorpev@gmail.com", "123456");
        const values = log.logged_users;
        expect(values.filter(element => element === "liorpev@gmail.com").length == 0).eq(false);
    });
});