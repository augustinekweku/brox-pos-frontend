"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/store";
import { SalesPeriodTabFilter, SaleStatus } from "@/types/sale";
import AnalyticsCard from "@/components/AnalyticsCard";
import useGetSalesAnalytics from "@/hooks/useGetSalesAnalytics";
import PercentageLabelWithArow from "@/components/PercentageLabelWithArow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import clsx from "clsx";
import { SalesAnalyticsBarChart } from "@/components/SalesAnalyticsBarChart";
import BestSellingProductsTable from "@/components/tables/BestSellingProducts/BestSellingProductsTable";
import OrdersTable from "@/components/tables/OrdersTable/OrdersTable";

const analyticsChartTabs = [
  {
    id: SalesPeriodTabFilter["12-months"],
    label: "This year",
    isActive: true,
  },
  {
    id: SalesPeriodTabFilter["30-days"],
    label: "This Month",
    isActive: false,
  },
  {
    id: SalesPeriodTabFilter["7-days"],
    label: "This Week",
    isActive: false,
  },
  {
    id: SalesPeriodTabFilter["24-hours"],
    label: "Today",
    isActive: false,
  },
];

const InitialState = {
  tabs: analyticsChartTabs,
};

type State = typeof InitialState;

export default function Dashboard() {
  const route = useRouter();
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const [state, dispatch] = React.useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    InitialState
  );
  const activeTab =
    useSearchParams().get("activeTab") ?? ("12-months" as SalesPeriodTabFilter);
  const pathname = usePathname();
  const [
    getAnalytics,
    loadingAnalytics,
    salesAnalytics,
    errorForSalesAnalytics,
  ] = useGetSalesAnalytics({
    status: SaleStatus.PAID,
  });

  function isTabActive(tabId: string) {
    return tabId === activeTab;
  }

  function getAnalyticsTabChart(tabId: string) {
    const ANALYTICS_MAP = {
      [SalesPeriodTabFilter["12-months"]]: salesAnalytics?.salesPerMonthOfYear,
      [SalesPeriodTabFilter["30-days"]]: salesAnalytics?.salesPerWeekOfMonth,
      [SalesPeriodTabFilter["7-days"]]: salesAnalytics?.salesPerDayOfWeek,
      [SalesPeriodTabFilter["24-hours"]]: salesAnalytics?.salesPerHour,
    };
    return (
      ANALYTICS_MAP[tabId as keyof typeof ANALYTICS_MAP] ??
      salesAnalytics?.salesPerMonthOfYear
    );
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 ">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          loading={loadingAnalytics}
          title="Total Sales"
          amount={salesAnalytics?.totalSalesAmount!}
          description={""}
        />
        <AnalyticsCard
          loading={loadingAnalytics}
          title=" Today"
          amount={salesAnalytics?.totalSalesAmountForToday!}
          description={
            <div className="text-xs text-muted-foreground flex  items-center">
              {
                <PercentageLabelWithArow
                  number={
                    salesAnalytics?.percentageIncreaseOrDecreaseForToday ?? 0
                  }
                />
              }{" "}
              from yesterday
            </div>
          }
        />
        <AnalyticsCard
          loading={loadingAnalytics}
          title=" This Week"
          amount={salesAnalytics?.totalSalesAmountForThisWeek!}
          description={
            <div className="text-xs text-muted-foreground flex">
              {
                <PercentageLabelWithArow
                  number={
                    salesAnalytics?.percentageIncreaseOrDecreaseForThisWeek ?? 0
                  }
                />
              }{" "}
              from last week
            </div>
          }
        />

        <AnalyticsCard
          loading={loadingAnalytics}
          title=" This Month"
          amount={salesAnalytics?.totalSalesAmountForThisMonth!}
          description={
            <div className="text-xs text-muted-foreground flex">
              {
                <PercentageLabelWithArow
                  number={
                    salesAnalytics?.percentageIncreaseOrDecreaseForThisMonth ??
                    0
                  }
                />
              }{" "}
              from last month
            </div>
          }
        />
      </div>
      <div className="hidde">
        <Card className="overflow-hidden">
          <CardContent className="py-4">
            <h2 className=" text-lg mb-2 font-semibold">Sales Activity</h2>
            <div className="">
              <Tabs defaultValue="account" className="">
                <TabsList className="!bg-transparent w-full justify-start !p-0 border-b h-9">
                  {state.tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value="account"
                      className={clsx(
                        isTabActive(tab.id) && "border-b-primary !text-primary",
                        "border-b !bg-transparent h-9 rounded-none"
                      )}
                      onClick={() => {
                        route.push(
                          `
                            ${pathname}?activeTab=${tab.id}
                            `
                        );
                      }}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="account" className="my-4">
                  <SalesAnalyticsBarChart
                    period={activeTab as SalesPeriodTabFilter}
                    title=""
                    loading={loadingAnalytics}
                    data={getAnalyticsTabChart(activeTab)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidde">
        <BestSellingProductsTable />
      </div>
      <div>
        <OrdersTable />
      </div>
    </div>
  );
}
