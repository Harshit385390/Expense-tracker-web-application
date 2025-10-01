import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {

    // Helper function to format date safely from YYYY-MM-DD string
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle cases where dateString might be null or undefined
        const [year, month, day] = dateString.split('-');
        // Construct date in local time to avoid timezone shifts
        // month is 0-indexed in JavaScript Date constructor
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        // Check for invalid date (e.g., if parsing failed)
        if (isNaN(date.getTime())) {
            return dateString; // Fallback to original string if invalid
        }
        return date.toLocaleDateString();
    };

    return (
        <div className="transactions-table-container section-card"> {/* Added section-card here for consistent styling */}
            <h2 className='table-title'>Recent Transactions</h2>
            {expenses.length === 0 ? (
                <p className='no-transactions-message'>No transactions to display.</p>
            ) : (
                <div className='table-wrapper'>
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th></th> {/* For delete button */}
                                <th>Description</th>
                                <th>Date</th> {/* New Date Column Header */}
                                <th className='amount-header'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense._id} className={expense.amount < 0 ? 'expense-row minus' : 'expense-row plus'}>
                                    <td className='delete-cell'>
                                        <button className="delete-button" onClick={() => deleteExpens(expense._id)}>
                                            &times; {/* HTML entity for a clear 'X' */}
                                        </button>
                                    </td>
                                    <td className="expense-description-cell">{expense.text}</td>
                                    {/* Applied formatDate helper */}
                                    <td className="expense-date-cell">{formatDate(expense.date)}</td>
                                    <td className="expense-amount-cell">
                                        ₹{expense.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpenseTable;