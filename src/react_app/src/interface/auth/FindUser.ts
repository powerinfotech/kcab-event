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
    password?: string;
    password_retry?: string;
}