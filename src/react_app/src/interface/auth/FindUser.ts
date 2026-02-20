export interface getId{
    userId: string;
}

export interface findUserInfo{
    userName:string;
    hpNo:string;
    userId?:string;
    confirmPassword?:string;
    newPassword?:string;
}

export interface ChangePassword {
    userSeq: number;
    userId: string;
    passwd?: string;
    password_retry?: string;
}