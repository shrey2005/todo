import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

export default function ProfilePopup({ onClose }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg w-40 shadow-lg z-20">
            <ul className="divide-y divide-gray-100">
                <li
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors rounded-t-lg"
                    onClick={() => {
                        navigate('/profile');
                        onClose();
                    }}
                >
                    <span className="font-medium text-gray-800">Profile</span>
                </li>
                <li
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors rounded-b-lg"
                    onClick={() => {
                        navigate('/');
                        logout();
                    }}
                >
                    <span className="font-medium text-gray-800">Logout</span>
                </li>
            </ul>
        </div>
    );
}
