import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import LoadingIcon from "./loaders/LoadingIcon";

interface ICard {
  loading: boolean;
  title: string;
  amount: number;
  description: ReactNode;
}

const AnalyticsCard = ({ loading, title, amount, description }: ICard) => {
  return (
    <Card x-chunk="dashboard-05-chunk-1">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-medium">
          {loading ? <LoadingIcon /> : <p>GHS {amount ? amount : 0}</p>}
        </CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
    </Card>
  );
};

export default AnalyticsCard;
