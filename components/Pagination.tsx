import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Props = {
isLoading: boolean
page:number,
itemsPerPage: number,
totalItems: number,
totalPages: number,
setPage: (value: number) => void
}
const Pagination = ({
    isLoading,
    page, 
    itemsPerPage,
    totalItems,
    setPage,
    totalPages
}:  Props) => {
  return (
    <div className="bg-white dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between sm:px-6">
      <div className="flex-1 flex justify-between items-center">
        {!isLoading && (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Showing{" "}
            <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
