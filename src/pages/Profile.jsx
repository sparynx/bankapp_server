import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, Shield, ChevronLeft,
  Eye, EyeOff, Check, AlertTriangle, Lock, Loader, ArrowLeft
} from 'lucide-react';
import { 
  useSetTransactionPinMutation,
  useGetUserDetailsQuery,
  useGetAccountsQuery,
  useGetTransactionPinQuery 
} from '../redux/features/bankApi';

const Profile = () => {
  const navigate = useNavigate();
  const [showSetPin, setShowSetPin] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [currentAccountPin, setCurrentAccountPin] = useState(null);
  const [pinStep, setPinStep] = useState(1); // 1: select account, 2: enter pin

  const queryOptions = {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: false
  };

  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useGetUserDetailsQuery(undefined, queryOptions);

  const { 
    data: accountsData, 
    isLoading: isLoadingAccounts,
    error: accountsError 
  } = useGetAccountsQuery(undefined, queryOptions);

  const {
    data: pinData,
    isLoading: isLoadingPin
  } = useGetTransactionPinQuery(selectedAccount, {
    skip: !selectedAccount
  });

  const accounts = Array.isArray(accountsData?.accounts) 
    ? accountsData.accounts 
    : Array.isArray(accountsData) 
      ? accountsData 
      : [];

  const [setTransactionPin, { isLoading: isSettingPin }] = useSetTransactionPinMutation();

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const firstAccount = accounts[0].accountNumber;
      setSelectedAccount(firstAccount);
    }
  }, [accounts]);

  useEffect(() => {
    if (pinData?.pin) {
      setCurrentAccountPin(pinData.pin);
    }
  }, [pinData]);

  useEffect(() => {
    if (user?.hasPin) {
      localStorage.setItem('hasPin', 'true');
    }
  }, [user?.hasPin]);

  useEffect(() => {
    const handleAuthError = (error) => {
      if (error?.status === 401) {
        const toastId = 'session-expired';
        
        // Using a more graceful notification approach
        const notification = document.getElementById(toastId);
        if (!notification) {
          const toast = document.createElement('div');
          toast.id = toastId;
          toast.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in';
          toast.innerHTML = `
            <div class="flex items-center space-x-2">
              <AlertTriangle size={18} />
              <p>Session expired. Please log in again.</p>
            </div>
          `;
          document.body.appendChild(toast);
          
          setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => {
              document.body.removeChild(toast);
              localStorage.removeItem('token');
              navigate('/login');
            }, 300);
          }, 3000);
        }
      }
    };

    if (userError) handleAuthError(userError);
    if (accountsError) handleAuthError(accountsError);
  }, [userError, accountsError, navigate]);

  const handleSetPin = async () => {
    if (pin.length !== 4) {
      setPinError('PIN must be 4 digits');
      return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      setPinError('PIN must contain only numbers');
      return;
    }
    
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    if (!selectedAccount) {
      setPinError('Please select an account');
      return;
    }
    
    try {
      await setTransactionPin({ 
        pin,
        accountNumber: selectedAccount
      }).unwrap();
      
      localStorage.setItem('hasPin', 'true');
      
      // Show success animation
      setPinStep(3); // Success state

      setTimeout(() => {
        setPin('');
        setConfirmPin('');
        setShowSetPin(false);
        setPinError('');
        setPinStep(1);
      }, 1500);
      
    } catch (error) {
      setPinError(error.data?.message || 'Failed to set PIN. Please try again.');
    }
  };

  const resetPinFlow = () => {
    setShowSetPin(false);
    setPin('');
    setConfirmPin('');
    setPinError('');
    setSelectedAccount('');
    setPinStep(1);
  };
  
  const nextStep = () => {
    if (pinStep === 1) {
      if (!selectedAccount) {
        setPinError('Please select an account');
        return;
      }
      setPinError('');
      setPinStep(2);
    }
  };

  const prevStep = () => {
    if (pinStep === 2) {
      setPinStep(1);
      setPinError('');
    }
  };

  // Loading skeleton UI
  if (isLoadingUser || isLoadingAccounts) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6 absolute top-0 left-0">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-lg mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-white/10 rounded-full animate-pulse mb-4"></div>
            <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
          </div>
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-32 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (userError && userError.status !== 401) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center p-4 absolute top-0 left-0">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-red-300" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Unable to Load Profile</h2>
          <p className="text-white/70 mb-6">{userError.message || "We encountered an issue while loading your profile. Please try again later."}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white/10 hover:bg-white/15 transition-all rounded-xl text-white font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 absolute top-0 left-0 flex flex-col">
      {/* Header */}
      <header className="p-6 sticky top-0 z-10 backdrop-blur-md bg-indigo-900/50">
        <div className="flex items-center space-x-4 max-w-lg mx-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/15 transition-all"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">My Profile</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4 max-w-lg flex-grow">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.1,-59.3C60.3,-50.4,69.7,-35.9,74.8,-19.9C79.9,-3.9,80.7,13.7,73.7,27.4C66.6,41.2,51.8,51.2,36.5,57.5C21.2,63.8,5.5,66.5,-11.4,67.1C-28.3,67.7,-46.3,66.2,-58.8,56.8C-71.3,47.4,-78.2,30.2,-79.9,12.4C-81.6,-5.4,-78.1,-23.8,-68.6,-37.8C-59,-51.9,-43.4,-61.7,-28.1,-69.3C-12.8,-76.9,2.2,-82.3,15.9,-78.7C29.7,-75.1,42.1,-62.5,47.1,-59.3Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          {/* Profile header */}
          <div className="flex flex-col items-center mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white text-3xl font-bold">{`${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`}</span>
            </div>
            <h2 className="text-2xl font-bold">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h2>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <p className="text-white/60 text-sm">Active Account Holder</p>
            </div>
          </div>

          {/* Profile details */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Mail size={18} className="text-white" />
              </div>
              <div className="flex-grow">
                <p className="text-white/60 text-xs uppercase tracking-wider">Email</p>
                <p className="text-white font-medium">{user?.email || 'N/A'}</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <div className="flex-grow">
                <p className="text-white/60 text-xs uppercase tracking-wider">Phone</p>
                <p className="text-white font-medium">{user?.phone || 'Not set'}</p>
              </div>
              {!user?.phone && (
                <button className="text-xs px-3 py-1 bg-white/10 rounded-lg hover:bg-white/15 transition-all">
                  Add
                </button>
              )}
            </div>
            
            {/* Member Since */}
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Calendar size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Member Since</p>
                <p className="text-white font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Transaction PIN */}
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div className="flex-grow">
                <p className="text-white/60 text-xs uppercase tracking-wider">Transaction PIN</p>
                <div className="flex items-center">
                  {isLoadingPin ? (
                    <div className="flex items-center">
                      <Loader size={14} className="text-white/60 animate-spin mr-2" />
                      <span className="text-white/60 text-sm">Checking...</span>
                    </div>
                  ) : currentAccountPin ? (
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-white/60"></div>
                        ))}
                      </div>
                      <p className="text-white font-medium">Set</p>
                    </div>
                  ) : (
                    <p className="text-white/60">Not set</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowSetPin(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
              >
                {currentAccountPin ? 'Change' : 'Set PIN'}
              </button>
            </div>
          </div>

          {/* Account security section */}
          <div className="mt-8">
            <h3 className="text-white/80 text-sm font-medium mb-4">SECURITY OPTIONS</h3>
            <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock size={18} className="text-white/80" />
                  <span className="text-white">Change Password</span>
                </div>
                <ChevronLeft size={18} className="text-white/60 transform rotate-180" />
              </div>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <div className="mt-6 mb-12">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="w-full p-4 border border-white/10 rounded-xl text-white/70 hover:bg-white/5 transition-all"
          >
            Log Out
          </button>
        </div>
      </main>

      {/* PIN Modal */}
      {showSetPin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className="bg-gradient-to-b from-gray-900 to-indigo-900 rounded-2xl p-6 w-full max-w-md border border-indigo-500/30 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin setup step 1: Select account */}
            {pinStep === 1 && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock size={24} className="text-purple-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">Select Account</h2>
                  </div>
                  <button 
                    onClick={resetPinFlow}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <p className="text-white/70 mb-6">
                  First, choose the account for which you want to set up a transaction PIN.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Account
                    </label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full bg-white/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account.id || account._id} value={account.accountNumber}>
                          {account.accountType} - {account.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  {pinError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2 animate-fade-in">
                      <AlertTriangle size={18} className="text-red-400" />
                      <p className="text-red-200 text-sm">{pinError}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={resetPinFlow}
                      className="flex-1 px-4 py-3 border border-indigo-500/30 rounded-xl text-white/70 
                                hover:bg-indigo-600/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!selectedAccount}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl 
                                hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 
                                disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Pin setup step 2: Enter PIN */}
            {pinStep === 2 && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={prevStep}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all mr-3"
                    >
                      <ArrowLeft size={16} className="text-white" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">Create PIN</h2>
                  </div>
                  <button 
                    onClick={resetPinFlow}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <p className="text-white/70 mb-6">
                  Create a 4-digit PIN that you will use to authorize your transactions.
                  Keep this PIN private and secure.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Enter PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        value={pin}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,4}$/.test(value)) {
                            setPin(value);
                          }
                        }}
                        maxLength={4}
                        className="w-full bg-white/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter 4 digit PIN"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`w-16 h-1 rounded ${pin.length > i ? 'bg-indigo-500' : 'bg-white/20'}`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Confirm PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPin ? "text" : "password"}
                        value={confirmPin}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,4}$/.test(value)) {
                            setConfirmPin(value);
                          }
                        }}
                        maxLength={4}
                        className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                  ${confirmPin && pin !== confirmPin ? 'border-red-500/70' : 'border-indigo-500/30'}`}
                        placeholder="Confirm 4 digit PIN"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showConfirmPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`w-16 h-1 rounded ${
                            confirmPin.length > i 
                              ? confirmPin.length === 4 && pin === confirmPin 
                                ? 'bg-green-500' 
                                : confirmPin.length === 4 
                                  ? 'bg-red-500' 
                                  : 'bg-indigo-500' 
                              : 'bg-white/20'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {pinError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2 animate-fade-in">
                      <AlertTriangle size={18} className="text-red-400" />
                      <p className="text-red-200 text-sm">{pinError}</p>
                    </div>
                  )}

                  {confirmPin && pin && confirmPin.length === 4 && pin === confirmPin && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center space-x-2 animate-fade-in">
                      <Check size={18} className="text-green-400" />
                      <p className="text-green-200 text-sm">PINs match!</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 px-4 py-3 border border-indigo-500/30 rounded-xl text-white/70 
                               hover:bg-indigo-600/20 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSetPin}
                      disabled={isSettingPin || pin.length !== 4 || confirmPin.length !== 4 || pin !== confirmPin}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl 
                               hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 
                               disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSettingPin ? (
                        <div className="flex items-center space-x-2">
                          <Loader size={18} className="animate-spin" />
                          <span>Setting PIN...</span>
                        </div>
                      ) : (
                        <>
                          <span>Set PIN</span>
                          <Check size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Pin setup step 3: Success */}
            {pinStep === 3 && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <Check size={36} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">PIN Set Successfully!</h2>
                <p className="text-white/70 text-center mb-6">
                  Your transaction PIN has been set and is ready to use.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;