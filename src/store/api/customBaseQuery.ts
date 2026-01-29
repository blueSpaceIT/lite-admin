/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
} from "@reduxjs/toolkit/query";
import { setUser, signout } from "../slices/authSlice";
import type { RootState } from "../store";
import { baseQuery } from "./baseApi";

export const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/access-token/admin`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const refreshToken = await res.json();

    if (refreshToken?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(
        setUser({
          user,
          token: refreshToken.data.accessToken,
        }),
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(signout());
    }
  }

  return result;
};
