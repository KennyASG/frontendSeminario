import { useState, useEffect } from 'react';

export default function Timer({ expiresAt, onExpire }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(expiresAt) - new Date();
            
            if (difference <= 0) {
                setTimeLeft({ expired: true });
                if (onExpire) onExpire();
                return null;
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            return { minutes, seconds, expired: false };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt, onExpire]);

    if (!timeLeft) return null;

    if (timeLeft.expired) {
        return (
            <div className="bg-red-900/50 border-2 border-red-500 rounded-xl p-4 text-center">
                <p className="text-red-200 font-bold">Tiempo expirado</p>
                <p className="text-red-300 text-sm mt-1">Tu reserva ha sido liberada</p>
            </div>
        );
    }

    const isUrgent = timeLeft.minutes < 5;

    return (
        <div className={`border-2 rounded-xl p-4 text-center transition-all ${
            isUrgent 
                ? 'bg-red-900/30 border-red-500 animate-pulse' 
                : 'bg-orange-900/30 border-orange-500'
        }`}>
            <p className="text-gray-300 text-sm mb-2">Tiempo restante</p>
            <div className="flex items-center justify-center gap-2">
                <div className="bg-black/50 rounded-lg px-4 py-2">
                    <span className={`text-3xl font-bold ${isUrgent ? 'text-red-400' : 'text-orange-400'}`}>
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                </div>
                <span className={`text-2xl font-bold ${isUrgent ? 'text-red-400' : 'text-orange-400'}`}>:</span>
                <div className="bg-black/50 rounded-lg px-4 py-2">
                    <span className={`text-3xl font-bold ${isUrgent ? 'text-red-400' : 'text-orange-400'}`}>
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
                {isUrgent ? 'Apresúrate!' : 'Completa tu compra'}
            </p>
        </div>
    );
}