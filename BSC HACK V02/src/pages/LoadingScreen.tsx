import React from "react";

interface LoadingScreen {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const LoadingScreen: React.FC<LoadingScreen> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                <h2 className="text-xl font-semibold mb-4">Loading</h2>
                <input type="file" accept="application/loading" className="mb-4" />
                
                {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default LoadingScreen;
