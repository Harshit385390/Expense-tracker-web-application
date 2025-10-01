import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ExpenseChart from './ExpenseChart';

function Expense() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [expenseAmt, setExpenseAmt] = useState(0);
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

    // Filter only expense transactions
    const expenseTransactions = expenses.filter(expense => expense.amount < 0);
    
    // Filter expenses based on search
    const filteredExpenses = expenseTransactions.filter(expense =>
        expense.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total expenses
    useEffect(() => {
        const expense = expenseTransactions
            .reduce((acc, item) => acc + Math.abs(item.amount), 0);
        setExpenseAmt(expense);
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
                    <h1 className="header-title">Expense Management</h1>
                    <div className="header-actions">
                        <button 
                            className="header-button"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            {showAddForm ? 'Cancel' : '+ Add Expense'}
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {/* Add Expense Form */}
                    {showAddForm && (
                        <div className="form-container">
                            <ExpenseForm addTransaction={addTransaction} />
                        </div>
                    )}

                    {/* Expense Summary */}
                    <div className="dashboard-grid">
                        <div className="summary-card expense">
                            <h3 className="card-title">Total Expenses</h3>
                            <p className="card-value negative">₹{expenseAmt.toFixed(2)}</p>
                        </div>
                        <div className="summary-card">
                            <h3 className="card-title">Expense Categories</h3>
                            <p className="card-value neutral">
                                {new Set(expenseTransactions.map(e => e.text)).size}
                            </p>
                        </div>
                    </div>

                    {/* Expense Chart */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h2 className="chart-title">Expense Breakdown</h2>
                        </div>
                        <ExpenseChart transactions={expenses} />
                    </div>

                    {/* Expense Transactions */}
                    <div className="recent-transactions">
                        <div className="chart-header">
                            <h2 className="chart-title">All Expense Transactions</h2>
                            <div className="search-bar-container" style={{ margin: 0 }}>
                                <input
                                    type='text'
                                    placeholder='Search expenses by description...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='search-input'
                                    style={{ width: '250px' }}
                                />
                            </div>
                        </div>
                        
                        <ExpenseTable
                            expenses={filteredExpenses}
                            deleteExpens={deleteExpens}
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Expense;