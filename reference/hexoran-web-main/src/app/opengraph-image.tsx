
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'Hexoran | Intelligence, Structured'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default function Image() {
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
                <div style={{ display: 'flex', width: '300px', height: '300px' }}>
                    <svg
                        width="100%"
                        height="100%"
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
            </div>
        ),
        {
            ...size,
        }
    )
}
