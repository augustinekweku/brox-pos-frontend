"use client";
import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  MinusSquare,
  PlusSquare,
  Search,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import useGetActiveProducts from "@/hooks/useGetActiveProducts";
import InnerRelativeLoader from "@/components/loaders/InnerRelativeLoader";
import Paginate from "@/components/Pagination";
import { RootState } from "@/store";
import { storeCartActions } from "@/store/cart-reducer";
import toast from "react-hot-toast";
import DI from "@/di-container";

const InitialState = {
  isLoading: false,
  invoiceNumber: "",
  isCreatingOrder: false,
};

type State = typeof InitialState;

export default function POS() {
  const user = useSelector((state: RootState) => state.auth.userProfile);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const route = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10");
  const cartRedux = useSelector((state: RootState) => state.cart);

  const [state, updateState] = React.useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    InitialState
  );

  const [
    getActiveProducts,
    isLoadingActiveProducts,
    activeProductsResponse,
    errorForGettingActiveProducts,
  ] = useGetActiveProducts({
    searchString: q ?? "",
    pageSize: pageSize ? pageSize : 10,
    pageNumber: page ? page : 1,
  });

  function isItemAlreadyInCart(productId: string) {
    return cartRedux.cart.some((item) => item.productId === productId);
  }

  function isTherePreviousPage() {
    return !!(page > 1);
  }

  async function createOrder() {
    try {
      updateState({ isCreatingOrder: true });
      const saleData = {
        organization: user.activeOrganization,
        orderNumber: state.invoiceNumber,
        inoviceNumber: state.invoiceNumber,
        createdBy: user._id,
        amount: cartRedux.cartTotal,
      };

      const saleItemsData = cartRedux.cart.map((item) => {
        return {
          product: item.productId!,
          quantity: item.quantity,
          amount: item.amount,
          name: item.name,
          sellingPrice: item.sellingPrice,
          orderInoviceNumber: state.invoiceNumber,
          organizationId: user.activeOrganization,
          saleItemNumber: item.productId!,
        };
      });
      const res = await DI.saleService.createSaleWithSaleItems(
        saleData,
        saleItemsData
      );

      if (res) {
        toast.success("Order created successfully");
        dispatch(storeCartActions.clearCart());
        route.push(`/dashboard/pos/order-details/${res.data._id}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      updateState({ isCreatingOrder: false });
    }
  }

  React.useEffect(() => {
    getActiveProducts();
  }, [q, page, pageSize]);

  //generate a unique orderInvoice  on UseEffect
  React.useEffect(() => {
    const orderInvoice = Math.floor(Math.random() * 1000000000);
    updateState({ invoiceNumber: orderInvoice.toString() });
  }, []);

  return (
    <div className="grid flex-1 items-start gap-4  md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid  lg:col-span-2">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardContent className="p-6 text-sm relative">
            {isLoadingActiveProducts && <InnerRelativeLoader />}
            <div className="flex flex-row items-center justify-between">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Select Item
                </CardTitle>
              </div>
              <div className="">
                <div className="w-full flex-1 mb-2">
                  <form>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        onChange={(e) => {
                          //submit an empty search string to get all products if search string is empty
                          if (e.target.value === "") {
                            route.push(
                              `/dashboard/pos?q=${e.target.value}&page=${page}&pageSize=${pageSize}`
                            );
                            return;
                          }
                          //return if length of search string is less than 3
                          if (e.target.value.length < 3) return;
                          route.push(
                            `/dashboard/pos?q=${e.target.value}&page=${page}&pageSize=${pageSize}`
                          );
                        }}
                        type="search"
                        placeholder="Search products..."
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 mt-4">
              {activeProductsResponse?.results?.map((product) => (
                <Card
                  key={product._id}
                  className=""
                  onClick={() => {
                    if (isItemAlreadyInCart(product._id)) {
                      toast.error("Item already in cart");
                      return;
                    }
                    dispatch(
                      storeCartActions.addToCart({
                        productId: product._id,
                        name: product.name,
                        quantity: 1,
                        amount: product.sellingPrice,
                        saleItemNumber: product._id,
                        organizationId: user.activeOrganization,
                        orderInoviceNumber: state.invoiceNumber,
                        sellingPrice: product.sellingPrice,
                        product: product._id,
                      })
                    );
                  }}
                >
                  <CardHeader className="pb-3">
                    <h4 className="font-bold">{product.name}</h4>
                    <h6 className="max-w-lg text-balance leading-relaxed">
                      GHS {product.sellingPrice}
                    </h6>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Separator className="my-4" />
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
            <div>
              <Button
                variant="outline"
                className=""
                disabled={!isTherePreviousPage()}
                onClick={() => {
                  route.push(
                    `/dashboard/pos?page=${page - 1}&pageSize=${pageSize}`
                  );
                }}
              >
                <ArrowLeft className="h-6 w-6" />
                Previous
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <Paginate
                hideArrowNavigation={true}
                currentPage={page}
                pageSize={pageSize}
                totalCount={activeProductsResponse.total}
                totalPages={activeProductsResponse.totalPages}
                onPageChange={(pageProps) => {
                  route.push(
                    `/dashboard/pos?page=${pageProps.page}&pageSize=${pageProps.rowsPerPage}`
                  );
                }}
              />
            </div>
            <div>
              <Button
                variant="outline"
                className=""
                disabled={!activeProductsResponse.isNext}
                onClick={() => {
                  route.push(
                    `/dashboard/pos?page=${page + 1}&pageSize=${pageSize}`
                  );
                }}
              >
                Next
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="">
        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className=" ">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-base justify-between">
                <p className="">Current Order #{state.invoiceNumber}</p>
                {cartRedux.cart.length ? (
                  <Button
                    variant={"link"}
                    className="p-0 text-xs underline text-red-700"
                    onClick={() => {
                      dispatch(storeCartActions.clearCart());
                    }}
                  >
                    Clear Cart
                  </Button>
                ) : null}
              </CardTitle>
              <CardDescription>A summary of your order</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              {cartRedux.cart.length ? (
                cartRedux.cart.map((cartItem) => (
                  <div className="" key={cartItem.productId}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-white p-1 rounded-sm">
                          x{cartItem.quantity}
                        </Badge>
                        <p>{cartItem.name}</p>
                      </div>
                      <h6 className="font-semibold">GHS {cartItem.amount}</h6>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={"link"}
                          className="p-0"
                          onClick={() => {
                            dispatch(
                              storeCartActions.subtractQuantity(cartItem)
                            );
                          }}
                        >
                          <MinusSquare className="h-6 w-6" />
                        </Button>
                        <p>{cartItem.quantity}</p>
                        <Button
                          variant={"link"}
                          className="p-0"
                          onClick={() => {
                            dispatch(storeCartActions.addQuantity(cartItem));
                          }}
                        >
                          <PlusSquare className="h-6 w-6" />
                        </Button>
                      </div>
                      <Button
                        variant={"link"}
                        className="p-0"
                        onClick={() => {
                          dispatch(storeCartActions.removeFromCart(cartItem));
                        }}
                      >
                        <Trash2Icon className="h-6 w-6 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items in cart</p>
              )}
            </div>
            <Separator className="my-4" />
            <div>
              <h5 className="font-semibold mb-2">Order Summary</h5>
              <div className="flex justify-between items-center mb-2">
                <p>{cartRedux.cartCount} Items(s)</p>
                <h6>GHS {cartRedux.cartTotal}</h6>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Total</p>
                <h6 className="font-semibold">GHS{cartRedux.cartTotal}</h6>
              </div>
              <Button
                isLoading={state.isCreatingOrder}
                disabled={!cartRedux.cart.length}
                className="w-full mt-2"
                onClick={createOrder}
              >
                Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
