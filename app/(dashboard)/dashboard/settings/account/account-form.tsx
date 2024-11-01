"use client";
import UserProfileForm from "@/components/forms/UserProfileForm";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export function AccountForm() {
  const userFromRedux = useSelector((state: RootState) => state.auth);
  return (
    <>
      <UserProfileForm
        userFromStore={userFromRedux.userProfile}
        onSuccess={() => {}}
      />
    </>
  );
}
