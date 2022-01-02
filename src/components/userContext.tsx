import { useContext, createContext } from "react";

export type UserContent = {
    user: String | null,
    setUser: (c: String | null) => void,
}

export const UserContext = createContext<UserContent>({
    user: null,
    setUser: () => { },
});

export const useGlobalContext = () => useContext(UserContext);
