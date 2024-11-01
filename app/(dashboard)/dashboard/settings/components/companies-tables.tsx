"use client";
import { File, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useReducer } from "react";
import { Organization } from "@/types/organization";
import { AddCompanyModal } from "@/components/modals/AddCompanyModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import toast from "react-hot-toast";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import useGetUserSession from "@/hooks/useGetUserSession";
import { store } from "@/store";
import organizationService from "@/services/organizationService";
import Loader from "@/components/Loader";
import useGetCompanies from "@/hooks/useGetCompanies";

type State = {
  editObj: Organization | null;
  openDialog: boolean;
  openDeleteDialog: boolean;
  loading: boolean;
  searchString: string;
  pageNumber: number;
  pageSize: number | undefined;
  companies: Organization[];
};

export function CompaniesTable() {
  const [state, updateState] = useReducer(
    (state: State, newState: Partial<State>) => {
      return { ...state, ...newState };
    },
    {
      editObj: null,
      openDialog: false,
      openDeleteDialog: false,
      loading: false,
      searchString: "",
      pageNumber: 1,
      pageSize: 25,
      companies: [],
    }
  );
  const user = useGetUserSession();
  const { userProfile } = store.getState().auth;
  async function deleteCompany(id: string) {
    try {
      await organizationService.deleteOrganizationById(id);
      toast.success("Company deleted");
      getCompanies();
      updateState({ openDeleteDialog: false, editObj: null });
    } catch (error) {
      toast.error("Error deleting company");
      updateState({ openDeleteDialog: false, editObj: null });
    }
  }
  async function setCompanyActive(companyId: string) {
    !user._id.toString() && toast.error("No user found");
    try {
      await organizationService.setOrganizationAsActive(user._id, companyId);
      toast.success("Company set as active");
      getCompanies();
      updateState({ openDeleteDialog: false, editObj: null });
    } catch (error: any) {
      toast.error(error.message);
      updateState({ openDeleteDialog: false, editObj: null });
    }
  }
  function isCompanyActive(companyId: string) {
    return userProfile.activeOrganization === companyId;
  }
  const [
    getCompanies,
    isLoadingCompanies,
    companiesResponse,
    errorForGettingCompanies,
  ] = useGetCompanies({
    organizationId: userProfile.activeOrganization,
    searchString: state.searchString,
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
  });

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    isCompanyActive(userProfile.activeOrganization);
  }, [userProfile.activeOrganization]);

  return (
    <>
      <AddCompanyModal
        openOpenChange={() => {
          updateState({ openDialog: false });
        }}
        editObj={state.editObj}
        open={state.openDialog}
        onSuccess={() => {
          getCompanies();
        }}
      />
      <ConfirmDeleteModal
        open={state.openDeleteDialog}
        openOpenChange={() => {
          updateState({ openDeleteDialog: false, editObj: null });
        }}
        onConfirm={() => {
          !state.editObj?._id.toString() && toast.error("No company to delete");
          state.editObj?._id.toString() &&
            deleteCompany(state.editObj?._id.toString());
        }}
        onCancel={() => {
          toast.error("Company not deleted");
          updateState({ openDeleteDialog: false, editObj: null });
        }}
        title="Delete Company"
        description="Are you sure you want to delete this company?"
      />
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList className="hidden">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 gap-1"
              onClick={() => updateState({ openDialog: true, editObj: null })}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Company
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Manage your companies</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCompanies && <Loader />}
              {!isLoadingCompanies && (
                <>
                  {companiesResponse?.results?.length &&
                    companiesResponse?.results?.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Address
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Phone Number
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Created at
                            </TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companiesResponse.results.map((company) => (
                            <TableRow key={company._id.toString()}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                    <Avatar>
                                      <AvatarImage src={company.logo} />
                                      <AvatarFallback>
                                        {company.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <span>{company.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    isCompanyActive(company._id.toString())
                                      ? "active"
                                      : "inactive"
                                  }
                                >
                                  {isCompanyActive(company._id.toString())
                                    ? "Active"
                                    : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{company.description}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {company.address}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {company.phone}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {moment(company.createdAt).isValid()
                                  ? moment(company.createdAt).format(
                                      "DD/MM/YYYY hh:mm A"
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateState({
                                          editObj: company,
                                          openDialog: true,
                                        })
                                      }
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCompanyActive(
                                          company._id.toString()
                                        );
                                      }}
                                    >
                                      Set as Active
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateState({
                                          editObj: company,
                                          openDeleteDialog: true,
                                        })
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  {companiesResponse?.results.length === 0 && (
                    <div className="flex items-center flex-col justify-center h-32">
                      <File className="h-20 w-20 text-gray-400 mb-3" />
                      <p className="text-base text-gray-400 ml-2">
                        No companiesResponse.results found
                      </p>

                      <p>
                        You need to add a company to start managing your
                        companiesResponse.results
                      </p>

                      <Button
                        size="sm"
                        className=" gap-1 my-2 py-4"
                        onClick={() =>
                          updateState({ openDialog: true, editObj: null })
                        }
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Company
                        </span>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
