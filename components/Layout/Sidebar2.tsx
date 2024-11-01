import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import MainNavLinks from "./MainNavLinks";
import Image from "next/image";
import { ActiveOrganization } from "../ActiveOrganization";
import { Separator } from "../ui/separator";
import UpgradeToPro from "../UpgradeToPro";

const Sidebar2 = () => {
  return (
    <div className="hidden border-r bg-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center  px-2 gap-3 lg:h-[70px] lg:px-4 ">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <Image
              src={"/images/logo-dark.png"}
              width={35}
              height={35}
              alt="Nanitech EXP"
            ></Image>
          </Link>
          <div>
            <ActiveOrganization />
          </div>
        </div>
        <Separator className="w-5/6 mx-auto" />
        <div className="flex-1 pt-3">
          <nav className="grid items-start text-sm font-medium ">
            <MainNavLinks />
          </nav>
        </div>
        <div className="mt-auto p-4">
          <UpgradeToPro />
        </div>
      </div>
    </div>
  );
};

export default Sidebar2;
