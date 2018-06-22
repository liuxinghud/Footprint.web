export class User {

    constructor(id?: string, userName?: string, fullName?: string, jobTitle?: string, phoneNumber?: string, roles?: string[]) {

        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }
    public id: string;
    public userName: string;
    public fullName: string;
    public jobTitle: string;
    public phoneNumber: string;
    public isEnabled: boolean;
    public isLockedOut: boolean;
    public roles: string[];
}
