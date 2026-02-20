import { ImageResponse } from 'next/og'

// Route segment config - use edge for faster generation
export const runtime = 'edge'

// Image metadata - 192x192 is the standard for favicon
export const size = {
    width: 192,
    height: 192,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0a0a',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M35 20 H15 L5 50 L15 80 H35"
                        stroke="#7c3aed"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M65 20 H85 L95 50 L85 80 H65"
                        stroke="#7c3aed"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M25 50 H75"
                        stroke="#06b6d4"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        ),
        { ...size }
    )
}