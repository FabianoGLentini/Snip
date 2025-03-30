import React from "react";

interface LoadingScreen {
    isOpen: boolean;
    onClose: React.ReactNode;
    title?: string;
}