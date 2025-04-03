import React from "react";
import { useGetTransactionHistoryQuery } from "../redux/features/bankApi";
import { format } from "date-fns";
import { ShieldCheck, Filter, ChevronDown, ChevronRight } from "lucide-react";

const TransactionHistory = () => {
  const { data = [], error, isLoading } = useGetTransactionHistoryQuery();
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [isMobileView, setIsMobileView] = React.useState(false);

  // Check window size on component mount and window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gradient-to-b from-purple-600 to-blue-700 text-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      {/* Header with responsive padding and font size */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/20 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
          <ShieldCheck className="mr-2" size={isMobileView ? 20 : 24} />
          Transaction History
        </h2>
        
        {/* Filter toggle button for mobile */}
        <button 
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors self-end sm:self-auto"
        >
          <Filter size={16} className="mr-2" />
          Filters
          {isFiltersOpen ? (
            <ChevronDown size={16} className="ml-2" />
          ) : (
            <ChevronRight size={16} className="ml-2" />
          )}
        </button>
      </div>
      
      {/* Collapsible filters section */}
      {isFiltersOpen && (
        <div className="bg-white/10 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80 block">Date Range</label>
            <select className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom range</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white/80 block">Transaction Type</label>
            <select className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
              <option>Credit</option>
              <option>Debit</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white/80 block">Amount</label>
            <select className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm">
              <option>All</option>
              <option>₦0 - ₦1,000</option>
              <option>₦1,000 - ₦10,000</option>
              <option>₦10,000+</option>
            </select>
          </div>
          
          <div className="space-y-2 flex flex-col">
            <label className="text-sm text-white/80 block">Search</label>
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 p-4 mb-4 rounded-r">
          <p className="text-white">Error fetching transactions</p>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && data?.transactions?.length === 0 && (
        <div className="bg-white/10 rounded-xl p-8 text-center">
          <p className="text-white/80">No transactions found.</p>
        </div>
      )}

      {/* Desktop View - Table Format */}
      {!isLoading && !error && data?.transactions?.length > 0 && (
        <div className="hidden md:block overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Account</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.transactions.map((txn, index) => {
                  const isCredit = txn.receiverId.accountNumber === data?.userAccountNumber;
                  
                  return (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {format(new Date(txn.createdAt), "dd MMM yyyy, HH:mm")}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {isCredit ? txn.senderId.accountNumber : txn.receiverId.accountNumber}
                      </td>
                      <td className={`px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium ${isCredit ? "text-green-300" : "text-red-300"}`}>
                        {isCredit ? `+ ₦${txn.amount}` : `- ₦${txn.amount}`}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isCredit ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                        }`}>
                          {isCredit ? "Credit" : "Debit"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile View - Card Format */}
      {!isLoading && !error && data?.transactions?.length > 0 && (
        <div className="md:hidden space-y-4">
          {data.transactions.map((txn, index) => {
            const isCredit = txn.receiverId.accountNumber === data?.userAccountNumber;
            
            return (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:bg-white/20 transition-all"
              >
                <div className={`p-1 ${isCredit ? "bg-green-500" : "bg-red-500"}`}></div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-white/70">
                      {format(new Date(txn.createdAt), "dd MMM yyyy, HH:mm")}
                    </p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      isCredit ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {isCredit ? "Credit" : "Debit"}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-xs text-white/70">Account</p>
                    <p className="font-medium text-sm truncate">
                      {isCredit ? txn.senderId.accountNumber : txn.receiverId.accountNumber}
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <p className={`text-base sm:text-lg font-bold ${isCredit ? "text-green-300" : "text-red-300"}`}>
                      {isCredit ? `+ ₦${txn.amount}` : `- ₦${txn.amount}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Pagination for mobile */}
          <div className="flex justify-center items-center mt-6 space-x-1">
            <button className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="sr-only">Previous</span>
              <ChevronRight className="rotate-180" size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  page === 1 ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="sr-only">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Pagination for desktop */}
      {!isLoading && !error && data?.transactions?.length > 0 && (
        <div className="hidden md:flex justify-between items-center mt-6">
          <p className="text-sm text-white/70">
            Showing 1-{Math.min(10, data.transactions.length)} of {data.transactions.length} transactions
          </p>
          
          <div className="flex space-x-1">
            <button className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg flex items-center text-sm">
              <ChevronRight className="rotate-180 mr-1" size={16} />
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  page === 1 ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg flex items-center text-sm">
              Next
              <ChevronRight className="ml-1" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;