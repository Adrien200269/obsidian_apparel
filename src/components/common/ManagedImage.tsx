"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useStore } from "@/lib/store-context";
import { cn } from "@/lib/utils";
import {
  Camera,
  Compass,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import { getVideoInfo, isVideoUrl } from "@/lib/video-utils";

interface ManagedImageProps {
  slotKey?: string;
  src?: string | null;
  alt?: string;
  slotName?: string;
  aspectRatio?: string; // e.g. "4/5", "16/9", "1/1", "21/9", "3/4"
  resolution?: string; // e.g. "1200×1500px"
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showInfo?: boolean;
  editorialBadge?: string;
  onClick?: () => void;
  fill?: boolean;
}

export const ManagedImage: React.FC<ManagedImageProps> = ({
  slotKey,
  src,
  alt = "Obsidian Apparel Editorial Slot",
  slotName,
  aspectRatio,
  resolution,
  className,
  imageClassName,
  priority = false,
  showInfo = true,
  editorialBadge = "OBSIDIAN APPAREL STUDIO // AWAITING ADMIN UPLOAD",
  onClick,
  fill = true,
}) => {
  const { getMediaSlot } = useStore();
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Look up slot data if slotKey is provided
  const slotData = slotKey ? getMediaSlot(slotKey) : undefined;

  // Determine actual image source: explicit src takes priority, then slot imageUrl
  const resolvedSrc = (src !== undefined ? src : slotData?.imageUrl) || null;
  const resolvedSlotName = slotName || slotData?.label || slotKey || "EDITORIAL_SLOT";
  const resolvedAspectRatio = aspectRatio || slotData?.aspectRatio || "4/5";
  const resolvedResolution = resolution || slotData?.resolution || "1200×1500px";

  // Comprehensive video intelligence
  const videoInfo = getVideoInfo(resolvedSrc);
  const isVideo = videoInfo.isVideo;

  // Handle direct video autoplay policy & playback
  useEffect(() => {
    if (!isVideo || videoInfo.provider !== "direct") return;
    const video = videoRef.current;
    if (!video || !resolvedSrc) return;

    // Critical for browser autoplay: set DOM properties directly
    video.defaultMuted = true;
    video.muted = isMuted;
    video.playsInline = true;

    const attemptPlay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay policy prevented playback: ensure muted & retry
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    };

    if (video.readyState >= 2) {
      setIsLoaded(true);
      attemptPlay();
    } else {
      const handleCanPlay = () => {
        setIsLoaded(true);
        attemptPlay();
      };
      video.addEventListener("canplay", handleCanPlay, { once: true });
      return () => video.removeEventListener("canplay", handleCanPlay);
    }
  }, [resolvedSrc, isVideo, videoInfo.provider]);

  // Check if media is already loaded / cached, and set a safety fallback
  useEffect(() => {
    setImageError(false);

    // Instant check for cached images
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    // Safety fallback: dismiss shimmer after 1.2s so user is never trapped in loading state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [resolvedSrc]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (videoInfo.provider === "direct") {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } else if (videoInfo.provider === "youtube") {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      const nextPlaying = !isPlaying;
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: nextPlaying ? "playVideo" : "pauseVideo",
          args: [],
        }),
        "*"
      );
      setIsPlaying(nextPlaying);
    } else if (videoInfo.provider === "vimeo") {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      const nextPlaying = !isPlaying;
      iframe.contentWindow.postMessage(
        JSON.stringify({
          method: nextPlaying ? "play" : "pause",
        }),
        "*"
      );
      setIsPlaying(nextPlaying);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoInfo.provider === "direct") {
      const video = videoRef.current;
      if (!video) return;
      video.muted = nextMuted;
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else if (videoInfo.provider === "youtube") {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: nextMuted ? "mute" : "unMute",
            args: [],
          }),
          "*"
        );
      }
    } else if (videoInfo.provider === "vimeo") {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            method: "setVolume",
            value: nextMuted ? 0 : 1,
          }),
          "*"
        );
      }
    }
  };

  // If we have a valid media source and it hasn't errored
  if (resolvedSrc && !imageError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-luga-surface dark:bg-luga-darkSurface group select-none",
          className
        )}
        style={{
          aspectRatio: resolvedAspectRatio ? resolvedAspectRatio.replace(":", "/") : undefined,
        }}
        onClick={onClick}
      >
        {/* Architectural Loading Skeleton Shimmer */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-luga-surface/90 dark:bg-luga-darkSurface/90 overflow-hidden pointer-events-none transition-opacity duration-300">
            {/* Architectural Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.10]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Continuous Diagonal Shimmer Beam */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 dark:via-white/5 to-transparent" />

            {/* Corner Framing Marks */}
            <div className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-luga-muted/40 dark:border-luga-darkMuted/40" />
            <div className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-luga-muted/40 dark:border-luga-darkMuted/40" />
            <div className="pointer-events-none absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-luga-muted/40 dark:border-luga-darkMuted/40" />
            <div className="pointer-events-none absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-luga-muted/40 dark:border-luga-darkMuted/40" />

            {/* Center Compass Reticle Pulse */}
            <div className="relative flex flex-col items-center gap-1.5 opacity-60">
              <Compass className="w-5 h-5 text-luga-crimson dark:text-luga-gold animate-spin-slow stroke-[1.2]" />
              <span className="font-mono text-[8px] tracking-mega uppercase text-luga-muted dark:text-luga-darkMuted">
                OBSIDIAN ARCHIVE
              </span>
            </div>
          </div>
        )}

        {isVideo ? (
          <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
            {videoInfo.provider === "direct" ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300 ease-out cursor-pointer",
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.01]",
                  "group-hover:scale-105",
                  imageClassName
                )}
                onClick={togglePlay}
                onLoadedData={() => setIsLoaded(true)}
                onCanPlay={() => setIsLoaded(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => {
                  const err = (e.currentTarget as HTMLVideoElement)?.error;
                  // Code 1 is MEDIA_ERR_ABORTED - never trigger error on abort
                  if (err && err.code === 1) return;
                  console.warn("Direct video playback notice:", resolvedSrc, err);
                  setImageError(true);
                }}
              >
                <source src={resolvedSrc} type={videoInfo.mimeType || "video/mp4"} />
                <source src={resolvedSrc} />
              </video>
            ) : (
              /* Embedded YouTube / Vimeo / Google Drive Video */
              <div className="relative w-full h-full overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={videoInfo.embedUrl!}
                  title={alt || resolvedSlotName}
                  className={cn(
                    "absolute inset-0 w-full h-full border-0 transition-opacity duration-500",
                    // Scale slightly to eliminate letterbox/pillarbox bars on cinematic ratios
                    "scale-[1.03] pointer-events-auto",
                    isLoaded ? "opacity-100" : "opacity-0",
                    imageClassName
                  )}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setIsLoaded(true)}
                />
              </div>
            )}

            {/* Video Audio & Playback Controls Overlay (Bottom Right) */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 bg-black/75 hover:bg-black text-white border border-white/20 transition-colors shadow-sm"
                title={isPlaying ? "Pause Video" : "Play Video"}
                aria-label="Toggle Play"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="p-1.5 bg-black/75 hover:bg-black text-white border border-white/20 transition-colors shadow-sm"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
                aria-label="Toggle Audio"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-luga-gold" />
                )}
              </button>

              {/* External Source Link (for YouTube / Vimeo) */}
              {(videoInfo.provider === "youtube" || videoInfo.provider === "vimeo") && (
                <a
                  href={videoInfo.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-black/75 hover:bg-black text-white border border-white/20 transition-colors shadow-sm"
                  title={`Open on ${videoInfo.providerLabel}`}
                  aria-label={`Open on ${videoInfo.providerLabel}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Large Center Play Overlay When Paused (Direct Video) */}
            {!isPlaying && isLoaded && videoInfo.provider === "direct" && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/80 text-white border border-white/30 hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            ref={imgRef}
            src={resolvedSrc}
            alt={alt || slotData?.altText || resolvedSlotName}
            decoding="async"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300 ease-out",
              isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.01]",
              "group-hover:scale-105",
              imageClassName
            )}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            loading={priority ? "eager" : "lazy"}
          />
        )}
        {/* Subtle Luxury Film Grain / Contrast Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
      </div>
    );
  }

  // Otherwise, render the sleek architectural editorial wireframe placeholder
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 select-none",
        "bg-[#F4F1EA] dark:bg-[#0D0D0D]",
        "border border-luga-border/80 dark:border-luga-darkBorder/80",
        "transition-colors duration-300",
        className
      )}
      style={{
        aspectRatio: resolvedAspectRatio ? resolvedAspectRatio.replace(":", "/") : undefined,
      }}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Diagonal Subtle Isometric Architectural Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Architectural Corner Framing Marks (L-Brackets) */}
      <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
      <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
      <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
      <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />

      {/* Top Header: Geographic Coordinates & Studio Badge */}
      <div className="relative z-10 w-full flex items-center justify-between text-[9px] sm:text-[10px] tracking-mega text-luga-muted/80 dark:text-luga-darkMuted/80 font-mono">
        <span className="flex items-center gap-1.5 uppercase">
          <Compass className="w-3 h-3 text-luga-crimson dark:text-luga-gold opacity-90 animate-pulse" />
          <span>KTM // 27.7172° N</span>
        </span>
        <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-luga-border dark:border-luga-darkBorder bg-luga-bg/60 dark:bg-luga-darkBg/60">
          RAW ARCHIVE
        </span>
      </div>

      {/* Center Reticle & Slot Identification */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-2 max-w-[90%]">
        {/* Architectural Crosshair Reticle */}
        <div className="relative mb-3 flex items-center justify-center w-12 h-12 rounded-full border border-dashed border-luga-muted/30 dark:border-luga-darkMuted/30">
          <div className="absolute w-6 h-[1px] bg-luga-muted/40 dark:border-luga-darkMuted/40" />
          <div className="absolute h-6 w-[1px] bg-luga-muted/40 dark:border-luga-darkMuted/40" />
          <Camera className="w-4 h-4 text-luga-muted/70 dark:text-luga-darkMuted/70" />
        </div>

        {/* Slot Name */}
        <div className="font-mono text-[10px] sm:text-xs font-semibold tracking-ultra uppercase text-luga-ink dark:text-luga-darkInk break-all">
          [{resolvedSlotName}]
        </div>

        {/* Awaiting Admin Upload Status Badge */}
        {showInfo && (
          <div className="mt-2.5 inline-flex items-center px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-mono tracking-wider uppercase border border-luga-crimson/30 dark:border-luga-gold/40 text-luga-crimson dark:text-luga-gold bg-luga-crimson/5 dark:bg-luga-gold/10">
            {editorialBadge}
          </div>
        )}
      </div>

      {/* Bottom Technical Spec Footer: Aspect Ratio & Recommended Resolution */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8.5px] sm:text-[9.5px] font-mono tracking-wider text-luga-muted/70 dark:text-luga-darkMuted/70 border-t border-luga-border/50 dark:border-luga-darkBorder/50 pt-2">
        <span className="uppercase">RATIO: {resolvedAspectRatio}</span>
        <span className="uppercase font-medium text-luga-ink/80 dark:text-luga-darkInk/80">
          {resolvedResolution}
        </span>
      </div>
    </div>
  );
};
