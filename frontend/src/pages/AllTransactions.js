import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Sidebar from './Sidebar';
import ExpenseTable from './ExpenseTable';

function AllTransactions() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
    const [filterMonth, setFilterMonth] = useState('');

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

    // Filter transactions based on search, type, and month
    const filteredExpenses = expenses.filter(expense => {
        // Search filter
        const matchesSearch = expense.text.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Type filter
        let matchesType = true;
        if (filterType === 'income') {
            matchesType = expense.amount > 0;
        } else if (filterType === 'expense') {
            matchesType = expense.amount < 0;
        }
        
        // Month filter
        let matchesMonth = true;
        if (filterMonth) {
            const expenseDate = new Date(expense.date);
            const expenseMonth = expenseDate.getMonth() + 1; // 1-12
            const expenseYear = expenseDate.getFullYear();
            const [selectedYear, selectedMonth] = filterMonth.split('-');
            matchesMonth = expenseMonth === parseInt(selectedMonth) && expenseYear === parseInt(selectedYear);
        }
        
        return matchesSearch && matchesType && matchesMonth;
    });

    // Get unique months for filter
    const uniqueMonths = [...new Set(expenses
        .map(expense => {
            const date = new Date(expense.date);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        })
        .filter(Boolean)
    )].sort().reverse();

    return (
        <div className="app-container">
            <Sidebar userName={loggedInUser} handleLogout={handleLogout} />
            
            <div className="main-content">
                <header className="top-header">
                    <h1 className="header-title">All Transactions</h1>
                </header>

                <div className="content-area">
                    {/* Filter Section */}
                    <div className="filter-section">
                        <div className="filter-grid">
                            <div className="form-group">
                                <label className="form-label">Search Description</label>
                                <input
                                    type="text"
                                    placeholder="Filter by description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Transaction Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="all">All Transactions</option>
                                    <option value="income">Income Only</option>
                                    <option value="expense">Expense Only</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Filter by Month</label>
                                <select
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">All Months</option>
                                    {uniqueMonths.map(month => {
                                        const [year, monthNum] = month.split('-');
                                        const date = new Date(year, monthNum - 1);
                                        return (
                                            <option key={month} value={month}>
                                                {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Summary */}
                    <div className="dashboard-grid">
                        <div className="summary-card">
                            <h3 className="card-title">Total Transactions</h3>
                            <p className="card-value neutral">{filteredExpenses.length}</p>
                        </div>
                        <div className="summary-card income">
                            <h3 className="card-title">Total Income</h3>
                            <p className="card-value positive">
                                ₹{filteredExpenses.filter(e => e.amount > 0).reduce((acc, e) => acc + e.amount, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="summary-card expense">
                            <h3 className="card-title">Total Expense</h3>
                            <p className="card-value negative">
                                ₹{Math.abs(filteredExpenses.filter(e => e.amount < 0).reduce((acc, e) => acc + e.amount, 0)).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="recent-transactions">
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

export default AllTransactions;