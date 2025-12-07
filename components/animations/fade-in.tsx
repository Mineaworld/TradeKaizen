"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    duration?: number;
}

export default function FadeIn({
    children,
    delay = 0,
    direction = "up",
    className = "",
    duration = 0.5,
}: FadeInProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const directionOffset = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directionOffset[direction],
            }}
            animate={
                isInView
                    ? {
                        opacity: 1,
                        x: 0,
                        y: 0,
                    }
                    : {}
            }
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
