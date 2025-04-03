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
  ChevronRight
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
          confirmButtonColor: '#7c3aed',
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
          confirmButtonColor: '#7c3aed',
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
        background: '#22c55e',
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
      confirmButtonColor: '#7c3aed',
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
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex items-center justify-center space-x-3">
          <RefreshCw size={24} className="text-white animate-spin" />
          <div className="text-white">Loading your account...</div>
        </div>
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md mx-auto text-white text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Error Loading Account</h2>
          <p className="mb-6">{accountsError.message || 'Unable to load your account. Please try again.'}</p>
          <button 
            onClick={() => refetch()}
            className="bg-white text-indigo-900 font-semibold py-3 px-6 rounded-xl 
                     hover:bg-gray-100 transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
      {/* Header */}
      <header className="p-6">
        <div className="flex justify-between items-center mb-6">
          {/* <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white/60 text-sm font-light">{greeting}</h1>
              <p className="text-white font-bold text-lg">{userName}</p>
            </div>
          </div> */}
          <div className="flex items-center space-x-4">
  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
    <User size={20} className="text-white" />
  </div>
  <div>
    <h1 className="text-white/60 text-sm font-light">{greeting}</h1>
  </div>
</div>
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <LogOut size={20} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Account Section */}
        {hasAccount ? (
          <div className="space-y-6">
            {/* Main Account Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-lg rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M47.1,-59.3C60.3,-50.4,69.7,-35.9,74.8,-19.9C79.9,-3.9,80.7,13.7,73.7,27.4C66.6,41.2,51.8,51.2,36.5,57.5C21.2,63.8,5.5,66.5,-11.4,67.1C-28.3,67.7,-46.3,66.2,-58.8,56.8C-71.3,47.4,-78.2,30.2,-79.9,12.4C-81.6,-5.4,-78.1,-23.8,-68.6,-37.8C-59,-51.9,-43.4,-61.7,-28.1,-69.3C-12.8,-76.9,2.2,-82.3,15.9,-78.7C29.7,-75.1,42.1,-62.5,47.1,-59.3Z" transform="translate(100 100)" />
                </svg>
              </div>
              
              <div className="flex justify-between items-start mb-8 relative">
                <div>
                  <p className="text-white/60 text-sm uppercase tracking-wider font-light">
                    {accounts[0]?.accountName}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {accounts[0]?.currency} {accounts[0]?.balance.toLocaleString()}
                  </p>
                  <p className="text-white/60 text-sm mt-2 font-mono tracking-wider">
                    **** **** **** {accounts[0]?.accountNumber.slice(-4)}
                  </p>
                </div>
                <CreditCard className="text-white" size={28} />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/transfer')}
                  className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md 
                           hover:bg-white/15 transition-all hover:scale-105"
                >
                  <Send size={20} className="text-white mb-2" />
                  <span className="text-sm">Send</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md 
                           hover:bg-white/15 transition-all hover:scale-105"
                >
                  <History size={20} className="text-white mb-2" />
                  <span className="text-sm">History</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-md 
                           hover:bg-white/15 transition-all hover:scale-105"
                >
                  <User size={20} className="text-white mb-2" />
                  <span className="text-sm">Profile</span>
                </button>
              </div>
            </div>

            {/* Financial Insights Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart size={18} className="mr-2" />
                Financial Insights
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                      <Landmark size={16} className="text-green-400" />
                    </div>
                    <span>Savings Goal Progress</span>
                  </div>
                  <ChevronRight size={18} className="text-white/60" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                      <History size={16} className="text-blue-400" />
                    </div>
                    <span>Recent Transactions</span>
                  </div>
                  <ChevronRight size={18} className="text-white/60" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                      <PieChart size={16} className="text-purple-400" />
                    </div>
                    <span>Spending Analysis</span>
                  </div>
                  <ChevronRight size={18} className="text-white/60" />
                </div>
              </div>
            </div>
          </div>
        ) : 
        (
          // No Account State
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <Wallet size={48} className="text-white mx-auto mb-6" />
              <h2 className="text-white text-2xl font-bold mb-3">Start Your Journey</h2>
              <p className="text-white/60 mb-8">
                Create your account and begin your financial journey with us. You&apos;ll receive a welcome bonus of 5,000!
              </p>
              <button
                onClick={() => setShowCreateAccount(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl 
                         flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-purple-700 
                         transition-all hover:scale-105 w-full"
              >
                <Plus size={20} />
                <span>Create Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Create Account Modal */}
{/* Create Account Modal */}
    {showCreateAccount && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-b from-gray-900 to-indigo-900 rounded-2xl p-6 w-full max-w-md border border-indigo-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Create Your Account</h2>
          
          <div className="space-y-6">
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
                className="w-full bg-white/10 border border-indigo-500/30 rounded-xl px-4 py-3 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Account Type Field */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full bg-white/10 border border-indigo-500/30 rounded-xl px-4 py-3 
                         text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="savings">Savings Account</option>
                <option value="checking">Checking Account</option>
              </select>
            </div>

            {/* Currency Field */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white/10 border border-indigo-500/30 rounded-xl px-4 py-3 
                         text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="flex-1 px-4 py-3 border border-indigo-500/30 rounded-xl text-white/70 
                           hover:bg-indigo-600/20 transition-all hover:scale-105"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleCreateAccount}
                disabled={isCreating}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl 
                         hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 
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
  );
};

export default Dashboard;