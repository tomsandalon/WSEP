import 'mocha';
import {expect} from 'chai';
import {Action, ManagerPermissions} from "../../../Logic/ShopPersonnel/Permissions";

describe('Permissions test', () => {
    it('Create default permissions', () => {
        const p = new ManagerPermissions()
        expect(p.isAllowed(Action.AddItem)).to.be.false;
        expect(p.isAllowed(Action.GetStaffInfo)).to.be.true;
        expect(p.isAllowed(Action.ManagePolicies)).to.be.false;
        expect(p.isAllowed(Action.RemoveItem)).to.be.false;
        expect(p.isAllowed(Action.ViewShopHistory)).to.be.false;
    })
    it('Create with parameters', () => {
        let allowed: boolean[] = []
        allowed[Action.AddItem] = true
        allowed[Action.ViewShopHistory] = true
        allowed[Action.GetStaffInfo] = true
        allowed[Action.ManagePolicies] = true
        allowed[Action.RemoveItem] = true
        let p = new ManagerPermissions(allowed)

        expect(p.isAllowed(Action.AddItem)).to.be.true;
        expect(p.isAllowed(Action.GetStaffInfo)).to.be.true;
        expect(p.isAllowed(Action.ManagePolicies)).to.be.true;
        expect(p.isAllowed(Action.RemoveItem)).to.be.true;
        expect(p.isAllowed(Action.ViewShopHistory)).to.be.true;

        allowed[Action.AddItem] = false
        allowed[Action.ViewShopHistory] = true
        allowed[Action.GetStaffInfo] = true
        allowed[Action.ManagePolicies] = false
        allowed[Action.ViewShopHistory] = true

        p = new ManagerPermissions(allowed)
        expect(p.isAllowed(Action.AddItem)).to.be.false;
        expect(p.isAllowed(Action.GetStaffInfo)).to.be.true;
        expect(p.isAllowed(Action.ManagePolicies)).to.be.false;
        expect(p.isAllowed(Action.RemoveItem)).to.be.true;
        expect(p.isAllowed(Action.ViewShopHistory)).to.be.true;
    })
    it('test edit permissions', () => {
        let p = new ManagerPermissions()
        p.editPermission(Action.AddItem, true)
        p.editPermission(Action.GetStaffInfo, false)
        p.editPermission(Action.ViewShopHistory, false)
        expect(p.isAllowed(Action.AddItem)).to.be.true;
        expect(p.isAllowed(Action.GetStaffInfo)).to.be.false;
        expect(p.isAllowed(Action.ManagePolicies)).to.be.false;
        expect(p.isAllowed(Action.RemoveItem)).to.be.false;
        expect(p.isAllowed(Action.ViewShopHistory)).to.be.false;
    })
})