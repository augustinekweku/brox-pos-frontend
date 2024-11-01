import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccessDenied() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Access Denied</CardTitle>
        <CardDescription>Please login to access this page</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/auth/login">
          <Button className="w-full">Login</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
