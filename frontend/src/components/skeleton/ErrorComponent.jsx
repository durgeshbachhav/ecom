import React from "react";

const ErrorComponent = ({ error }) => {
    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="bg-red-500 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );
};

export default ErrorComponent;
