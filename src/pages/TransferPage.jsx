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
  ChevronDown,
  KeyRound,
  CheckCircle2,
  Info,
  Copy,
  Share2,
  ArrowLeft,
  X,
  Wallet,
  RefreshCw,
  ArrowRight
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4" ref={receiptRef}>
        <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 rounded-3xl shadow-2xl w-full max-w-sm my-8 overflow-hidden scale-100 animate-scaleIn border border-white/10">
          {/* Success Header */}
          <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <button
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
              onClick={handleCloseReceipt}
            >
              <X className="w-5 h-5" />
            </button>
  
            <div className="flex flex-col items-center relative">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-4">
                <div className="bg-white rounded-full p-2">
                  <CheckCircle2 className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Transfer Successful</h2>
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
            <div className="flex justify-between items-center px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <span className="text-white/80 text-sm">Reference</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">{transactionReceipt.reference}</span>
                <button
                  className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-white/5 transition-colors"
                  onClick={handleCopyReference}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
  
            {/* Transfer Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <span className="text-white/60 text-xs">From</span>
                <p className="text-white text-sm font-medium truncate">{transactionReceipt.senderName}</p>
                <p className="text-white/60 text-xs truncate">{transactionReceipt.senderAccount}</p>
              </div>
  
              <div className="px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <span className="text-white/60 text-xs">To</span>
                <p className="text-white text-sm font-medium truncate">{transactionReceipt.receiverName}</p>
                <p className="text-white/60 text-xs truncate">{transactionReceipt.receiverAccount}</p>
              </div>
            </div>
  
            {/* Status */}
            <div className="flex justify-between items-center px-4 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <span className="text-white/80 text-sm">Status</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                {transactionReceipt.status}
              </span>
            </div>
  
            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-400 transition-all font-medium"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                <span>Share Receipt</span>
              </button>
  
              <button
                className="w-full bg-white/5 backdrop-blur-sm text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors font-medium border border-white/10"
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
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 text-white overflow-y-auto" ref={pageRef}>
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-lg mx-auto p-6 pb-32" ref={transferFormRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 backdrop-blur-md rounded-2xl border border-blue-400/20">
              <Send className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Send Money</h1>
              <p className="text-sm text-white/60">Fast and secure transfers</p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {showPinNotSetWarning && (
          <div className="mb-6 p-4 bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-300">Set Transaction PIN</h3>
                <p className="text-sm text-amber-200/80 mt-1">
                  Please set up your transaction PIN before making transfers for enhanced security.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleTransfer} className="space-y-6">
          {/* Source Account Section */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <label className="flex items-center text-sm font-medium text-white/80 mb-3">
              <Wallet className="w-4 h-4 text-blue-400 mr-2" />
              <span>From Account</span>
            </label>
            
            {/* Custom Dropdown */}
            <div className="relative" ref={accountsDropdownRef}>
              <div 
                className={`w-full p-4 border ${isDropdownOpen ? 'border-blue-400/30 ring-2 ring-blue-400/10' : 'border-white/10'} rounded-2xl bg-white/5 backdrop-blur-sm flex justify-between items-center cursor-pointer`}
                onClick={toggleAccountsDropdown}  
              >
                {selectedAccount ? (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {accounts.find(acc => acc.accountNumber === selectedAccount)?.accountType}
                    </span>
                    <span className="text-sm text-white/60">
                      {selectedAccount}
                    </span>
                  </div>
                ) : (
                  <span className="text-white/40">Choose account</span>
                )}
                <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-indigo-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                  {accounts.map(account => (
                    <div 
                      key={account.accountNumber}
                      className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/10 last:border-0"
                      onClick={() => selectAccount(account.accountNumber)}  
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{account.accountType}</p>
                          <p className="text-sm text-white/60">{account.accountNumber}</p>
                        </div>
                        <span className="font-medium">₦ {account.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formErrors.selectedAccount && (
              <p className="mt-2 text-sm text-red-300">{formErrors.selectedAccount}</p>
            )}

            {selectedAccountDetails && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Available Balance</span>
                  <span className="text-lg font-bold">
                    ₦ {selectedAccountDetails.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recipient Section */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <label className="flex items-center text-sm font-medium text-white/80 mb-3">
              <User className="w-4 h-4 text-blue-400 mr-2" />
              <span>To Account</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={receiverAccount}
                onChange={handleReceiverAccountChange}
                placeholder="Enter account number"
                className="w-full p-4 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400/30 transition-all text-white placeholder-white/40"
              />
              {verifying && (
                <div className="absolute right-4 top-4">
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
              )}
            </div>

            {verifiedAccount?.account ? (
              <div className="mt-4 p-4 bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-500/20">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-300">{verifiedAccount.account.accountName}</p>
                    <p className="text-sm text-green-300/70">{verifiedAccount.account.accountType}</p>
                  </div>
                </div>
              </div>
            ) : verificationError && receiverAccount.length >= 10 ? (
              <div className="mt-4 p-4 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-300">Account not found</p>
                    <p className="text-sm text-red-300/70">Please check the account number</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Amount Section */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <label className="flex items-center text-sm font-medium text-white/80 mb-3">
              <NairaIcon />
              <span className="ml-2">Amount</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full p-4 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400/30 pl-14 text-2xl font-medium text-white placeholder-white/40"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-2xl font-medium">₦</div>
            </div>
            
            {formErrors.amount && (
              <p className="mt-2 text-sm text-red-300">{formErrors.amount}</p>
            )}
          </div>

          {/* PIN Section */}
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <label className="flex items-center text-sm font-medium text-white/80 mb-3">
              <KeyRound className="w-4 h-4 text-blue-400 mr-2" />
              <span>Transaction PIN</span>
            </label>
            <input
              type="password"
              value={pin}
              onChange={handlePinChange}
              placeholder="• • • •"
              maxLength={4}
              className="w-full p-4 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400/30 text-xl tracking-widest letter-spacing-2 font-medium text-white placeholder-white/40"
            />
            
            {formErrors.pin && (
              <p className="mt-2 text-sm text-red-300">{formErrors.pin}</p>
            )}
          </div>

          {/* Submit Button - Fixed to bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-6 backdrop-blur-lg bg-gradient-to-t from-indigo-950 to-transparent z-10">
            <div className="max-w-lg mx-auto">
              <button 
                type="submit" 
                disabled={transferring || !selectedAccount || !receiverAccount || !amount || !pin || showPinNotSetWarning}
                className="w-full bg-blue-500 text-white p-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Transaction Receipt Modal */}
      {showReceipt && <TransactionReceipt />}
    </div>
  );
};

export default TransferPage;