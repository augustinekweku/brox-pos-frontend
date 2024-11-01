"use client";
import { store } from "@/store";
import { storeAuthActions } from "@/store/auth-reducer";
import {
  Token,
  TokenData,
  userDetailsFromTokenType,
  UserTokenData,
} from "@/types/user";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { GenericDialog } from "./modals/GenericDialog";
import { ActiveOrganization } from "./ActiveOrganization";
import AddCompanyForm from "./forms/AddCompanyForm";
import useGetCompanies from "@/hooks/useGetCompanies";
import { Button } from "./ui/button";
import { PowerIcon, PowerOff } from "lucide-react";
import DI from "@/di-container";

const InitialState = {
  showActiveOrganizationPrompt: false,
};

type IState = typeof InitialState;

const ReduxUserStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();
  const dispatch = useDispatch();
  const hasUserBeenAllowedEntry =
    store.getState().auth.isUserReduxAuthenticated;
  const activeOrganization =
    store.getState().auth?.userProfile?.activeOrganization;
  const organizations = store.getState().auth?.organizations;

  const [state, updateState] = useReducer(
    (state: IState, newState: Partial<IState>) => {
      return { ...state, ...newState };
    },
    InitialState
  );

  useEffect(() => {
    if (hasUserBeenAllowedEntry && status === "authenticated") {
      return;
    }
    const sessionData = data as Session & {
      token: { user: TokenData };
    };
    const tokenData = sessionData?.token?.user as TokenData;
    const dataFromSession = data as Session & {
      token: Token;
    };
    console.log("tokenData", tokenData);
    dispatch(storeAuthActions.setUserProfile(tokenData));
    dispatch(storeAuthActions.welcomeUser());
  }, [hasUserBeenAllowedEntry]);

  const [
    getCompanies,
    isLoadingCompanies,
    companiesResponse,
    errorForGettingCompanies,
  ] = useGetCompanies({});

  function shouldShowActiveOrganizationPrompt() {
    updateState({
      showActiveOrganizationPrompt:
        (!activeOrganization || organizations.length === 0) &&
        store.getState().auth.isUserReduxAuthenticated &&
        status === "authenticated",
    });
  }

  useEffect(() => {
    shouldShowActiveOrganizationPrompt();
  }, [activeOrganization, isLoadingCompanies]);

  return (
    <div>
      <>
        {state.showActiveOrganizationPrompt && !isLoadingCompanies && (
          <GenericDialog
            description=""
            open={state.showActiveOrganizationPrompt}
            hideHeader
            onOpenChange={() => {}}
          >
            <div>
              {organizations.length === 0 ? (
                <div>
                  <h3 className="font-semibold mb-2">
                    You have not created an organization yet. <br /> Please
                    create one to continue
                  </h3>
                  <AddCompanyForm
                    editObj={null}
                    onSuccess={() => {
                      getCompanies();
                    }}
                  />
                </div>
              ) : (
                <div className="my-6 flex justify-center flex-col items-center">
                  <h3 className="font-semibold mb-3">
                    No active organization selected
                  </h3>
                  <ActiveOrganization
                    onSuccess={() => {
                      shouldShowActiveOrganizationPrompt();
                    }}
                  />
                </div>
              )}
              <div className="mt-8 flex justify-center">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    DI.authService.logoutUser();
                  }}
                  className="text-rose-800 border-red-800 text-xs px-2 py-0 h-8"
                >
                  Logout &nbsp;
                  <PowerIcon className="text-red-800 h-3" />
                </Button>
              </div>
            </div>
          </GenericDialog>
        )}
        {children}
      </>
    </div>
  );
};

export default ReduxUserStateProvider;
