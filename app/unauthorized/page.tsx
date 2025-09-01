"use client";

import { useClerk } from "@clerk/nextjs";
import { authRoutes } from "@/utils";
import { AlertTriangle } from "lucide-react";

const UnauthorizedPage = () => {
    const { signOut } = useClerk();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6">
            <div className="bg-gray-800 shadow-lg rounded-2xl p-10 text-center max-w-md">
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-16 h-16 text-yellow-400" />
                </div>
                <h1 className="text-3xl font-extrabold mb-2">Oops! 🚫</h1>
                <p className="text-lg text-gray-300 mb-6">
                    Looks like you wandered into restricted territory.
                    Don’t worry, we still love you... just not here. 😅
                </p>
                <button
                    className="mt-2 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
                    onClick={() => signOut({ redirectUrl: authRoutes.login })}
                >
                    Sign Out & Apologize
                </button>
                <p className="mt-4 text-sm text-gray-400">
                    Or <span className="cursor-pointer hover:text-white">call Batman</span> for backup.
                </p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
