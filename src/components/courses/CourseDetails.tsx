"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  PlayCircle,
  Check,
  FileText,
  Download,
  Smartphone,
  Award,
  Subtitles,
  User,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface CourseDetailsProps {
  course: any;
}

export const CourseDetails = ({ course }: CourseDetailsProps) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* Video Modal Overlay */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
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

      {/* Top Navigation & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            href="/admin/courses"
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-light text-slate-900">
              {course.title}
            </h1>
            <Badge type={course.status}>{course.status}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-2 text-slate-600">
            <span className="text-sm">Created by:</span>
            {course.instructors && course.instructors.length > 0 ? (
              course.instructors.map((inst: any, idx: number) => {
                const name = typeof inst === "object" ? inst.name : "Unknown";
                const image = typeof inst === "object" ? inst.image : null;

                return (
                  <span
                    key={idx}
                    className="text-sm font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-2 border border-slate-200"
                  >
                    {image ? (
                      <img
                        src={image}
                        className="w-4 h-4 rounded-full object-cover"
                        alt=""
                      />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    {name}
                  </span>
                );
              })
            ) : (
              <span className="text-sm font-medium text-slate-900">
                Unassigned
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/admin/courses/${course._id}/edit`}
          className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          Edit Course Content
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Description & Outcomes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thumbnail Display */}
          {course.thumbnail && (
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          )}

          {/* Short Description */}
          {course.shortDescription && (
            <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-slate-900 pl-4 py-1">
              {course.shortDescription}
            </p>
          )}

          {/* What you'll learn */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                What you'll learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-slate-900 mt-1 shrink-0" />
                    <span className="text-sm text-slate-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Content (Curriculum) */}
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-slate-900">
              Course Content
            </h2>
            <div className="space-y-4">
              {course.chapters?.map((chapter: any, cIdx: number) => (
                <div key={cIdx} className="bg-white border border-slate-200">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100 font-medium text-slate-900 flex justify-between items-center">
                    <span>{chapter.title}</span>
                    <span className="text-xs text-slate-500 font-normal bg-white px-2 py-1 border border-slate-200 rounded-full">
                      {chapter.videos.length} Lessons
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {chapter.videos?.map((video: any, vIdx: number) => (
                      <div
                        key={vIdx}
                        className="p-3 pl-4 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors group"
                      >
                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="flex-1 text-slate-700 font-medium">
                          {video.title}
                        </span>
                        {video.url ? (
                          <button
                            onClick={() => setPlayingVideo(video.url)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Watch Video
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            No video source
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-light text-slate-900">
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-2">
                {course.requirements.map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Long Description */}
          {course.description && (
            <div className="space-y-3">
              <h2 className="text-xl font-light text-slate-900">Description</h2>
              <div className="prose prose-slate text-sm text-slate-600 max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Includes & Metadata */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 border-slate-200 shadow-sm sticky top-24">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                This course includes:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    {course.courseIncludes?.hours || 0} hours on-demand video
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>{course.courseIncludes?.articles || 0} articles</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>
                    {course.courseIncludes?.downloads || 0} downloadable
                    resources
                  </span>
                </div>
                {(course.courseIncludes?.mobileAccess ?? true) && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <span>Access on mobile and TV</span>
                  </div>
                )}
                {(course.courseIncludes?.closedCaptions ?? true) && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Subtitles className="w-4 h-4 text-slate-400" />
                    <span>Closed captions</span>
                  </div>
                )}
                {(course.courseIncludes?.certificate ?? true) && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Certificate of completion</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-0 border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Business Data
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">
                  Total Enrollments
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {course.enrollments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Revenue</span>
                <span className="text-sm font-bold text-emerald-600">
                  {course.revenue}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Category</span>
                <span className="text-sm font-medium text-slate-900">
                  {course.category}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
