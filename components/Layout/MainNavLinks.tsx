"use client";
import React, { ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users2,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CardStackIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Arrow } from "@radix-ui/react-popover";
const MainNavLinks = () => {
  const pathname = usePathname();

  const NavLinkIconMap = {
    "/dashboard": {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    "/dashboard/pos": {
      title: "POS",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    "/dashboard/products": {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
    },
    "/dashboard/categories": {
      title: "Categories",
      icon: <Package className="h-5 w-5" />,
    },
    "/dashboard/suppliers": {
      title: "Suppliers",
      icon: <CardStackIcon className="h-5 w-5" />,
    },
    "/dashboard/inventory": {
      title: "Inventory",
      icon: <CardStackIcon className="h-5 w-5" />,
    },
    "/dashboard/analytics": {
      title: "Analytics",
      icon: <LineChart className="h-5 w-5" />,
    },
  };

  function isLinkActive(route: string) {
    return pathname === route && pathname.startsWith(`${route}`);
  }
  return (
    <>
      {Object.keys(NavLinkIconMap).map((route) => {
        return (
          <div key={route} className="flex items-center mr-6 mb-1 gap-2">
            <div
              className={clsx(
                isLinkActive(route) ? "bg-blue-500 rounded-r-lg" : "",
                "w-1  h-5"
              )}
            ></div>
            <Link
              href={route}
              className={`${
                isLinkActive(route)
                  ? "bg-accent text-accent-foreground "
                  : "text-muted-foreground font-light"
              } mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 flex-1 justify-between ml-2`}
            >
              <div className="flex items-center gap-3 ">
                <div
                  className={
                    isLinkActive(route)
                      ? " text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {NavLinkIconMap[route as keyof typeof NavLinkIconMap].icon}
                </div>
                {NavLinkIconMap[route as keyof typeof NavLinkIconMap].title}
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default MainNavLinks;
