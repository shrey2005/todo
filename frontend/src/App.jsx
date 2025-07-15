import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import Navbar from './components/Navbar';
import ProfilePage from './page/Profile';
import { ProtectedRoute } from './router/ProtectedRoute';

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
