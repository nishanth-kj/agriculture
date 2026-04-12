"use client";

import { type ReactNode, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../EmptyState/EmptyState";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUp,
  ArrowDown,
  GripVertical,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  pageSize?: number;
  manualPagination?: boolean;
  totalRecords?: number;
  onPaginationChange?: (page: number, size: number) => void;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  loading = false,
  pageSize = 10,
  manualPagination = false,
  totalRecords,
  onPaginationChange,
}: DataTableProps<T>) {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPageSize, setDisplayedPageSize] = useState(pageSize);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => String(col.key))),
  );
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((col) => String(col.key)),
  );

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter((row) => {
      return columns.some((col) => {
        if (!col.searchable && col.searchable !== undefined) return false;
        const cellValue = String(
          (row as Record<string, unknown>)[String(col.key)] ?? "",
        ).toLowerCase();
        return cellValue.includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortColumn];
      const bVal = (b as Record<string, unknown>)[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const totalEntries = manualPagination ? (totalRecords ?? data.length) : sortedData.length;
  const totalPages = Math.ceil(totalEntries / displayedPageSize);
  
  const paginatedData = useMemo(() => {
    if (manualPagination) return data;
    const start = (currentPage - 1) * displayedPageSize;
    const end = start + displayedPageSize;
    return sortedData.slice(start, end);
  }, [sortedData, data, currentPage, displayedPageSize, manualPagination]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (manualPagination && onPaginationChange) {
      onPaginationChange(page, displayedPageSize);
    }
  }, [manualPagination, onPaginationChange, displayedPageSize]);

  const handlePageSizeChange = useCallback((size: number) => {
    setDisplayedPageSize(size);
    setCurrentPage(1);
    if (manualPagination && onPaginationChange) {
      onPaginationChange(1, size);
    }
  }, [manualPagination, onPaginationChange]);

  // Handle sort
  const handleSort = useCallback(
    (columnKey: string) => {
      if (sortColumn === columnKey) {
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else if (sortDirection === "desc") {
          setSortDirection(null);
          setSortColumn(null);
        }
      } else {
        setSortColumn(columnKey);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    },
    [sortColumn, sortDirection],
  );

  // Handle column drag
  const handleDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnKey: string) => {
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      return;
    }

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    if (draggedIndex > -1 && targetIndex > -1) {
      [newOrder[draggedIndex], newOrder[targetIndex]] = [
        newOrder[targetIndex],
        newOrder[draggedIndex],
      ];
      setColumnOrder(newOrder);
    }

    setDraggedColumn(null);
  };

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  // Get ordered and filtered columns
  const orderedColumns = columnOrder
    .map((key) => columns.find((col) => String(col.key) === key))
    .filter(
      (col): col is Column<T> =>
        col !== undefined && visibleColumns.has(String(col.key)),
    );

  if (loading) {
    return (
      <div className="w-full space-y-3 animate-pulse p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/50 bg-card p-4 overflow-hidden">
      {/* Filter Row */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search all columns..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-xs h-9 rounded-lg"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="flex-1" />

        {/* Column Visibility Toggle */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg shadow-sm hover:shadow-md transition-all"
              title="Toggle column visibility"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Show/Hide Columns
              </p>
              <div className="space-y-2">
                {columns.map((col) => (
                  <div
                    key={String(col.key)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`col-${String(col.key)}`}
                      checked={visibleColumns.has(String(col.key))}
                      onCheckedChange={() =>
                        toggleColumnVisibility(String(col.key))
                      }
                    />
                    <label
                      htmlFor={`col-${String(col.key)}`}
                      className="text-sm cursor-pointer flex-1 flex items-center gap-2"
                    >
                      {visibleColumns.has(String(col.key)) ? (
                        <Eye className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                      {col.header}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border/30">
        <Table>
          {/* Table Header with Column Controls */}
          <TableHeader className="bg-muted/40 border-b border-border/30">
            <TableRow className="hover:bg-transparent">
              {orderedColumns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  draggable
                  onDragStart={() => handleDragStart(String(col.key))}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(String(col.key))}
                  className={`font-semibold relative group cursor-move select-none transition-colors ${
                    draggedColumn === String(col.key)
                      ? "bg-primary/10"
                      : "hover:bg-muted/60"
                  } ${col.className ?? ""}`}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={() => {
                        if (col.sortable !== false) {
                          handleSort(String(col.key));
                        }
                      }}
                      disabled={col.sortable === false}
                      className={`flex items-center gap-1 font-semibold ${
                        col.sortable !== false
                          ? "cursor-pointer hover:text-foreground"
                          : "cursor-default"
                      } ${
                        sortColumn === String(col.key)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {col.header}
                      {sortColumn === String(col.key) &&
                        sortDirection === "asc" && (
                          <ArrowUp className="h-3 w-3" />
                        )}
                      {sortColumn === String(col.key) &&
                        sortDirection === "desc" && (
                          <ArrowDown className="h-3 w-3" />
                        )}
                    </button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={orderedColumns.length}
                  className="py-20 text-center"
                >
                  <EmptyState message={emptyMessage} />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  className="border-border/30 hover:bg-primary/5 transition-colors"
                >
                  {orderedColumns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className={`text-sm ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String(
                            (row as Record<string, unknown>)[String(col.key)] ??
                              "",
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer with Pagination */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Row Count Info */}
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {(currentPage - 1) * displayedPageSize + 1}
            </span>
            -
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * displayedPageSize, totalEntries)}
            </span>
            of
            <span className="font-semibold text-foreground">
              {totalEntries}
            </span>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={displayedPageSize.toString()}
              onValueChange={(value) => {
                handlePageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="w-16 h-8 text-xs rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 px-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Page
                <span className="font-semibold text-foreground mx-1">
                  {currentPage}
                </span>
                of
                <span className="font-semibold text-foreground mx-1">
                  {totalPages}
                </span>
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8 p-0 rounded-lg"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 w-8 p-0 rounded-lg"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
