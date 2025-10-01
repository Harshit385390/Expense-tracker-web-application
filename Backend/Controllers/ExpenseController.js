const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
   
    // Extract text, amount, and date from req.body
    const { text, amount, date } = req.body;

    // Basic validation to ensure all required fields are present
    if (!text || !amount || !date) {
        return res.status(400).json({
            message: "Text, amount, and date are required to add an expense.",
            success: false
        });
    }

    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: { text, amount, date } } }, // Push the new expense object with date
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        res.status(200)
            .json({
                message: "Expense added successfully",
                success: true,
                data: userData?.expenses
            });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    // console.log(_id, req.body) // Remove or comment out console logs for production
    try {
        const userData = await UserModel.findById(_id).select('expenses');

        if (!userData) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        res.status(200)
            .json({
                message: "Fetched Expenses successfully",
                success: true,
                data: userData?.expenses
            });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

// NEW FUNCTION: Handles the PUT request to update a single expense sub-document
const updateTransaction = async (req, res) => {
    const { _id } = req.user;
    // Get the expense ID from the URL parameters (must match the router)
    const expenseId = req.params.expenseId; 
    // Get the updated fields from the request body
    const { text, amount, date } = req.body; 

    // Basic validation
    if (!text || !amount || !date) {
        return res.status(400).json({
            message: "Text, amount, and date are required to update an expense.",
            success: false
        });
    }

    try {
        // Find the user and the specific expense sub-document
        const updatedUser = await UserModel.findOneAndUpdate(
            // Query: Find the user AND the specific expense within the user's array
            { "_id": _id, "expenses._id": expenseId }, 
            {
                // Update the found sub-document using the positional operator ($)
                "$set": {
                    "expenses.$.text": text,
                    "expenses.$.amount": amount,
                    "expenses.$.date": date,
                    // If you add category/type later, they would go here
                }
            },
            { new: true } // Return the document after update
        ).select('expenses');

        if (!updatedUser) {
            // This handles cases where the user or the transaction ID within the array is not found
            return res.status(404).json({ 
                message: "User or Transaction not found.", 
                success: false 
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            success: true,
            data: updatedUser.expenses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong during update",
            error: err.message,
            success: false
        });
    }
};

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        res.status(200)
            .json({
                message: "Expense Deleted successfully",
                success: true,
                data: userData?.expenses
            });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction // <-- Added the new function here
};
