"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useGetOrders from "@/hooks/useGetOrders";
import { RootState } from "@/store";
import { SalesPeriod, SaleStatus } from "@/types/sale";
import LoadingIcon from "@/components/loaders/LoadingIcon";
import useGetSalesAnalytics from "@/hooks/useGetSalesAnalytics";
import OrdersTable from "@/components/tables/OrdersTable/OrdersTable";

export default function Dashboard() {
  const route = useRouter();
  const user = useSelector((state: RootState) => state.auth.userProfile);

  const [
    getSalesMadeThisWeek,
    loadingSalesMadeThisWeek,
    salesMadeThisWeek,
    errorForSalesMadeThisWeek,
  ] = useGetOrders({
    email: user.email,
    organizationId: user.activeOrganization,
    period: SalesPeriod.THIS_WEEK,
    status: SaleStatus.PAID,
  });
  const [
    getSalesMadeThisMonth,
    isGettingSalesMadeThisMonth,
    salesMadeThisMonth,
    errorForSalesMadeThisMonth,
  ] = useGetOrders({
    email: user.email,
    organizationId: user.activeOrganization,
    period: SalesPeriod.THIS_MONTH,
    status: SaleStatus.PAID,
  });
  const [
    getSalesMadeToday,
    loadingSalesMadeToday,
    salesMadeToday,
    errorForSalesMadeToday,
  ] = useGetOrders({
    email: user.email,
    organizationId: user.activeOrganization,
    period: SalesPeriod.TODAY,
    status: SaleStatus.PAID,
  });
  const [
    getAnalytics,
    loadingAnalytics,
    salesAnalytics,
    errorForSalesAnalytics,
  ] = useGetSalesAnalytics({
    status: SaleStatus.PAID,
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:c" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Your Orders</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Orders Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => {
                  route.push("/dashboard/pos");
                }}
              >
                Create New Order
              </Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Today</CardDescription>
              <CardTitle className="text-4xl">
                {loadingSalesMadeToday ? (
                  <LoadingIcon />
                ) : (
                  <p>
                    GHS{" "}
                    {salesMadeToday?.totalSalesAmount
                      ? salesMadeToday?.totalSalesAmount
                      : 0}
                  </p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">
                {" "}
                {loadingSalesMadeThisWeek ? (
                  <LoadingIcon />
                ) : (
                  <p>
                    GHS{" "}
                    {salesMadeThisWeek?.totalSalesAmount
                      ? salesMadeThisWeek?.totalSalesAmount
                      : 0}
                  </p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">
                {" "}
                {isGettingSalesMadeThisMonth ? (
                  <LoadingIcon />
                ) : (
                  <p>
                    GHS{" "}
                    {salesMadeThisMonth?.totalSalesAmount
                      ? salesMadeThisMonth?.totalSalesAmount
                      : 0}
                  </p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <div>
          <OrdersTable />
        </div>
      </div>
    </main>
  );
}
