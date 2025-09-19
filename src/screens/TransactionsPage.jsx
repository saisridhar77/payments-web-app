import { useEffect, useState } from 'react';
import { api } from '../api.js';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Less than a minute ago
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Less than an hour ago
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day ago
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Same year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Different year, show full date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return timestamp;
  }
};

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '-';
  return `₹${parseFloat(amount).toFixed(2)}`;
};

export default function TransactionsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.transactions();
        // console.log(res);
        setData(res);
      } catch (e) {
        setError(e?.message || 'Failed to load transactions');
      }
    })();
  }, []);

  if (error) return <p className="container" style={{ color: 'tomato' }}>{error}</p>;
  if (!data) return <p className="container">Loading...</p>;

  const { balance, transactions = [] } = data;

  const transactionStyles = {
    transactionItem: {
      padding: '16px 0',
      borderBottom: '1px solid #1e2a46',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background-color 0.2s ease'
    },
    transactionItemHover: {
      backgroundColor: 'rgba(91, 140, 255, 0.05)',
      borderRadius: '8px',
      padding: '16px 12px',
      margin: '0 -12px'
    },
    transactionLeft: {
      flex: 1
    },
    vendorName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#e9edf7',
      marginBottom: '4px'
    },
    timestamp: {
      fontSize: '14px',
      color: '#a8b0c3'
    },
    transactionRight: {
      textAlign: 'right'
    },
    amount: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ff6b6b'
    },
    balanceCard: {
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #5b8cff 0%, #7c3aed 100%)',
      color: '#fff'
    },
    balanceAmount: {
      fontSize: '24px',
      fontWeight: '700',
      margin: 0
    },
    balanceLabel: {
      fontSize: '14px',
      opacity: 0.9,
      margin: '0 0 4px 0'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#a8b0c3'
    },
    transactionsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>Transactions</h2>
      
      {/* Balance Card */}
      <div className="card-panel" style={transactionStyles.balanceCard}>
        <p style={transactionStyles.balanceLabel}>Current Balance</p>
        <p style={transactionStyles.balanceAmount}>{formatAmount(balance)}</p>
      </div>

      {/* Transactions List */}
      <div className="card-panel">
        {transactions.length === 0 ? (
          <div style={transactionStyles.emptyState}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No transactions yet</p>
            <p style={{ fontSize: '14px', margin: 0 }}>Your payment history will appear here</p>
          </div>
        ) : (
          <ul style={transactionStyles.transactionsList}>
            {transactions.map((t, i) => (
              <li 
                key={i} 
                style={{
                  ...transactionStyles.transactionItem,
                  ...(i === transactions.length - 1 ? { borderBottom: 'none' } : {})
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, transactionStyles.transactionItemHover);
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderRadius = '0';
                  e.target.style.padding = '16px 0';
                  e.target.style.margin = '0';
                }}
              >
                <div style={transactionStyles.transactionLeft}>
                  <div style={transactionStyles.vendorName}>
                    {t.vendor || t.vendorName || 'Unknown Vendor'}
                  </div>
                  <div style={transactionStyles.timestamp}>
                    {formatTimestamp(t.timestamp || t.createdAt)}
                  </div>
                </div>
                <div style={transactionStyles.transactionRight}>
                  <div style={transactionStyles.amount}>
                    -{formatAmount(t.amount)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


