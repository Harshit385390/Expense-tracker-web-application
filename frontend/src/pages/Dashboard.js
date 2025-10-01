import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';  // Now it's in the same pages folder
import ExpenseChart from './ExpenseChart';
import ExpenseForm from './ExpenseForm';

function Dashboard() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchExpenses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
    };

    // Recalculate income and expense totals
    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0);
        setIncomeAmt(income);
        setExpenseAmt(Math.abs(exp));
    }, [expenses]);

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const addTransaction = async (data) => {
        try {
            const transactionData = {
                ...data,
                amount: parseFloat(data.amount),
            };

            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(transactionData)
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
            setShowAddForm(false);
        } catch (err) {
            handleError(err);
        }
    };

    // Get recent transactions (last 5)
    const recentTransactions = expenses.slice(-5).reverse();

    const netBalance = incomeAmt - expenseAmt;

    return (
        <div className="app-container">
            <Sidebar userName={loggedInUser} handleLogout={handleLogout} />
            
            <div className="main-content">
                <header className="top-header">
                    <h1 className="header-title">Dashboard Overview</h1>
                    <div className="header-actions">
                        <button 
                            className="header-button"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? 'Cancel' : '+ Add Transaction'}
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {/* Add Transaction Form */}
                    {showAddForm && (
                        <div className="form-container">
                            <ExpenseForm addTransaction={addTransaction} />
                        </div>
                    )}

                    {/* Summary Cards */}
                    <div className="dashboard-grid">
                        <div className="summary-card income">
                            <h3 className="card-title">Total Income</h3>
                            <p className="card-value positive">{incomeAmt.toFixed(2)}</p>
                        </div>
                        <div className="summary-card expense">
                            <h3 className="card-title">Total Expense</h3>
                            <p className="card-value negative">{expenseAmt.toFixed(2)}</p>
                        </div>
                        <div className="summary-card balance">
                            <h3 className="card-title">Net Balance</h3>
                            <p className={`card-value {netBalance >= 0 ? 'positive' : 'negative'}`}>
                                {netBalance.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h2 className="chart-title">Financial Overview</h2>
                        </div>
                        <ExpenseChart transactions={expenses} />
                    </div>

                    {/* Recent Transactions */}
                    <div className="recent-transactions">
                        <div className="chart-header">
                            <h2 className="chart-title">Recent Transactions</h2>
                            <button 
                                className="header-button"
                                onClick={() => navigate('/transactions')}
                            >
                                View All
                            </button>
                        </div>
                        
                        {recentTransactions.length > 0 ? (
                            <div className="transactions-list">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction._id} className="transaction-item">
                                        <div className="transaction-info">
                                            <div className={`transaction-icon {transaction.amount > 0 ? 'income' : 'expense'}`}>
                                                {transaction.amount > 0 ? '💰' : '💸'}
                                            </div>
                                            <div className="transaction-details">
                                                <h4>{transaction.text}</h4>
                                                <p>{new Date(transaction.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`transaction-amount {transaction.amount > 0 ? 'income' : 'expense'}`}>
                                            {transaction.amount > 0 ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No transactions yet. Add your first transaction!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Dashboard;