import React, { FC, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export interface PaginationProps {
  totalCount?: number;
  pageSize: number;
  currentPage: number;
  totalPages?: number | null;
  onPageChange?: (onPageChangeProps: {
    page: number;
    rowsPerPage: number;
  }) => void;
  loading?: boolean;
  hideArrowNavigation?: boolean;
}

const Paginate: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  loading,
  hideArrowNavigation,
}) => {
  function canSkipNext() {
    return currentPage < totalPages! - 1 && !hideArrowNavigation;
  }

  function canSkipPrevious() {
    return currentPage - 2 > 0 && !hideArrowNavigation;
  }

  useEffect(() => {
    canSkipNext();
    canSkipPrevious();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  const renderPagination = () => {
    const pageNumbers = [];

    if (totalPages) {
      for (let i = 1; i <= totalPages; i++) {
        //show only 5 pages
        if (i > currentPage + 2 || i < currentPage - 2) {
          continue;
        }
        pageNumbers.push(
          <PaginationItem
            key={i}
            className={`page-item ${Number(currentPage) === i ? "active" : ""}`}
          >
            <PaginationLink
              isActive={Number(currentPage) === i}
              onClick={() =>
                onPageChange?.({
                  page: i,
                  rowsPerPage: pageSize ? pageSize : 10,
                })
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return (
      <>
        {pageNumbers.length > 1 ? (
          <>
            {canSkipPrevious() ? (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage - 2 > 0) {
                      onPageChange?.({
                        page: currentPage - 2,
                        rowsPerPage: pageSize ? pageSize : 10,
                      });
                    }
                  }}
                />
              </PaginationItem>
            ) : null}
            {pageNumbers}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {canSkipNext() ? (
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages! + 1) {
                      onPageChange?.({
                        page: currentPage + 2,

                        rowsPerPage: pageSize ? pageSize : 10,
                      });
                    }
                  }}
                />
              </PaginationItem>
            ) : null}
          </>
        ) : null}
      </>
    );
  };

  return (
    <div className="">
      <Pagination>
        <PaginationContent>{renderPagination()}</PaginationContent>
      </Pagination>
    </div>
  );
};

export default Paginate;
