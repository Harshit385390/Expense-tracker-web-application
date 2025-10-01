import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Define colors for your categories
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054'];

const ExpenseChart = ({ transactions }) => {
    
    // 1. Filter only expenses (amount < 0)
    const expenses = transactions.filter(t => t.amount < 0);

    // 2. Aggregate data by category (text)
    const aggregatedData = expenses.reduce((acc, transaction) => {
        const category = transaction.text.toLowerCase();
        const amount = Math.abs(transaction.amount); // Use absolute value
        
        const existing = acc.find(item => item.name === category);

        if (existing) {
            existing.value += amount;
        } else {
            acc.push({ name: category, value: amount });
        }
        return acc;
    }, []);

    if (aggregatedData.length === 0) {
        return <div className="no-chart-data">No expenses to display in chart.</div>;
    }

    return (
        <div className="chart-container" style={{ width: '100%', height: 300 }}>
            <h3 className='chart-title'>Spending Breakdown by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={aggregatedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {aggregatedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;