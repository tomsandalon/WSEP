import {Permissions} from "./Permissions";

export interface Manager {
    user_email: string
    permissions: Permissions
    appointer_user_email: string //TODO delete if not used
}