"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface CityTime {
    city: string;
    timezone: string;
    status: "Active" | "Standby";
    color: string;
}

const cities: CityTime[] = [
    { city: "New York", timezone: "America/New_York", status: "Active", color: "bg-emerald-500" },
    { city: "London", timezone: "Europe/London", status: "Standby", color: "bg-amber-500" },
    { city: "Mumbai", timezone: "Asia/Kolkata", status: "Active", color: "bg-emerald-500" },
    { city: "Tokyo", timezone: "Asia/Tokyo", status: "Active", color: "bg-emerald-500" },
];

const CityCard = ({ city, timezone, status, color }: CityTime) => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeStr = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(now);
            setTime(timeStr);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [timezone]);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all cursor-default overflow-hidden"
        >
            {/* Background Gradient Glow */}
            <div className={`absolute -right-4 -top-4 w-12 h-12 ${color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />

            <div className="flex flex-col gap-1 relative z-10">
                <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{city}</span>
                </div>
                <span className="text-xl md:text-2xl font-mono font-medium text-foreground tracking-tighter tabular-nums">
                    {time}
                </span>
            </div>

            <div className="flex flex-col items-end gap-2 relative z-10">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_rgba(34,197,94,0.6)]`}
                    />
                    <span className="text-[9px] font-medium text-muted-foreground leading-none">{status}</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-4 h-1 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                className={`w-full h-full ${color} opacity-40`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export const GlobalPulse = () => {
    return (
        <div className="relative w-full h-full flex flex-col justify-center p-6 md:p-8 gap-3 md:gap-4 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                {cities.map((city) => (
                    <CityCard key={city.city} {...city} />
                ))}
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <div className="text-[80px] font-black leading-none select-none">UTC</div>
            </div>

            {/* Mission Control Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
            />
        </div>
    );
};
