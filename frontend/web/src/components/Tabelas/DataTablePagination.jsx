"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function DataTablePagination({ table, pageSizeOptions = [10, 20, 30, 40, 50], className, ...props }) {
  if (!table) return null;

  // Render a table-safe footer row (<tr><td>...) because this component is
  // intended to be used inside a <TableFooter> (i.e. inside a <tfoot>).
  // A <div> cannot be a direct child of <tfoot> and causes hydration/HTML errors.
  return (
    <tr {...props}>
      <td colSpan={table.getAllColumns().length}>
        <div
          className={cn(
            "flex w-full flex-row justify-between items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8 px-4",
            className
          )}
        >
          <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>

          <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap font-medium text-sm">Linhas por pág.</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-18 data-size:h-8">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center font-medium text-sm">
              Pág. {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                aria-label="Go to first page"
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft />
              </Button>

              <Button
                aria-label="Go to previous page"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>

              <Button
                aria-label="Go to next page"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>

              <Button
                aria-label="Go to last page"
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
