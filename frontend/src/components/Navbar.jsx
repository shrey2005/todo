import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import ProfilePopup from './ProfilePopup.jsx';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">MyApp</h1>
            <div className="relative">
                <FaUserCircle className="text-3xl cursor-pointer" onClick={() => setOpen(!open)} />
                {open && <ProfilePopup onClose={() => setOpen(false)} />}
            </div>
        </nav>
    );
}
