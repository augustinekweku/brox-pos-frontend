"use client";
import * as React from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useSelector } from "react-redux";
import {
  usePathname,
  useSearchParams,
  useParams,
  useRouter,
} from "next/navigation";
import InnerRelativeLoader from "@/components/loaders/InnerRelativeLoader";
import { RootState } from "@/store";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { PAYMENT_METHODS } from "@/constants";
import useGetSale from "@/hooks/useGetSale";
import moment from "moment";
import CashPaymentForm, {
  ICashPayment,
} from "@/components/forms/CashPaymentForm";
import { PaymentMethod, SaleStatus } from "@/types/sale";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSalesStatusColor } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import DI from "@/di-container";

enum views {
  PAYMENT_METHOD = "payment_method",
  PAYMENT_DETAILS = "payment_details",
  CASH_PAYMENT_DETAILS = "cash_payment_details",
  CHECK_STATUS = "check_status",
}

const InitialState = {
  isLoading: false,
  invoiceNumber: "",
  currentView: views.PAYMENT_METHOD,
  cashTendered: 0,
  customerName: "",
  customerPhoneNumber: "",
};

type State = typeof InitialState;

export default function OrderDetaials() {
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const pathname = usePathname();
  const route = useRouter();
  const params = useParams();
  const { id } = params;
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("paymentMethod") ?? "";
  const currentView =
    useSearchParams().get("currentView") ?? views.PAYMENT_METHOD;

  const cartRedux = useSelector((state: RootState) => state.cart);
  const [getSale, loadingSales, sale, errorForGettingSales] = useGetSale(
    id as string
  );

  const [state, updateState] = React.useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    InitialState
  );

  function excutePayment() {
    if (
      currentView === views.PAYMENT_METHOD &&
      paymentMethod.toString() === "cash"
    ) {
      route.push(
        `${pathname}?paymentMethod=${paymentMethod}&currentView=${views.CASH_PAYMENT_DETAILS}`,
        undefined
      );
    }
  }

  async function makePayment(values: ICashPayment) {
    if (sale?.amount && values.cashTendered < sale?.amount) {
      return alert("Cash tendered is less than the total amount");
    }
    try {
      updateState({ isLoading: true });
      const res = await DI.saleService.payForSale({
        saleId: sale?._id as string,
        saleData: {
          status: SaleStatus.PAID,
          paymentMethod: PaymentMethod.CASH,
          cashTendered: values.cashTendered,
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          note: values.note,
        },
      });
      toast.success("Payment successful");
      getSale();
    } catch (error) {
    } finally {
      updateState({ isLoading: false });
    }
  }

  const printSectionRef = React.useRef(null);
  const printResult = useReactToPrint({
    bodyClass: "printBody",
    content: () => printSectionRef.current,
    documentTitle: `${sale?.inoviceNumber}`,
  });

  React.useEffect(() => {
    if (sale?.status === SaleStatus.PAID) {
      route.push(`${pathname}?currentView=${views.CHECK_STATUS}`, undefined);
    }
  }, [loadingSales]);

  React.useEffect(() => {
    if (sale?.status === SaleStatus.PAID) {
      route.push(`${pathname}?currentView=${views.CHECK_STATUS}`, undefined);
    }
  }, [currentView]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
      {loadingSales && <InnerRelativeLoader />}

      <div className="grid  h-[calc(100vh_-_92px)] ">
        <Card
          className="overflow-scroll border-0 shadow-lg "
          ref={printSectionRef}
        >
          <CardContent className="p-6 text-sm relative">
            {state.isLoading && <InnerRelativeLoader />}
            <div className="flex flex-row items-center justify-between">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  <p>Order details</p>
                  <Badge variant={getSalesStatusColor(sale?.status)}>
                    {sale?.status}
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
                    {moment(sale?.createdAt).isValid()
                      ? moment(sale?.createdAt).format("DD/MM/YYYY hh:mm A")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Order Number</p>
                  <p className="text-base ">#{sale?.inoviceNumber}</p>
                </div>
              </div>
              <div>
                {sale?.customerName && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="text-base ">{sale?.customerName}</p>
                  </div>
                )}

                {sale?.customerPhone && (
                  <div>
                    <p className="text-xs text-gray-500">Customer Phone</p>
                    <p className="text-base ">{sale?.customerPhone}</p>
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
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale?.saleItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.sellingPrice}</TableCell>
                      <TableCell>{item.sellingPrice}</TableCell>
                      <TableCell>{item.sellingPrice}</TableCell>
                      <TableCell className="text-right">
                        {item.amount}
                      </TableCell>
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
                      GHS {sale?.amount}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <div className="mt-12">
                {sale?.cashTendered && (
                  <div className="flex justify-between items-center">
                    <p>Cash Tendered</p>
                    <p>{sale?.cashTendered}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-[calc(100vh_-_92px)] ">
        <Card className="overflow-hidden h-full flex justify-center items-center border-0 shadow-lg">
          <CardContent className="p-6 text-sm w-full">
            {currentView === views.PAYMENT_METHOD && (
              <div className="grid gap-3">
                {Object.keys(PAYMENT_METHODS).map((method) => (
                  <Card
                    key={method}
                    className="flex justify-between items-center px-5 py-4"
                    onClick={() => {
                      route.push(
                        `${pathname}?paymentMethod=${method}&currentView=${views.CASH_PAYMENT_DETAILS}`,
                        undefined
                      );
                      excutePayment();
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={method}
                        checked={paymentMethod === method}
                        disabled={
                          !PAYMENT_METHODS[
                            method as keyof typeof PAYMENT_METHODS
                          ].isActivated
                        }
                      />
                      <label
                        htmlFor={method}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {
                          PAYMENT_METHODS[
                            method as keyof typeof PAYMENT_METHODS
                          ].name
                        }
                      </label>
                    </div>

                    <div>
                      <Image
                        src={
                          PAYMENT_METHODS[
                            method as keyof typeof PAYMENT_METHODS
                          ].logo
                        }
                        width={50}
                        height={50}
                        alt={
                          PAYMENT_METHODS[
                            method as keyof typeof PAYMENT_METHODS
                          ].name
                        }
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {currentView === views.CASH_PAYMENT_DETAILS && (
              <div className="grid gap-3">
                <CashPaymentForm
                  isLoading={state.isLoading}
                  onSubmit={(values) => {
                    makePayment(values);
                  }}
                />
              </div>
            )}
            {currentView === views.CHECK_STATUS && (
              <div className="grid gap-3">
                <div className="flex items-center justify-center space-x-2 flex-col my-4">
                  <div className="mb-3">
                    <Image
                      src="/images/svg/check-circle.svg"
                      width={100}
                      height={100}
                      alt="Check Status"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium leading-none text-center mb-2">
                      Payment Successful
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      Payment has been successfully made
                    </p>

                    <Button
                      onClick={() => {
                        printResult();
                      }}
                      className="mt-4 w-full"
                    >
                      Download Receipt
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        route.push("/dashboard/pos");
                      }}
                      className="mt-4 w-full"
                    >
                      Go Home
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
