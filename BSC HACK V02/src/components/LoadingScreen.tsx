import React from "react";

interface LoadingScreen {
    isOpen: boolean;
    onClose: React.ReactNode;
    title?: string;
}

const LoadingScreen: React.FC<LoadingScreen> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    
                </button>
                {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default GenericWindow;
