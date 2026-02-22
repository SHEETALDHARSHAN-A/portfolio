"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
    className?: string;
    containerRef: React.RefObject<HTMLElement>; // Container ref
    fromRef: React.RefObject<HTMLElement>;
    toRef: React.RefObject<HTMLElement>;
    curvature?: number;
    reverse?: boolean; // back to front
    duration?: number;
    delay?: number;
    pathColor?: string;
    pathWidth?: number;
    pathOpacity?: number;
    gradientStartColor?: string;
    gradientStopColor?: string;
    dotColor?: string;
}

export const AnimatedBeam = ({
    className,
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
    duration = Math.random() * 3 + 2,
    delay = 0,
    pathColor = "gray",
    pathWidth = 2,
    pathOpacity = 0.2,
    gradientStartColor = "#ffaa40",
    gradientStopColor = "#9c40ff",
    dotColor = "#ffffff",
}: AnimatedBeamProps) => {
    const id = useId();
    const [path, setPath] = useState("");
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

    // Calculate the path between two elements
    useEffect(() => {
        const updatePath = () => {
            if (containerRef.current && fromRef.current && toRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const rectA = fromRef.current.getBoundingClientRect();
                const rectB = toRef.current.getBoundingClientRect();

                const svgWidth = containerRect.width;
                const svgHeight = containerRect.height;
                setSvgDimensions({ width: svgWidth, height: svgHeight });

                const startX = rectA.left - containerRect.left + rectA.width / 2;
                const startY = rectA.top - containerRect.top + rectA.height / 2;
                const endX = rectB.left - containerRect.left + rectB.width / 2;
                const endY = rectB.top - containerRect.top + rectB.height / 2;

                const controlY = startY + curvature;
                const d = `M ${startX},${startY} Q ${(startX + endX) / 2
                    },${controlY} ${endX},${endY}`;
                setPath(d);
            }
        };

        const resizeObserver = new ResizeObserver(() => updatePath());
        containerRef.current && resizeObserver.observe(containerRef.current);

        updatePath();

        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef, fromRef, toRef, curvature]);

    return (
        <svg
            fill="none"
            width={svgDimensions.width}
            height={svgDimensions.height}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
                className,
            )}
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        >
            <path
                d={path}
                stroke={pathColor}
                strokeWidth={pathWidth}
                strokeOpacity={pathOpacity}
                strokeLinecap="round"
            />
            <path
                d={path}
                stroke={`url(#${id})`}
                strokeWidth={pathWidth}
                strokeOpacity="1"
                strokeLinecap="round"
            />
            <defs>
                <motion.linearGradient
                    className="transform-gpu"
                    id={id}
                    gradientUnits="userSpaceOnUse"
                    initial={{
                        x1: "0%",
                        x2: "0%",
                        y1: "0%",
                        y2: "0%",
                    }}
                    animate={{
                        x1: reverse ? ["90%", "-10%"] : ["10%", "110%"],
                        x2: reverse ? ["100%", "0%"] : ["0%", "100%"],
                        y1: reverse ? ["90%", "-10%"] : ["10%", "110%"],
                        y2: reverse ? ["100%", "0%"] : ["0%", "100%"],
                    }}
                    transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <stop stopColor={gradientStartColor} stopOpacity="0" />
                    <stop stopColor={gradientStartColor} />
                    <stop offset="0.5" stopColor={gradientStopColor} />
                    <stop offset="1" stopColor={gradientStopColor} stopOpacity="0" />
                </motion.linearGradient>
            </defs>
        </svg>
    );
};
