import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { COOKIE_KEY } from "../../constants";

import { RootState, store } from "../../store";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

import { AuthActions } from "@/store/auth-reducer";
import {
  getOrCreateUserParams,
  updateUserDetailsParams,
  User,
} from "@/types/user";
import { fetchData } from "../factory";
import { ApiResponse } from "@/types";
import { signOut } from "next-auth/react";

export default class AuthService {
  constructor(
    private store: ToolkitStore<RootState>,
    private authActions: AuthActions
  ) {}
  BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  async getOrCreateUser(payload: getOrCreateUserParams): Promise<any> {
    try {
      const responseData = await fetchData<ApiResponse<User>>({
        endpoint: `${this.BASE_URL}/users/fetch-or-create`,
        method: "POST",
        payload,
      });
      return responseData.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateUser(payload: updateUserDetailsParams): Promise<any> {
    try {
      const responseData = await fetchData<ApiResponse<any>>({
        endpoint: `${this.BASE_URL}/users/update-user`,
        method: "PATCH",
        payload,
      });
      //update user details in redux store
      store.dispatch({
        type: "auth/updateUserDetails",
        payload: responseData.data,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async logoutUser() {
    //dispatch logout action from redux
    store.dispatch({
      type: "auth/logoutFromStore",
    });
    //signout from next-auth
    signOut();
  }

  isAuthTokenValid(accessToken: string) {
    // TODO: make an API call to validate cookie
    if (accessToken.length > 40) {
      // this.authRepository.verifyToken(accessToken)
      return true;
    }

    return false;
  }

  haveUserToken() {
    return !!getCookie(COOKIE_KEY);
  }
}
