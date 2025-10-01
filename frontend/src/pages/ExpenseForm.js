import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        date: '' // Added date field
    });
    const [expenseType, setExpenseType] = useState('');
    const [customExpense, setCustomExpense] = useState('');

    const expenseTypes = [
        'food',
        'travel',
        'shopping',
        'entertainment',
        'bills',
        'healthcare',
        'education',
        'income',
        'other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo(prevExpenseInfo => ({
            ...prevExpenseInfo,
            [name]: value
        }));
    };

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setExpenseType(selectedType);

        setExpenseInfo(prevExpenseInfo => {
            const newExpenseInfo = { ...prevExpenseInfo };
            if (selectedType !== 'other') {
                newExpenseInfo.text = selectedType; // Auto-fill text with selected type
                setCustomExpense(''); // Clear custom expense if a predefined type is selected
            } else {
                newExpenseInfo.text = customExpense; // If "other" is selected, use custom expense text
            }
            return newExpenseInfo;
        });
    };

    const handleCustomExpenseChange = (e) => {
        const customValue = e.target.value;
        setCustomExpense(customValue);
        // Update the text field with custom value
        setExpenseInfo(prevExpenseInfo => ({
            ...prevExpenseInfo,
            text: customValue
        }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, date } = expenseInfo;

        if (!amount || !text || !date) {
            handleError('Please add all Expense Details (Amount, Type, and Date)');
            return;
        }

        addTransaction(expenseInfo);
        setExpenseInfo({ amount: '', text: '', date: '' }); // Clear date field
        setExpenseType('');
        setCustomExpense('');
    };

    return (
        <div className='expense-form-container'> {/* Changed class for specific styling */}
            <h2 className='form-title'>Add New Transaction</h2>
            <form onSubmit={addExpenses} className='expense-form'>
                <div className='form-group'>
                    <label htmlFor='expenseType' className='form-label'>Expense Type</label>
                    <select
                        id="expenseType"
                        value={expenseType}
                        onChange={handleTypeChange}
                        name="expenseType"
                        className='form-select'
                    >
                        <option value="">Select Expense Type</option>
                        {expenseTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {expenseType === 'other' && (
                    <div className='form-group'>
                        <label htmlFor='customExpense' className='form-label'>Custom Expense Description</label>
                        <input
                            onChange={handleCustomExpenseChange}
                            type='text'
                            id='customExpense'
                            placeholder='Enter custom expense type or description...'
                            value={customExpense}
                            className='form-input'
                        />
                    </div>
                )}

                <div className='form-group'>
                    <label htmlFor='amount' className='form-label'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        id='amount' 
                        placeholder='Enter amount...'
                        value={expenseInfo.amount}
                        className='form-input'
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='date' className='form-label'>Date</label>
                    <input
                        onChange={handleChange}
                        type='date'
                        name='date'
                        id='date'
                        value={expenseInfo.date}
                        className='form-input'
                    />
                </div>

                <button type='submit' className='submit-button'>Add Transaction</button>
            </form>
        </div>
    );
}

export default ExpenseForm;