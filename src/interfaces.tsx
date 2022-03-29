export interface User {
    id?: string | number,
    username: string,
    email?: string,
    password: string,
    company?: string,
}

export interface Company {
    id: string,
    companyName: string,
    owner: string,
}

export interface Bug {
    bugId: string | number,
    bugName: string,
    type: string,
    description: string,
    status: string,
    priority: string,
    reporterId: string | number,
    assigneeId: string | number
}

export interface SetRefresh {
    cId?: number | null,
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