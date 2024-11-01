"use client";
import { ISale } from "@/types/sale";
import moment from "moment";
import React from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { getSalesStatusColor } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const Receipt = ({ receipt }: { receipt: ISale }) => {
  return (
    <div>
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6 text-sm relative">
          <div className="flex flex-row items-center justify-between">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                <p>Order details</p>
                <Badge variant={getSalesStatusColor(receipt?.status)}>
                  {receipt?.status}
                </Badge>
              </CardTitle>
            </div>
            <div className="">
              <div className="w-full flex-1"></div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-row items-center justify-between">
            <div>
              <div className="mb-2">
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="text-base ">
                  {" "}
                  {moment(receipt?.createdAt).isValid()
                    ? moment(receipt?.createdAt).format("DD/MM/YYYY hh:mm A")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Number</p>
                <p className="text-base ">#{receipt?.inoviceNumber}</p>
              </div>
            </div>
            <div>
              {receipt?.customerName && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500">Customer Name</p>
                  <p className="text-base ">{receipt?.customerName}</p>
                </div>
              )}

              {receipt?.customerPhone && (
                <div>
                  <p className="text-xs text-gray-500">Customer Phone</p>
                  <p className="text-base ">{receipt?.customerPhone}</p>
                </div>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt?.saleItems.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.sellingPrice}</TableCell>
                    <TableCell className="text-right">{item.amount}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="!border-b-0">
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
                <TableRow className="!border-b-0">
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
                <TableRow className="!border-b-0">
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">
                    GHS {receipt?.amount}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <div className="mt-12">
              {receipt?.cashTendered && (
                <div className="flex justify-between items-center">
                  <p>Cash Tendered</p>
                  <p>{receipt?.cashTendered}</p>
                </div>
              )}
              {receipt?.cashTendered && (
                <div className="flex justify-between items-center">
                  <p>Cash Tendered</p>
                  <p>{receipt?.cashTendered}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;
