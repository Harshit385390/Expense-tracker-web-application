import { Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import AllTransactions from './pages/AllTransactions';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    // Remove the className="App" - let the individual pages handle their own layout
    <div>
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
        <Route path='/income' element={<PrivateRoute element={<Income />} />} />
        <Route path='/expense' element={<PrivateRoute element={<Expense />} />} />
        <Route path='/transactions' element={<PrivateRoute element={<AllTransactions />} />} />
        <Route path='/home' element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;