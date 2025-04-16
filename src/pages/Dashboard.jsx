import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCreateAccountMutation, 
  useGetAccountsQuery,
  logout 
} from '../redux/features/bankApi';
import { 
  CreditCard, 
  Plus, 
  LogOut, 
  ArrowRight,
  Wallet,
  Send,
  History,
  User,
  Bell,
  AlertTriangle,
  PieChart,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountType, setAccountType] = useState('savings');
  const [currency, setCurrency] = useState('NGN');
  const [accountName, setAccountName] = useState('');
  
  const { data, isLoading: isLoadingAccounts, error: accountsError, refetch } = useGetAccountsQuery();
  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();

  // Extract accounts array from the response
  const accounts = data?.accounts || [];
  const hasAccount = accounts.length > 0;

  // Check if the user is logged in
  const userName = localStorage.getItem('userName') || 'User';
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 
    ? `Good morning, ${userName}` 
    : currentTime < 17 
      ? `Good afternoon, ${userName}` 
      : `Good evening, ${userName}`;

  useEffect(() => {
    if (!isLoadingAccounts && !accountsError && accounts.length === 0) {
      setShowCreateAccount(true);
    }
  }, [data, accounts, accountsError, isLoadingAccounts]);

  const handleCreateAccount = async () => {
    try {
      // Validate account name
      if (!accountName.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Account Name Required',
          text: 'Please enter an account name.',
          showConfirmButton: true,
          confirmButtonColor: '#3b82f6',
        });
        return;
      }

      // Enforce single account
      if (accounts.length > 0) {
        Swal.fire({
          icon: 'info',
          title: 'Account Limit',
          text: 'You already have an active account.',
          showConfirmButton: true,
          confirmButtonColor: '#3b82f6',
        });
        setShowCreateAccount(false);
        return;
      }
      
      // Create account with default balance of 5,000
      const result = await createAccount({ 
        accountName: accountName.trim(),
        accountType: accountType || 'savings', 
        currency: currency || 'NGN',
        initialBalance: 5000 // Default balance
      }).unwrap();
      
      setShowCreateAccount(false);
      setAccountName(''); // Reset account name
      
      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your account has been created with a welcome bonus of 5,000!',
        showConfirmButton: false,
        timer: 3000,
        position: 'top-end',
        toast: true,
        background: '#22c55e',
        color: '#ffffff',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
      
      // Refetch accounts to update the list
      refetch();
    } catch (error) {
      // Show error notification
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to create account: ${error.message || 'Please try again.'}`,
        showConfirmButton: false,
        timer: 3000,
        position: 'top-end',
        toast: true,
        background: '#ef4444',
        color: '#ffffff',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  if (isLoadingAccounts) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex items-center justify-center space-x-3">
          <RefreshCw size={24} className="text-white animate-spin" />
          <div className="text-white">Loading your account...</div>
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md mx-auto text-white text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Account</h2>
          <p className="mb-6">{accountsError.message || 'Unable to load your account. Please try again.'}</p>
          <button 
            onClick={() => refetch()}
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-400 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative px-6 pt-8 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <span className="text-blue-400 mr-1">Ọ</span><span>wọ́</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
              <Bell size={18} className="text-white/80" />
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <LogOut size={18} className="text-white/80" />
            </button>
            <div className="w-10 h-10 bg-blue-500/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-6 pb-24">
        {/* Greeting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{greeting}</h2>
          <p className="text-white/60">Manage your finances with ease</p>
        </div>

        {/* Account Section */}
        {hasAccount ? (
          <div className="space-y-8">
            {/* Main Account Card */}
            <div className="bg-gradient-to-br from-blue-600/30 to-indigo-600/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
              
              <div className="flex justify-between items-start mb-8 relative">
                <div>
                  <p className="text-white/60 text-sm uppercase tracking-wider font-light">
                    {accounts[0]?.accountType} Account
                  </p>
                  <h3 className="text-xl font-medium mt-1">{accounts[0]?.accountName}</h3>
                  <p className="text-3xl font-bold mt-2">
                    {accounts[0]?.currency} {accounts[0]?.balance.toLocaleString()}
                  </p>
                  <p className="text-white/60 text-sm mt-2 font-mono tracking-wider">
                    **** **** **** {accounts[0]?.accountNumber?.slice(-4) || '1234'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CreditCard className="text-blue-400" size={24} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => navigate('/transfer')}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm 
                             hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                    <Send size={14} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-medium">Send</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm 
                             hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                    <History size={14} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-medium">History</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm 
                             hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                    <User size={14} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-medium">Profile</span>
                </button>
              </div>
            </div>

            {/* Activity & Insights Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Activity & Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center">
                      <History size={16} className="mr-2 text-blue-400" />
                      Recent Activity
                    </h4>
                    <button className="text-sm text-white/60 hover:text-white flex items-center">
                      View All <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Empty state or placeholder transactions */}
                    <div className="text-center py-6 text-white/40">
                      <BarChart3 size={24} className="mx-auto mb-2" />
                      <p>No recent transactions</p>
                    </div>
                  </div>
                </div>
                
                {/* Financial Insights */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center">
                      <PieChart size={16} className="mr-2 text-blue-400" />
                      Financial Insights
                    </h4>
                    <button className="text-sm text-white/60 hover:text-white flex items-center">
                      Details <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <PieChart size={14} className="text-blue-400" />
                        </div>
                        <span className="text-sm">Spending Analysis</span>
                      </div>
                      <ArrowUpRight size={14} className="text-white/60" />
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <ShieldCheck size={14} className="text-blue-400" />
                        </div>
                        <span className="text-sm">Security Settings</span>
                      </div>
                      <ArrowUpRight size={14} className="text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // No Account State
          <div className="flex justify-center items-center py-12">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet size={32} className="text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-3">Start Your Journey</h2>
              <p className="text-white/70 text-center mb-8">
                Create your first account and begin your financial journey with a welcome bonus of 5,000!
              </p>
              
              <button
                onClick={() => setShowCreateAccount(true)}
                className="bg-blue-500 text-white w-full font-medium py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all"
              >
                <Plus size={18} className="mr-2" />
                <span>Create Your Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Create Account Modal */}
        {showCreateAccount && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-indigo-950 to-violet-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Create Your Account</h2>
              
              <div className="space-y-5">
                {/* Account Name Field */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 
                             text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Account Type Field */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="checking">Checking Account</option>
                  </select>
                </div>

                {/* Currency Field */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  {accounts.length > 0 && (
                    <button
                      onClick={() => setShowCreateAccount(false)}
                      className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-white/70 
                               hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleCreateAccount}
                    disabled={isCreating}
                    className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg 
                             hover:bg-blue-400 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCreating ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;