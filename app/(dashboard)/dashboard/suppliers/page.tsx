"use client";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useReducer } from "react";
import useGetUserSession from "@/hooks/useGetUserSession";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SupplierType } from "@/types/supplier";
import { DataTable } from "@/components/DataTable";
import { useSuppliersTableColums } from "../../../../components/tables/SuppliersTable/Columns";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import DI from "@/di-container";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const InitialState = {
  editObj: {} as SupplierType | null,
  openDialog: false,
  openDeleteDialog: false,
  loading: false,
  searchString: "",
  pageNumber: 1,
  pageSize: 25,
  suppliers: [] as SupplierType[],
};

type State = typeof InitialState;
export default function SuppliersPage() {
  const user = useGetUserSession();
  const userFromRedux = useSelector(
    (state: RootState) => state.auth.userProfile
  );

  const [state, updateState] = useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    InitialState
  );

  const suppliersTableColumns = useSuppliersTableColums({
    onDelete(id) {
      const supplier = state.suppliers.find((s) => s._id === id);
      updateState({ editObj: supplier, openDeleteDialog: true });
    },
    onEdit(id) {
      const supplier = state.suppliers.find((s) => s._id === id);
      updateState({ editObj: supplier, openDialog: true });
    },
  });

  async function getSuppliers() {
    updateState({ loading: true });
    try {
      const res = await DI.supplierService.getSuppliersByOrganization({
        organizationId: userFromRedux?.activeOrganization,
        email: user.email,
        searchString: state.searchString,
        pageNumber: state.pageNumber,
        pageSize: state.pageSize || 25,
      });
      updateState({ loading: false, suppliers: res.data.results });
      return res;
    } catch (error) {
      console.log(error);
      updateState({ loading: false });
      toast.error("Error fetching suppliers");
    }
  }

  async function deleteCategory(id: string) {
    try {
      await DI.supplierService.deleteSupplier(id);
      toast.success("Supplier deleted");
      getSuppliers();
      updateState({ openDeleteDialog: false, editObj: null });
    } catch (error) {
      toast.error("Error deleting supplier");
      updateState({ openDeleteDialog: false, editObj: null });
    }
  }
  useEffect(() => {
    getSuppliers();
  }, []);
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div>
        <Modal
          open={state.openDialog}
          onClose={() => {
            updateState({ openDialog: false });
          }}
          center
        >
          <h2>Simple centered modal</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
            hendrerit risus, sed porttitor quam.
          </p>
        </Modal>
        <ConfirmDeleteModal
          open={state.openDeleteDialog}
          openOpenChange={() => {
            updateState({ openDeleteDialog: false, editObj: null });
          }}
          onConfirm={() => {
            !state.editObj?._id.toString() &&
              toast.error("No supplier to delete");
            state.editObj?._id.toString() &&
              deleteCategory(state.editObj?._id.toString());
          }}
          onCancel={() => {
            toast.error("Supplier not deleted");
            updateState({ openDeleteDialog: false, editObj: null });
          }}
          title="Delete Supplier"
          description="Are you sure you want to delete this supplier?"
        />

        <div className="flex items-center mb-3">
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                updateState({ openDialog: true, editObj: null });
              }}
              // size="sm"
              className="h-7 gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Supplier sdfd
              </span>
            </button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>
              Manage your product suppliers here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={suppliersTableColumns}
              data={state.suppliers}
              isLoading={state.loading}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
