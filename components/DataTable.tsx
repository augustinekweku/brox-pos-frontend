"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | [];
  title?: string;
  paginationProps?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    onPageChange: (pageProps: { page: number; rowsPerPage: number }) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  isLoading,
  title,
  paginationProps,
}: DataTableProps<TData, TValue> & { isLoading: boolean }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      {title && (
        <div className="bg-white">
          <h2 className="text-lg font-semibold p-4">{title}</h2>
        </div>
      )}
      <Table className="w-full overflow-hidden">
        <TableHeader className="bg-[#EAECF0]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {!isLoading && (
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
        {isLoading && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      {paginationProps && (
        <div className="flex items-center p-2 lg:p-4">
          <TablePagination
            currentPage={paginationProps.currentPage}
            totalPages={paginationProps.totalPages}
            onPageChange={paginationProps.onPageChange}
            pageSize={paginationProps.pageSize}
          />
        </div>
      )}
    </div>
  );
}
