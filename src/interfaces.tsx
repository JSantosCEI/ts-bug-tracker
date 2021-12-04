import React from "react";
export interface User {
    id: string | number,
    username: string,
    email: string,
    password: string
}

export interface Company {
    id: string,
    companyName: string,
    owner: string,
    members: Array<string>
}
export interface SetRefresh {
    refresh: boolean,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

export interface Check {
    message: string,
    doThis: () => void,
    idTag: string
}

export interface LoginProps {
    newUser?: boolean,
    expired?: boolean,
}