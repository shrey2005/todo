import { useNavigate } from 'react-router-dom';

export default function ProfilePopup({ onClose }) {
    const navigate = useNavigate();

    return (
        <div className="absolute right-0 top-10 bg-white shadow-md rounded-md w-32 text-black z-10">
            <ul>
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        navigate('/profile');
                        onClose();
                    }}
                >
                    Profile
                </li>
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        navigate('/login');
                        localStorage.remove();
                    }}
                >
                    Logout
                </li>
            </ul>
        </div>
    );
}
