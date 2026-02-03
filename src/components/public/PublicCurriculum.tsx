"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  CheckCircle,
} from "lucide-react";

interface Props {
  chapters: any[];
  enrollmentStatus?: string | null;
  isAdmin?: boolean; // New prop for Admin Review
}

export const PublicCurriculum = ({
  chapters,
  enrollmentStatus,
  isAdmin = false,
}: Props) => {
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isEnrolled = enrollmentStatus === "active";

  const handleVideoClick = (url: string, isPreview: boolean) => {
    // Admins can watch EVERYTHING. Users check enrollment or preview status.
    if (isAdmin || isEnrolled || isPreview) {
      setPlayingVideo(url);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${getYoutubeId(playingVideo)}?autoplay=1`}
              title="Course Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-slate-900">Course Content</h2>
        <span className="text-sm text-slate-500 font-medium">
          {chapters.reduce((acc, ch) => acc + ch.videos.length, 0)} Lessons
        </span>
      </div>

      <div className="border border-slate-200 bg-white rounded-lg overflow-hidden">
        {chapters.map((chapter, idx) => (
          <div key={idx} className="border-b border-slate-100 last:border-0">
            <button
              onClick={() => setOpenChapter(openChapter === idx ? null : idx)}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {openChapter === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
                <span className="font-bold text-slate-900 text-left text-sm">
                  {chapter.title}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {chapter.videos.length} lectures
              </span>
            </button>

            {openChapter === idx && (
              <div className="bg-white">
                {chapter.videos.map((video: any, vIdx: number) => {
                  // Determine if locked
                  const isLocked = !isAdmin && !isEnrolled && !video.isPreview;

                  return (
                    <div
                      key={vIdx}
                      onClick={() =>
                        !isLocked &&
                        handleVideoClick(video.url, video.isPreview)
                      }
                      className={`px-6 py-3 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0
                        ${isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-50"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-slate-900 group-hover:text-blue-600 transition-colors" />
                        )}
                        <span
                          className={`text-sm ${isLocked ? "text-slate-500" : "text-slate-700 font-medium group-hover:text-blue-700"}`}
                        >
                          {video.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Admin Badge */}
                        {isAdmin && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 border border-slate-100 rounded">
                            Admin View
                          </span>
                        )}
                        {/* Preview Badge */}
                        {!isEnrolled && video.isPreview && !isAdmin && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider px-2 py-0.5 bg-emerald-50 rounded">
                            <Eye className="w-3 h-3" /> Preview
                          </span>
                        )}
                        <span className="text-xs text-slate-400">10:00</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
