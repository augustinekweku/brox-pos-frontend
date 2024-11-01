"use client";

import { SessionProvider as Provider } from "next-auth/react";
import { Session } from "next-auth";

interface AuthContextProps {
  readonly children: React.ReactNode;
  readonly session: Session | null;
}

export default function SessionProvider({
  children,
  session,
}: AuthContextProps) {
  return <Provider session={session}>{children}</Provider>;
}
