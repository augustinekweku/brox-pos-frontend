"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SalesPer, SalesPeriodTabFilter } from "@/types/sale";
import moment from "moment";
import { getWeekNumberInMonth } from "@/helpers";
import LoadingIcon from "./loaders/LoadingIcon";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  value: {
    label: "Sales",
    color: "text-primary",
  },
} satisfies ChartConfig;

interface IChart {
  title: string;
  data: SalesPer[] | undefined;
  loading: boolean;
  period: SalesPeriodTabFilter;
}
export function SalesAnalyticsBarChart({
  title,
  loading,
  data,
  period,
}: IChart) {
  function formatLabel(label: Date) {
    switch (period) {
      case SalesPeriodTabFilter["12-months"]:
        return moment(label).format("MMM");
      case SalesPeriodTabFilter["30-days"]:
        // return week number in the month
        return "Week " + getWeekNumberInMonth(label);
      case SalesPeriodTabFilter["7-days"]:
        return moment(label).format("ddd");
      case SalesPeriodTabFilter["24-hours"]:
        return moment(label).format("HH:mm");
      default:
        return moment(label).format("MMM");
    }
  }
  return (
    <Card>
      {loading ? (
        <CardContent>
          <div className="flex justify-center items-center h-[300px]">
            <LoadingIcon customClass="h-5 w-5" />
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={6}
                axisLine={false}
                tickFormatter={(value) => formatLabel(value as Date)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" fill="#155EEF" radius={8} width={20}>
                <LabelList
                  position="top"
                  offset={12}
                  className="bg-primary"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
