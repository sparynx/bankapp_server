import React, { useState, useEffect, useRef } from 'react';
import { 
  useCreateTransactionMutation,
  useVerifyAccountQuery,
  useGetAccountsQuery
} from '../redux/features/bankApi';
import { 
  Loader2, 
  Send, 
  User, 
  ChevronRight,
  KeyRound,
  CheckCircle2,
  Info,
  Copy,
  Share2,
  ArrowLeft,
  X,
  Wallet,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import gsap from 'gsap';

// Custom Naira icon component
const NairaIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M4 5h16M4 9h16M4 15h16M4 19h16M15 5v14M9 5v14" />
  </svg>
);

const TransferPage = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [verificationTimeout, setVerificationTimeout] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showPinNotSetWarning, setShowPinNotSetWarning] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionReceipt, setTransactionReceipt] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: accountsData, isLoading: accountsLoading } = useGetAccountsQuery();
  const accounts = accountsData?.accounts || [];

  const receiptRef = useRef(null);
  const transferFormRef = useRef(null);
  const pageRef = useRef(null);
  const accountsDropdownRef = useRef(null);

  useEffect(() => {
    gsap.context(() => {
      gsap.from(transferFormRef.current, {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: "power3.out"
      });
    }, transferFormRef);

    if (receiptRef.current && showReceipt) {
      gsap.from(receiptRef.current, {
        duration: 0.5,
        opacity: 0,
        scale: 0.9,
        ease: "back.out(1.7)"
      });
    }
  }, [showReceipt]);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTo(0, 0);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountsDropdownRef.current && !accountsDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: verifiedAccount, isLoading: verifying, error: verificationError } = useVerifyAccountQuery(
    receiverAccount, 
    { skip: !receiverAccount || receiverAccount.length < 10 }
  );
  const [createTransaction, { isLoading: transferring, error: transferError }] = useCreateTransactionMutation();

  useEffect(() => {
    if (selectedAccount) {
      const account = accounts.find(acc => acc.accountNumber === selectedAccount);
      if (account && !account.isPinSet) {
        setShowPinNotSetWarning(true);
      } else {
        setShowPinNotSetWarning(false);
      }
    }
  }, [selectedAccount, accounts]);

  const validatePin = (pin) => {
    if (!pin) return 'PIN is required';
    if (pin.length !== 4) return 'PIN must be 4 digits';
    if (!/^\d+$/.test(pin)) return 'PIN must contain only numbers';
    return null;
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setFormErrors({ ...formErrors, pin: validatePin(value) });
    }
  };

  const handleReceiverAccountChange = (e) => {
    const value = e.target.value;
    setReceiverAccount(value);
    
    if (verificationTimeout) {
      clearTimeout(verificationTimeout);
    }

    if (value.length >= 10) {
      setVerificationTimeout(setTimeout(() => {
        // Verification will happen automatically due to the query hook
      }, 500));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (!value || parseFloat(value) <= 0) {
        setFormErrors({ ...formErrors, amount: 'Please enter a valid amount' });
      } else {
        const { amount, ...restErrors } = formErrors;
        setFormErrors(restErrors);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedAccount) errors.selectedAccount = 'Please select an account';
    if (!receiverAccount) errors.receiverAccount = 'Receiver account is required';
    if (!amount || parseFloat(amount) <= 0) errors.amount = 'Please enter a valid amount';
    const pinError = validatePin(pin);
    if (pinError) errors.pin = pinError; 

    const selectedAccountDetails = accounts.find(acc => acc.accountNumber === selectedAccount);
    if (selectedAccountDetails && !selectedAccountDetails.isPinSet) {
      errors.pin = 'You need to set a transaction PIN for this account first';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateTransactionReference = () => {
    return 'TRF' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await createTransaction({
        senderAccountNumber: selectedAccount,
        receiverAccountNumber: receiverAccount,
        amount: parseFloat(amount),
        transactionPin: pin
      }).unwrap();

      // Generate receipt data
      const transactionRef = generateTransactionReference();
      const senderDetails = accounts.find(acc => acc.accountNumber === selectedAccount);
      
      setTransactionReceipt({
        reference: transactionRef,
        amount: parseFloat(amount),
        currency: senderDetails?.currency || '₦',
        senderName: senderDetails?.accountName || 'Account Holder',
        senderAccount: selectedAccount,
        receiverName: verifiedAccount?.account?.accountName || 'Recipient',
        receiverAccount: receiverAccount,
        timestamp: new Date().toISOString(),
        status: 'Successful'
      });

      setShowReceipt(true);
    } catch (err) {
      console.error("Transfer error:", err);
      if (err.status === 401 || (err.data?.message?.includes('PIN'))) {
        setFormErrors({ ...formErrors, pin: err.data?.message || 'Invalid PIN' });
      } else if (err.status === 400 && err.data?.message?.includes('PIN not set')) {
        setShowPinNotSetWarning(true);
        setFormErrors({ ...formErrors, pin: 'Transaction PIN not set. Please set your PIN first.' });
      }
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceiverAccount('');
    setAmount('');
    setPin('');
    setFormErrors({});
  };

  const handleCopyReference = () => {
    if (transactionReceipt) {
      navigator.clipboard.writeText(transactionReceipt.reference);
      alert('Reference copied to clipboard');
    }
  };

  const toggleAccountsDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectAccount = (accountNumber) => {
    setSelectedAccount(accountNumber);
    setIsDropdownOpen(false);
  };

  const selectedAccountDetails = accounts.find(acc => acc.accountNumber === selectedAccount);

  // Transaction Receipt Component
  const TransactionReceipt = () => {
    if (!transactionReceipt) return null;
  
    const handleShare = async () => {
      const receiptData = {
        title: 'Transfer Receipt',
        text: `Transfer of ${transactionReceipt.currency}${parseFloat(transactionReceipt.amount).toLocaleString()} to ${transactionReceipt.receiverName}\nReference: ${transactionReceipt.reference}`,
        url: window.location.href
      };
  
      try {
        if (navigator.share) {
          await navigator.share(receiptData);
        } else {
          const text = `${receiptData.text}\n${receiptData.url}`;
          await navigator.clipboard.writeText(text);
          alert('Receipt details copied to clipboard!');
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4" ref={receiptRef}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm my-8 overflow-hidden scale-100 animate-scaleIn">
          {/* Success Header */}
          <div className="p-8 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
            <button
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
              onClick={handleCloseReceipt}
            >
              <X className="w-5 h-5" />
            </button>
  
            <div className="flex flex-col items-center relative">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-4">
                <div className="bg-white rounded-full p-2">
                  <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Transfer Successful</h2>
              <div className="flex items-baseline text-white">
                <span className="text-xl font-medium">{transactionReceipt.currency}</span>
                <span className="text-4xl font-bold ml-1">{parseFloat(transactionReceipt.amount).toLocaleString()}</span>
              </div>
              <p className="text-white/80 mt-2 text-xs">
                {new Date(transactionReceipt.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
  
          {/* Receipt Details */}
          <div className="p-6 space-y-4">
            {/* Reference Number */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-2xl">
              <span className="text-gray-600 text-sm">Reference</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-sm font-medium">{transactionReceipt.reference}</span>
                <button
                  className="text-indigo-600 hover:text-indigo-700 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                  onClick={handleCopyReference}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
  
            {/* Transfer Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-gray-50 rounded-2xl">
                <span className="text-gray-500 text-xs">From</span>
                <p className="text-gray-900 text-sm font-medium truncate">{transactionReceipt.senderName}</p>
                <p className="text-gray-500 text-xs truncate">{transactionReceipt.senderAccount}</p>
              </div>
  
              <div className="px-4 py-3 bg-gray-50 rounded-2xl">
                <span className="text-gray-500 text-xs">To</span>
                <p className="text-gray-900 text-sm font-medium truncate">{transactionReceipt.receiverName}</p>
                <p className="text-gray-500 text-xs truncate">{transactionReceipt.receiverAccount}</p>
              </div>
            </div>
  
            {/* Status */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-2xl">
              <span className="text-gray-600 text-sm">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {transactionReceipt.status}
              </span>
            </div>
  
            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:from-violet-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-indigo-100"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                <span>Share Receipt</span>
              </button>
  
              <button
                className="w-full text-indigo-600 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-50 transition-colors font-medium border border-indigo-100"
                onClick={handleCloseReceipt}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Transfers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50" ref={pageRef}>
      {/* Main Container */}
      <div className="max-w-lg mx-auto p-4 sm:p-6 pb-24" ref={transferFormRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
              <p className="text-sm text-gray-500">Fast and secure transfers</p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {showPinNotSetWarning && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">Set Transaction PIN</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Please set up your transaction PIN before making transfers for enhanced security.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleTransfer} className="space-y-6">
          {/* Source Account Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Wallet className="w-4 h-4 text-indigo-500 mr-2" />
              <span>From Account</span>
            </label>
            
            {/* Custom Dropdown */}
            <div className="relative" ref={accountsDropdownRef}>
              <div 
                className={`w-full p-4 border ${isDropdownOpen ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'} rounded-2xl bg-gray-50 flex justify-between items-center cursor-pointer`}
                onClick={toggleAccountsDropdown}  
              >
                {selectedAccount ? (
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {accounts.find(acc => acc.accountNumber === selectedAccount)?.accountType}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedAccount}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">Choose account</span>
                )}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
              </div>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {accounts.map(account => (
                    <div 
                      key={account.accountNumber}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => selectAccount(account.accountNumber)}  
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{account.accountType}</p>
                          <p className="text-sm text-gray-500">{account.accountNumber}</p>
                        </div>
                        <span className="font-medium text-gray-800">₦ {account.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formErrors.selectedAccount && (
              <p className="mt-2 text-sm text-red-500">{formErrors.selectedAccount}</p>
            )}

            {selectedAccountDetails && (
              <div className="mt-4 p-4 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Available Balance</span>
                  <span className="text-lg font-bold">
                    ₦ {selectedAccountDetails.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recipient Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <User className="w-4 h-4 text-indigo-500 mr-2" />
              <span>To Account</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={receiverAccount}
                onChange={handleReceiverAccountChange}
                placeholder="Enter account number"
                className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
              />
              {verifying && (
                <div className="absolute right-4 top-4">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              )}
            </div>

            {verifiedAccount?.account ? (
              <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">{verifiedAccount.account.accountName}</p>
                    <p className="text-sm text-green-600">{verifiedAccount.account.accountType}</p>
                  </div>
                </div>
              </div>
            ) : verificationError && receiverAccount.length >= 10 ? (
              <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Account not found</p>
                    <p className="text-sm text-red-600">Please check the account number</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Amount Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <NairaIcon />
              <span className="ml-2">Amount</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 pl-14 text-2xl font-medium"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl font-medium">₦</div>
            </div>
            
            {formErrors.amount && (
              <p className="mt-2 text-sm text-red-500">{formErrors.amount}</p>
            )}
          </div>

          {/* PIN Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <KeyRound className="w-4 h-4 text-indigo-500 mr-2" />
              <span>Transaction PIN</span>
            </label>
            <input
              type="password"
              value={pin}
              onChange={handlePinChange}
              placeholder="• • • •"
              maxLength={4}
              className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-xl tracking-widest letter-spacing-2 font-medium"
            />
            
            {formErrors.pin && (
              <p className="mt-2 text-sm text-red-500">{formErrors.pin}</p>
            )}
          </div>

          {/* Submit Button - Fixed to bottom on mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 sm:relative sm:border-0 sm:bg-transparent sm:p-0 backdrop-blur-md z-10">
            <button 
              type="submit" 
              disabled={transferring || !selectedAccount || !receiverAccount || !amount || !pin || showPinNotSetWarning}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-2xl flex items-center justify-center space-x-2 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
            >
              {transferring ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="font-medium">Send Money</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Transaction Receipt Modal */}
      {showReceipt && <TransactionReceipt />}
    </div>
  );
};

export default TransferPage;