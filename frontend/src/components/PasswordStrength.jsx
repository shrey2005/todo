import { Check, X } from 'lucide-react';
import { getStrength, getStrengthText } from '../constant';

const PasswordCriteria = ({ password = '' }) => {
    const criteria = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Uppercase letter (A–Z)', met: /[A-Z]/.test(password) },
        { label: 'Lowercase letter (a–z)', met: /[a-z]/.test(password) },
        { label: 'At least 1 number', met: /\d/.test(password) },
        { label: 'Special character ', met: /[^A-Za-z0-9]/.test(password) },
    ];
    return (
        <ul className="mt-4 space-y-1 text-sm text-gray-600">
            {criteria.map((item) => (
                <li key={item.label} className="flex items-center">
                    {item.met ? <Check className="w-4 h-4 text-green-500 mr-2" /> : <X className="w-4 h-4 text-gray-400 mr-2" />}
                    <span className={item.met ? 'text-green-600' : 'text-gray-500'}>{item.label}</span>
                </li>
            ))}
        </ul>
    );
};
const strengthColor = {
    0: 'bg-red-400',
    1: 'bg-yellow-400',
    2: 'bg-yellow-500',
    3: 'bg-green-500',
    4: 'bg-green-600',
};

const PasswordStrength = ({ password = '' }) => {
    const strength = getStrength(password);

    return (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                <span className="text-sm font-semibold text-gray-800">{getStrengthText(strength)}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex space-x-1 mb-3">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-1/4 rounded-full transition-colors duration-300 ${
                            index < strength ? strengthColor[strength] : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>

            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrength;
