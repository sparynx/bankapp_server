import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, Shield, ChevronLeft,
  Eye, EyeOff, Check, AlertTriangle, Lock
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
  const [showActualPin, setShowActualPin] = useState(false);

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
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
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
      
      setPin('');
      setConfirmPin('');
      setShowSetPin(false);
      setSelectedAccount('');
      setPinError('');
      
      alert('PIN set successfully');
    } catch (error) {
      alert(error.data?.message || 'Failed to set PIN. Please try again.');
    }
  };

  if (isLoadingUser || isLoadingAccounts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (userError && userError.status !== 401) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
          <p>{userError.message || "There was an error loading your profile. Please try again later."}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
      <header className="p-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">My Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M47.1,-59.3C60.3,-50.4,69.7,-35.9,74.8,-19.9C79.9,-3.9,80.7,13.7,73.7,27.4C66.6,41.2,51.8,51.2,36.5,57.5C21.2,63.8,5.5,66.5,-11.4,67.1C-28.3,67.7,-46.3,66.2,-58.8,56.8C-71.3,47.4,-78.2,30.2,-79.9,12.4C-81.6,-5.4,-78.1,-23.8,-68.6,-37.8C-59,-51.9,-43.4,-61.7,-28.1,-69.3C-12.8,-76.9,2.2,-82.3,15.9,-78.7C29.7,-75.1,42.1,-62.5,47.1,-59.3Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="flex flex-col items-center mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-3xl font-bold">{`${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`}</span>
            </div>
            <h2 className="text-2xl font-bold">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h2>
            <p className="text-white/60 text-sm mt-1">Account Holder</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Mail size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Email</p>
                <p className="text-white">{user?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Phone</p>
                <p className="text-white">{user?.phone || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Calendar size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Member Since</p>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div className="flex-grow">
                <p className="text-white/60 text-xs">Transaction PIN</p>
                <p className="text-white">
                  {isLoadingPin ? 'Loading...' : currentAccountPin ? '••••' : 'Not set'}
                </p>
              </div>
              <button
                onClick={() => setShowSetPin(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm"
              >
                {currentAccountPin ? 'Change' : 'Set PIN'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {showSetPin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-gray-900 to-indigo-900 rounded-2xl p-6 w-full max-w-md border border-indigo-500/30">
            <div className="mb-6 flex items-center">
              <Lock size={24} className="text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Set Transaction PIN</h2>
            </div>
            
            <p className="text-white/70 mb-6">
              Create a 4-digit PIN that you will use to authorize your transactions.
              Keep this PIN private and secure.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Select Account
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
                        setPinError('');
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
                        if (pin === value) {
                          setPinError('');
                        }
                      }
                    }}
                    maxLength={4}
                    className="w-full bg-white/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              </div>

              {pinError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2">
                  <AlertTriangle size={18} className="text-red-400" />
                  <p className="text-red-200 text-sm">{pinError}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowSetPin(false);
                    setPin('');
                    setConfirmPin('');
                    setPinError('');
                    setSelectedAccount('');
                  }}
                  className="flex-1 px-4 py-3 border border-indigo-500/30 rounded-xl text-white/70 
                             hover:bg-indigo-600/20 transition-all hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetPin}
                  disabled={isSettingPin || pin.length !== 4 || confirmPin.length !== 4 || !selectedAccount}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl 
                             hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 
                             disabled:opacity-50 disabled:hover:scale-100
                             disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSettingPin ? (
                    <span>Setting PIN...</span>
                  ) : (
                    <>
                      <span>Set PIN</span>
                      <Check size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;