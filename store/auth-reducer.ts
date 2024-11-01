import { Organization } from "@/types/organization";
import {
  TokenData,
  userDetailsFromTokenType,
  UserTokenData,
} from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type userProfileTokenData = { user: UserTokenData };

interface AuthState {
  userProfile: TokenData;
  organizations: Organization[];
  isUserReduxAuthenticated: boolean;
}



const initialState: AuthState = {
  userProfile: {} as TokenData,
  organizations: [],
  isUserReduxAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<TokenData>) => {
      state.userProfile = action.payload;
    },
    welcomeUser: (state) => {
      state.isUserReduxAuthenticated = true;
    },
    updateUserDetails: (
      state,
      action: PayloadAction<userDetailsFromTokenType>
    ) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    setCompanies: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    setActiveOrganizationInStore: (state, action: PayloadAction<string>) => {
      state.userProfile.activeOrganization = action.payload;
    },

    logoutFromStore: (state) => {
      state.userProfile = {} as TokenData;
      state.organizations = [];
      state.isUserReduxAuthenticated = false;
    },
  },
});

export const storeAuthActions = authSlice.actions;
export type AuthActions = typeof authSlice.actions;
export default authSlice.reducer;
