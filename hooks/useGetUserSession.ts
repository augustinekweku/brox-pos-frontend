import {
  userDetailsFromAuthType,
  userDetailsFromTokenType,
} from "@/types/user";
import { useSession } from "next-auth/react";

const useGetUserSession = () => {
  const session = useSession();
  //@ts-ignore
  const userDetailsFromTokenData = session?.data?.token
    ?.tokenData as userDetailsFromTokenType;
  const userDetailsFromAuth = session?.data?.user as userDetailsFromAuthType;

  return { ...userDetailsFromTokenData, ...userDetailsFromAuth };
};

export default useGetUserSession;
