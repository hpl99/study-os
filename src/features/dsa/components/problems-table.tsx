"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, Star, Trash2 } from "lucide-react";
import { UserProblem } from "../types";
import { toggleBookmark, deleteProblem } from "../actions";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";

interface ProblemsTableProps {
  data: UserProblem[];
}

export function ProblemsTable({ data }: ProblemsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);

  const columns: ColumnDef<UserProblem>[] = [
    {
      accessorKey: "title",
      header: "Problem",
      cell: ({ row }) => (
        <a href={row.original.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-primary transition-colors">
          {row.getValue("title")}
          <ExternalLink className="w-3 h-3 text-muted-foreground" />
        </a>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficulty") as string;
        return (
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
            difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" :
            difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
            "bg-red-500/10 text-red-500"
          }`}>
            {difficulty}
          </span>
        );
      }
    },
    {
      accessorKey: "topic_tags",
      header: "Topics",
      cell: ({ row }) => {
        const tags = row.getValue("topic_tags") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">{tag}</span>
            ))}
            {tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{tags.length - 2}</span>}
          </div>
        );
      }
    },
    {
      accessorKey: "solved_at",
      header: "Solved On",
      cell: ({ row }) => {
        const dateStr = row.getValue("solved_at") as string;
        return <span className="text-sm text-muted-foreground">{dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : '-'}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const problem = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-yellow-500"
              onClick={() => toggleBookmark(problem.id, problem.is_bookmarked)}
            >
              <Star className={`w-4 h-4 ${problem.is_bookmarked ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-red-500"
              onClick={() => {
                if (confirm("Delete this record?")) deleteProblem(problem.id);
              }}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
      </div>
      
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/10">
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-white/10 hover:bg-white/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No problems found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-white/10 bg-white/5"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-white/10 bg-white/5"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
