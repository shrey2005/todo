import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import ProfilePopup from './ProfilePopup.jsx';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center px-8 py-3 bg-white shadow-md border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-blue-600 tracking-wide">MyApp</h1>
            <div className="relative flex items-center gap-4">
                <button
                    className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    onClick={() => setOpen(!open)}
                >
                    <FaUserCircle className="inline text-2xl mr-2" />
                    Profile
                </button>
                {open && <ProfilePopup onClose={() => setOpen(false)} />}
            </div>
        </nav>
    );
}
