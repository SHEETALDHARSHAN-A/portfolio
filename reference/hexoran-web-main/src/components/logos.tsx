import React from 'react';

export const CelatoLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="celato-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
        <path d="M4 16 C4 9.37 9.37 4 16 4 C18.5 4 20.8 4.8 22.7 6.1" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 16 C28 22.63 22.63 28 16 28 C13.5 28 11.2 27.2 9.3 25.9" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
        <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
);

export const GeminiLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21.854 11.236C18.043 10.957 15.657 9.873 14.398 7.373C13.262 5.118 12.825 2.146 12.825 2.146L11.175 2.146C11.175 2.146 10.738 5.118 9.602 7.373C8.343 9.873 5.957 10.957 2.146 11.236V12.764C5.957 13.043 8.343 14.127 9.602 16.627C10.738 18.882 11.175 21.854 11.175 21.854H12.825C12.825 21.854 13.262 18.882 14.398 16.627C15.657 14.127 18.043 13.043 21.854 12.764V11.236Z" fill="url(#gemini-gradient)" />
        <defs>
            <linearGradient id="gemini-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4E75F6" />
                <stop offset="1" stopColor="#E94057" />
            </linearGradient>
        </defs>
    </svg>
);

export const GroqLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg viewBox="0 0 201 201" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path fill="#F54F35" d="M0 0h201v201H0V0Z" />
        <path fill="#FEFBFB" d="m128 49 1.895 1.52C136.336 56.288 140.602 64.49 142 73c.097 1.823.148 3.648.161 5.474l.03 3.247.012 3.482.017 3.613c.01 2.522.016 5.044.02 7.565.01 3.84.041 7.68.072 11.521.007 2.455.012 4.91.016 7.364l.038 3.457c-.033 11.717-3.373 21.83-11.475 30.547-4.552 4.23-9.148 7.372-14.891 9.73l-2.387 1.055c-9.275 3.355-20.3 2.397-29.379-1.13-5.016-2.38-9.156-5.17-13.234-8.925 3.678-4.526 7.41-8.394 12-12l3.063 2.375c5.572 3.958 11.135 5.211 17.937 4.625 6.96-1.384 12.455-4.502 17-10 4.174-6.784 4.59-12.222 4.531-20.094l.012-3.473c.003-2.414-.005-4.827-.022-7.241-.02-3.68 0-7.36.026-11.04-.003-2.353-.008-4.705-.016-7.058l.025-3.312c-.098-7.996-1.732-13.21-6.681-19.47-6.786-5.458-13.105-8.211-21.914-7.792-7.327 1.188-13.278 4.7-17.777 10.601C75.472 72.012 73.86 78.07 75 85c2.191 7.547 5.019 13.948 12 18 5.848 3.061 10.892 3.523 17.438 3.688l2.794.103c2.256.082 4.512.147 6.768.209v16c-16.682.673-29.615.654-42.852-10.848-8.28-8.296-13.338-19.55-13.71-31.277.394-9.87 3.93-17.894 9.562-25.875l1.688-2.563C84.698 35.563 110.05 34.436 128 49Z" />
    </svg>
);

export const SaveTuneLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M50 20 C70 20 80 35 80 50" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
        <path d="M50 20 V70" stroke="#06b6d4" strokeWidth="10" strokeLinecap="round" />
        <path d="M30 50 L50 70 L70 50" stroke="#06b6d4" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
