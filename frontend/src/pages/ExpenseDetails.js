import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt, transactions }) {
    const balance = incomeAmt - expenseAmt;

   
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
       
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      
        if (isNaN(date.getTime())) {
            return dateString; // Fallback to original string if invalid
        }
        return date.toLocaleDateString();
    };

    return (
        <div className='expense-details-card section-card'> {/* Added section-card here */}
            <h2 className='card-title'>Current Balance</h2>
            <div className={`balance-amount ${balance < 0 ? 'negative-balance' : 'positive-balance'}`}>
                ₹ {balance.toFixed(2)}
            </div>

            {/* Income & Expense Summary */}
            <div className="amounts-summary-grid">
                <div className="income-box">
                    <h3 className="summary-label">Income</h3>
                    <span className="summary-value income">₹{incomeAmt.toFixed(2)}</span>
                </div>
                <div className="expense-box">
                    <h3 className="summary-label">Expense</h3>
                    <span className="summary-value expense">₹{expenseAmt.toFixed(2)}</span>
                </div>
            </div>

            {/* Transaction History Section */}
            <h3 className="transaction-history-heading">Recent Transactions</h3> {/* Changed title for consistency */}
            {transactions && transactions.length > 0 ? (
                <ul className="transaction-list">
                    {transactions.map(transaction => (
                        <li key={transaction._id} className={`transaction-item ${transaction.amount < 0 ? 'minus' : 'plus'}`}> {/* Changed key to _id */}
                            <span className="transaction-text">{transaction.text}</span>
                            <span className="transaction-date">{formatDate(transaction.date)}</span> {/* Applied formatDate */}
                            <span className="transaction-amount">₹{transaction.amount.toFixed(2)}</span> {/* Removed Math.abs() */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-transactions-message">No transactions yet.</p> 
            )}
        </div>
    );
}

export default ExpenseDetails;