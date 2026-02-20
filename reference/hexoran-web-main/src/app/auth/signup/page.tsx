"use client";

import { AuthPageForm } from '@/components/auth/AuthPageForm';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

            <div className="z-10 w-full flex justify-center">
                <AuthPageForm initialMode="signup" />
            </div>
        </div>
    );
}
