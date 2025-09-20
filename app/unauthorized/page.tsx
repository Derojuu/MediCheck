"use client";

import { useClerk } from "@clerk/nextjs";   

import { authRoutes } from "@/utils";
import { AlertTriangle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const UnauthorizedPage = () => {
    const { signOut } = useClerk();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-500/6 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-red-500/8 rounded-full blur-lg transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-primary/10 shadow-lg rounded-2xl p-10 text-center max-w-md hover:shadow-xl transition-all duration-300 relative z-10">
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-16 h-16 text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Oops! 🚫</h1>
                <p className="text-lg text-slate-600 mb-6">
                    Looks like you wandered into restricted territory.
                    Don't worry, we still love you... just not here. 😅
                </p>
                <button
                    className="mt-2 px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    onClick={() => signOut({ redirectUrl: authRoutes.login })}
                >
                    Sign Out & Apologize
                </button>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Or <span className="cursor-pointer hover:text-primary transition-colors duration-200">call Batman</span> for backup.
                </p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
