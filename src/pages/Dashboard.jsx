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
  Landmark,
  RefreshCw,
  ChevronRight,
  Activity,
  BarChart3,
  DollarSign,
  Settings
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

  // Debug logging
  useEffect(() => {
    console.log('Raw data:', data);
    console.log('Extracted accounts:', accounts);
    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
    }
    
    // If user has no account, show create account modal
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
          confirmButtonColor: '#6366f1',
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
          confirmButtonColor: '#6366f1',
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
      
      console.log('Account created:', result);
      
      setShowCreateAccount(false);
      setAccountName(''); // Reset account name
      
      // Show success notification using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your account has been created with a welcome bonus of 5,000!',
        showConfirmButton: false,
        timer: 3000,
        position: 'top-end',
        toast: true,
        background: '#10b981',
        color: '#ffffff',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
      
      // Refetch accounts to update the list
      refetch();
    } catch (error) {
      console.error('Failed to create account:', error);
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
      confirmButtonColor: '#6366f1',
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
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 flex items-center justify-center space-x-3">
          <RefreshCw size={24} className="text-indigo-400 animate-spin" />
          <div className="text-white font-medium">Loading your account...</div>
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto text-white text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Account</h2>
          <p className="mb-6 text-gray-300">{accountsError.message || 'Unable to load your account. Please try again.'}</p>
          <button 
            onClick={() => refetch()}
            className="bg-indigo-600 text-white font-medium py-3 px-6 rounded-xl 
                     hover:bg-indigo-700 transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 h-full w-full fixed overflow-auto">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/20 pointer-events-none"></div>
      
      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-16 md:w-20 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col items-center py-8 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-10">
          <Wallet size={20} className="text-white" />
        </div>
        
        <div className="flex-1 flex flex-col items-center space-y-6">
          <button className="w-12 h-12 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 flex items-center justify-center text-indigo-300 hover:text-white transition-all">
            <DollarSign size={20} />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <Activity size={20} />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <BarChart3 size={20} />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <Settings size={20} />
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* Main Content */}
      <div className="ml-16 md:ml-20">
        {/* Header */}
        <header className="p-6 sticky top-0 z-10 backdrop-blur-md bg-slate-900/50 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-white text-lg font-medium">{greeting}</h1>
              <p className="text-gray-400 text-sm">Welcome to your personal finance dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Bell size={20} />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-8 pb-24">
          {hasAccount ? (
            <div className="space-y-8">
              {/* Main Account Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-1 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 backdrop-blur-lg rounded-xl p-6 text-white relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
                  <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
                  
                  <div className="flex justify-between items-start mb-10 relative">
                    <div>
                      <p className="text-white/60 text-sm uppercase tracking-wider">
                        {accounts[0]?.accountName}
                      </p>
                      <p className="text-4xl font-bold mt-2">
                        {accounts[0]?.currency} {accounts[0]?.balance.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <p className="text-white/60 text-sm font-mono tracking-wider">
                          **** **** **** {accounts[0]?.accountNumber.slice(-4)}
                        </p>
                        <div className="flex items-center ml-3 bg-white/10 px-2 py-1 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                          <span className="text-xs text-white/80">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                      <CreditCard className="text-white" size={24} />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => navigate('/transfer')}
                      className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md 
                               hover:bg-white/20 transition-all hover:scale-105"
                    >
                      <Send size={22} className="text-white mb-2" />
                      <span className="text-sm font-medium">Send</span>
                    </button>
                    <button
                      onClick={() => navigate('/history')}
                      className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md 
                               hover:bg-white/20 transition-all hover:scale-105"
                    >
                      <History size={22} className="text-white mb-2" />
                      <span className="text-sm font-medium">History</span>
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md 
                               hover:bg-white/20 transition-all hover:scale-105"
                    >
                      <User size={22} className="text-white mb-2" />
                      <span className="text-sm font-medium">Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Insights Card */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/10 hover:border-indigo-500/30 transition-all">
                  <h2 className="text-lg font-semibold mb-4 flex items-center text-indigo-200">
                    <PieChart size={18} className="mr-2" />
                    Financial Insights
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <Landmark size={16} className="text-green-300" />
                        </div>
                        <span className="text-sm font-medium">Savings Goal Progress</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-300" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <History size={16} className="text-blue-300" />
                        </div>
                        <span className="text-sm font-medium">Recent Transactions</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-300" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-indigo-500/10 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                          <PieChart size={16} className="text-purple-300" />
                        </div>
                        <span className="text-sm font-medium">Spending Analysis</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-300" />
                    </div>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/10 hover:border-indigo-500/30 transition-all">
                  <h2 className="text-lg font-semibold mb-4 flex items-center text-indigo-200">
                    <Activity size={18} className="mr-2" />
                    Activity Summary
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-sm">Income</span>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-sm">Expenses</span>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <button className="w-full mt-4 py-2 bg-white/10 rounded-xl text-sm font-medium text-indigo-200 hover:bg-indigo-500/20 transition-all">
                      View Detailed Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // No Account State
            <div className="flex items-center justify-center h-screen">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-white/10 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet size={32} className="text-white" />
                </div>
                
                <h2 className="text-white text-2xl font-bold mb-3 text-center">Start Your Journey</h2>
                <p className="text-gray-300 mb-8 text-center">
                  Create your account and begin your financial journey with us. You'll receive a welcome bonus of 5,000!
                </p>
                
                <button
                  onClick={() => setShowCreateAccount(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl 
                           flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 
                           transition-all hover:scale-105 w-full"
                >
                  <Plus size={20} />
                  <span>Create Account</span>
                </button>
              </div>
            </div>
          )}

          {/* Create Account Modal */}
          {showCreateAccount && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-8 w-full max-w-md border border-indigo-500/30 shadow-xl shadow-indigo-900/20">
                <h2 className="text-2xl font-bold text-white mb-6">Create Your Account</h2>
                
                <div className="space-y-6">
                  {/* Account Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Enter account name"
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-xl px-4 py-3 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  {/* Account Type Field */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">
                      Select Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-xl px-4 py-3 
                               text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="savings">Savings Account</option>
                      <option value="checking">Checking Account</option>
                    </select>
                  </div>

                  {/* Currency Field */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-200 mb-2">
                      Select Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-xl px-4 py-3 
                               text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    {accounts.length > 0 && (
                      <button
                        onClick={() => setShowCreateAccount(false)}
                        className="flex-1 px-4 py-3 border border-indigo-500/30 rounded-xl text-gray-300 
                                 hover:bg-indigo-600/20 transition-all hover:scale-105"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={handleCreateAccount}
                      disabled={isCreating}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl 
                               hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-105 
                               disabled:opacity-50 disabled:hover:scale-100
                               disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isCreating ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw size={20} className="animate-spin" />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight size={20} />
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
    </div>
  );
};

export default Dashboard;