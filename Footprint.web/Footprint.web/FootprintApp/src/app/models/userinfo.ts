import { PermissionValues } from "./permission.model";

export class UserModel {

    constructor(id?: string, userName?: string, fullName?: string, email?: string, jobTitle?: string, phoneNumber?: string, roles?: string[]) {

        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }

    get friendlyName(): string {
        let name = this.fullName || this.userName;

        if (this.jobTitle)
            name = this.jobTitle + " " + name;

        return name;
    }

    public id: string;
    public userName: string;
    public fullName: string;
    public email: string;
    public jobTitle: string;
    public phoneNumber: string;
    public isEnabled: boolean;
    public isLockedOut: boolean;
    public roles: string[];
}



export interface IdToken {
    sub: string;
    name: string;
    fullname: string;
    jobtitle: string;
    email: string;
    phone: string;
    role: string | string[];
    permission: PermissionValues | PermissionValues[];
    configuration: string;
}


export interface LoginResponse {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
}