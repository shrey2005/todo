import { Check, X } from 'lucide-react';
import { getColor, getStrength, getStrengthText } from '../constant';

const PasswordCriteria = ({ password = '' }) => {
    const criteria = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    ];
    return (
        <div className="mt-2 space-y-1">
            {criteria.map((item) => (
                <div key={item.label} className="flex items-center text-xs">
                    {item.met ? <Check className="size-4 text-yellow-600 mr-2" /> : <X className="size-4 text-red-900 mr-2" />}
                    <span className={item.met ? 'text-yellow-600' : 'text-red-900'}>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrength = ({ password = '' }) => {
    const strength = getStrength(password);

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-fuchsia-600">Password Strength</span>
                <span className="text-xs text-fuchsia-700 font-medium">{getStrengthText(strength)}</span>
            </div>
            <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300
                        ${index < strength ? getColor(strength) : 'bg-gray-300'}
                        `}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrength;
