import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { TAdmin } from "../../types";

type TAuthState = {
    user: TAdmin | null;
    token: string | null;
};

const initialState: TAuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
        },
        signout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, signout } = authSlice.actions;

export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth?.token;
export const useCurrentUser = (state: RootState) => state.auth?.user;
