"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";

interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
}

export default function YouTube({
  id,
  title = "Video Tutorial",
  start = 0,
}: YouTubeProps) {
  const [play, setPlay] = useState(false);

  const thumbnail = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&start=${start}&rel=0`;

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
      {play ? (
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlay(true)}
          className="group relative block w-full overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110">
              <Play
                className="ml-1 h-10 w-10 fill-white text-white"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </button>
      )}

      <div className="flex items-center justify-between gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Watch this video tutorial without leaving the page.
          </p>
        </div>

        {!play && (
          <button
            onClick={() => setPlay(true)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Watch Video
            <ExternalLink size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
