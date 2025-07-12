import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import Navbar from './components/Navbar';
import ProfilePage from './page/Profile';
import { getToken } from './constant';
export const ProtectedRoute = ({ children }) => {
    const token = getToken();
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
