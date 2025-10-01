
const express = require('express');
const { 
    getAllTransactions, 
    addTransaction, 
    deleteTransaction,
    updateTransaction // <-- Added update function from controller
} = require('../Controllers/ExpenseController');
const router = express.Router();

// GET all transactions for the user
router.get('/', getAllTransactions);

// POST a new transaction
router.post('/', addTransaction);

// PUT to update a transaction by ID
router.put('/:expenseId', updateTransaction); // <-- NEW: Route for updating

// DELETE a transaction by ID
router.delete('/:expenseId', deleteTransaction);

module.exports = router;
