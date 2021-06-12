import {ProxySystem} from "./ProxySystem";
import {AdapterSystem} from "./AdapterSystem";
import {System, SystemImpl} from "../../Logic/Domain/System";

export class SystemDriver{
    public static async getSystem(reset?: boolean): Promise<System> {
        const adapter: AdapterSystem = new AdapterSystem(SystemImpl.getInstance(reset));
        const result = new ProxySystem(adapter);
        if (reset) await result.init()
        return result
    }
}