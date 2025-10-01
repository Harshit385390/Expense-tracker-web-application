import React from 'react';
import { toast } from 'react-toastify';

// --- Icon Component Definition ---
// This component renders an SVG icon based on the 'name' prop.
export const Icon = ({ name, className = "w-5 h-5" }) => {
    const getPath = (name) => {
        switch (name) {
            case 'plus':
                return "M12 4.5v15m7.5-7.5h-15";
            case 'x':
                return "M6 18L18 6M6 6l12 12";
            case 'dashboard':
                return "M2.25 10.5h19.5m-19.5 0h19.5m-19.5 0v3.75a2.25 2.25 0 002.25 2.25h14.25a2.25 2.25 0 002.25-2.25v-3.75m-19.5 0h19.5m-9.75 0V3.75M12 10.5V3.75";
            case 'income':
                return "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 014.288-1.743l.534-.143l2.842 2.842L21.75 18m-17.5-6.75l7.5-7.5m-6 6h10.5";
            case 'expense':
                return "M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 014.288 1.743l.534.143 2.842-2.842L21.75 6m-17.5 6.75l7.5 7.5m-6-6h10.5";
            case 'logout':
                return "M5.636 4.636l1.25 1.25m4.38-4.38l-1.25 1.25M6.886 16.886l-1.25 1.25m4.38 4.38l-1.25-1.25m-1.75-9a8 8 0 1116 0A8 8 0 013.636 12z";
            case 'transactions':
                // A general icon for 'all transactions' or a list
                return "M3.75 12h16.5m-16.5 0L6 9.75m-2.25 2.25L6 14.25m16.5-2.25L18 9.75m4.5 2.25L18 14.25";
            case 'download': // Used for downloading reports
                return "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3";
            case 'trash': // Used for deleting items
                return "M14.746 3.992c-.173-.086-.395-.128-.62-.128H9.874c-.225 0-.447.042-.62.128M17.25 7.5H6.75M16.5 7.5l-.75 9.75a1.5 1.5 0 01-1.493 1.25H9.743a1.5 1.5 0 01-1.493-1.25L7.5 7.5m4.5 0v9m-3-9v9m6-9v9";
            case 'edit': // Used for editing items
                return "M16.862 4.487l1.416 1.416a2.25 2.25 0 003.182-3.182l-1.416-1.416a2.25 2.25 0 00-3.182 3.182zM15 12h3.75M9 7.5l10.5 10.5M4.5 19.5a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25H12a.75.75 0 000-1.5H4.5A3.75 3.75 0 00.75 6.75v10.5A3.75 3.75 0 004.5 21h10.5a3.75 3.75 0 003.75-3.75V12a.75.75 0 00-1.5 0v4.5a2.25 2.25 0 01-2.25 2.25H4.5z";
            default:
                return "";
        }
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d={getPath(name)} />
        </svg>
    );
};
// --- End Icon Component Definition ---

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right'
    });
};

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top-right'
    });
};

export const APIUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
