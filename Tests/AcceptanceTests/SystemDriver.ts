import {System} from "./System";
import {ProxySystem} from "./ProxySystem";
import {AdapterSystem} from "./AdapterSystem";
import {SystemImpl} from "../../Logic/System";

export class SystemDriver{
    public static getSystem(reset? : boolean): System{
        const adapter: AdapterSystem | undefined = new AdapterSystem(SystemImpl.getInstance(reset));
        // const adapter: AdapterSystem | undefined = undefined;
        return new ProxySystem(adapter);
    }
}