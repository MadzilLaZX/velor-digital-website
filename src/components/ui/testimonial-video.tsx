"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestimonialVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-[1.75rem] border border-hairline bg-black",
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={toggle}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="h-full w-full cursor-pointer object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex p-4 sm:p-5",
          isPlaying ? "items-start justify-start" : "items-center justify-center"
        )}
      >
        <motion.button
          layout
          onClick={toggle}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={cn(
            "focus-ring pointer-events-auto flex items-center justify-center rounded-full bg-white/90 text-background shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:bg-white",
            isPlaying ? "h-10 w-10" : "h-16 w-16"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying ? (
              <motion.span
                key="pause"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" strokeWidth={0} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
