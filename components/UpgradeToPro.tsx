import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const UpgradeToPro = () => {
  return (
    <Card x-chunk="dashboard-02-chunk-0">
      <CardHeader className="p-2 md:p-4">
        <Link href="#" className="flex items-center gap-2 font-semibold mb-2">
          <Image
            src={"/images/logo-dark.png"}
            width={30}
            height={30}
            alt="Nanitech EXP"
          ></Image>
          <span className="">Nanitech EXP</span>
        </Link>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" className="w-full">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradeToPro;
