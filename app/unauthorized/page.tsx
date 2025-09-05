"use client";

import { useClerk } from "@clerk/nextjs";
import { authRoutes } from "@/utils";
import { AlertTriangle } from "lucide-react";

const UnauthorizedPage = () => {
    const { signOut } = useClerk();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 text-slate-900 px-6">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-primary/10 shadow-lg rounded-2xl p-10 text-center max-w-md hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-16 h-16 text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Oops! 🚫</h1>
                <p className="text-lg text-slate-600 mb-6">
                    Looks like you wandered into restricted territory.
                    Don’t worry, we still love you... just not here. 😅
                </p>
                <button
                    className="mt-2 px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => signOut({ redirectUrl: authRoutes.login })}
                >
                    Sign Out & Apologize
                </button>
                <p className="mt-4 text-sm text-slate-500">
                    Or <span className="cursor-pointer hover:text-primary transition-colors duration-200">call Batman</span> for backup.
                </p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
