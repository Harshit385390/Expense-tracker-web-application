import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar.js';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';

function Income() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
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

    // Filter only income transactions
    const incomeTransactions = expenses.filter(expense => expense.amount > 0);
    
    // Filter income based on search
    const filteredIncome = incomeTransactions.filter(income =>
        income.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total income
    useEffect(() => {
        const income = incomeTransactions
            .reduce((acc, item) => acc + item.amount, 0);
        setIncomeAmt(income);
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

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
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

    return (
        <div className="app-container">
            <Sidebar userName={loggedInUser} handleLogout={handleLogout} />
            
            <div className="main-content">
                <header className="top-header">
                    <h1 className="header-title">Income Management</h1>
                    <div className="header-actions">
                        <button 
                            className="header-button"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? 'Cancel' : '+ Add Income'}
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {/* Add Income Form */}
                    {showAddForm && (
                        <div className="form-container">
                            <ExpenseForm addTransaction={addTransaction} />
                        </div>
                    )}

                    {/* Income Summary */}
                    <div className="dashboard-grid">
                        <div className="summary-card income">
                            <h3 className="card-title">Total Income</h3>
                            <p className="card-value positive">₹{incomeAmt.toFixed(2)}</p>
                        </div>
                        <div className="summary-card">
                            <h3 className="card-title">Income Sources</h3>
                            <p className="card-value neutral">{incomeTransactions.length}</p>
                        </div>
                    </div>

                    {/* Income Chart Section - You can enhance this later */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h2 className="chart-title">Income Overview</h2>
                        </div>
                        {incomeTransactions.length > 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                                <p>Income chart visualization coming soon...</p>
                                <p>Total Income: ₹{incomeAmt.toFixed(2)} from {incomeTransactions.length} sources</p>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No income data available. Add your first income transaction!</p>
                            </div>
                        )}
                    </div>

                    {/* Income Transactions */}
                    <div className="recent-transactions">
                        <div className="chart-header">
                            <h2 className="chart-title">All Income Transactions</h2>
                            <div className="search-bar-container" style={{ margin: 0 }}>
                                <input
                                    type='text'
                                    placeholder='Search income by description...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='search-input'
                                    style={{ width: '250px' }}
                                />
                            </div>
                        </div>
                        
                        <ExpenseTable
                            expenses={filteredIncome}
                            deleteExpens={deleteExpens}
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Income;