"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Video,
  GripVertical,
  Save,
  X,
  Check,
  FileText,
  List,
  User,
  Image as ImageIcon,
  DollarSign,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

// --- Types ---

interface Video {
  title: string;
  url: string;
  isPreview: boolean; // For public demo access
}

interface Chapter {
  title: string;
  videos: Video[];
}

interface CourseFormProps {
  initialData?: any;
}

export const CourseForm = ({ initialData }: CourseFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- Data Sources ---
  const [availableInstructors, setAvailableInstructors] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, catRes] = await Promise.all([
          fetch("/api/instructors"),
          fetch("/api/categories"),
        ]);

        if (instRes.ok) setAvailableInstructors(await instRes.json());
        if (catRes.ok) setAvailableCategories(await catRes.json());
      } catch (err) {
        console.error("Failed to load dependency data", err);
      }
    };
    fetchData();
  }, []);

  // --- Instructor Selection Logic ---
  // Helper: Extract IDs if data is populated object, else use as string.
  // Filters out invalid ObjectIds to prevent database CastErrors.
  const getInitialInstructorIds = () => {
    if (!initialData?.instructors) return [];
    return initialData.instructors
      .map((inst: any) => (typeof inst === "object" ? inst._id : inst))
      .filter(
        (id: string) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id),
      );
  };

  const [selectedInstructors, setSelectedInstructors] = useState<string[]>(
    getInitialInstructorIds(),
  );

  const toggleInstructor = (id: string) => {
    if (selectedInstructors.includes(id)) {
      setSelectedInstructors(selectedInstructors.filter((i) => i !== id));
    } else {
      setSelectedInstructors([...selectedInstructors, id]);
    }
  };

  // --- Main Form State ---
  const initialCategoryId =
    typeof initialData?.category === "object"
      ? initialData.category._id
      : initialData?.category || "";

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    thumbnail: initialData?.thumbnail || "",
    category: initialCategoryId,
    price: initialData?.price || 0,
    status: initialData?.status || "Draft",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",

    // Includes Section Defaults
    incHours: initialData?.courseIncludes?.hours || 0,
    incArticles: initialData?.courseIncludes?.articles || 0,
    incDownloads: initialData?.courseIncludes?.downloads || 0,
    incMobile: initialData?.courseIncludes?.mobileAccess ?? true,
    incCertificate: initialData?.courseIncludes?.certificate ?? true,
    incCaptions: initialData?.courseIncludes?.closedCaptions ?? true,
  });

  // --- Dynamic Lists (Outcomes, Requirements) ---
  const [outcomes, setOutcomes] = useState<string[]>(
    initialData?.learningOutcomes || [""],
  );
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [""],
  );

  // --- Curriculum State ---
  const [chapters, setChapters] = useState<Chapter[]>(
    initialData?.chapters || [
      {
        title: "Introduction",
        videos: [{ title: "Welcome to the course", url: "", isPreview: true }],
      },
    ],
  );

  // --- Helpers for Dynamic Lists ---
  const handleListChange = (
    setter: any,
    list: string[],
    index: number,
    value: string,
  ) => {
    const newList = [...list];
    newList[index] = value;
    setter(newList);
  };
  const addListItem = (setter: any, list: string[]) => setter([...list, ""]);
  const removeListItem = (setter: any, list: string[], index: number) =>
    setter(list.filter((_, i) => i !== index));

  // --- Curriculum Logic (Deep Updates) ---

  const addChapter = () => {
    setChapters([...chapters, { title: "New Chapter", videos: [] }]);
  };

  const removeChapter = (idx: number) => {
    if (confirm("Are you sure? This will delete all videos in this chapter.")) {
      setChapters(chapters.filter((_, i) => i !== idx));
    }
  };

  const updateChapterTitle = (idx: number, title: string) => {
    const newChapters = chapters.map((ch, i) =>
      i === idx ? { ...ch, title } : ch,
    );
    setChapters(newChapters);
  };

  const addVideo = (chapterIdx: number) => {
    const newChapters = chapters.map((ch, i) => {
      if (i === chapterIdx) {
        return {
          ...ch,
          videos: [...ch.videos, { title: "", url: "", isPreview: false }],
        };
      }
      return ch;
    });
    setChapters(newChapters);
  };

  const removeVideo = (chapterIdx: number, videoIdx: number) => {
    const newChapters = chapters.map((ch, i) => {
      if (i === chapterIdx) {
        return { ...ch, videos: ch.videos.filter((_, j) => j !== videoIdx) };
      }
      return ch;
    });
    setChapters(newChapters);
  };

  const updateVideo = (
    chapterIdx: number,
    videoIdx: number,
    field: keyof Video,
    value: any,
  ) => {
    const newChapters = chapters.map((ch, cIdx) => {
      if (cIdx === chapterIdx) {
        return {
          ...ch,
          videos: ch.videos.map((v, vIdx) => {
            if (vIdx === videoIdx) return { ...v, [field]: value };
            return v;
          }),
        };
      }
      return ch;
    });
    setChapters(newChapters);
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!initialData?._id;
    const url = isEdit ? `/api/courses/${initialData._id}` : "/api/courses";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...formData,
      instructors: selectedInstructors,
      learningOutcomes: outcomes.filter((o) => o.trim() !== ""),
      requirements: requirements.filter((r) => r.trim() !== ""),
      courseIncludes: {
        hours: Number(formData.incHours),
        articles: Number(formData.incArticles),
        downloads: Number(formData.incDownloads),
        mobileAccess: formData.incMobile,
        certificate: formData.incCertificate,
        closedCaptions: formData.incCaptions,
      },
      chapters,
      price: Number(formData.price),
      revenue: initialData?.revenue || "$0",
      enrollments: initialData?.enrollments || 0,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/courses");
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error("Failed to save course:", errorData);
        alert(`Error: ${errorData.error || "Failed to save course"}`);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between sticky top-0 bg-[#F8FAFC]/95 backdrop-blur z-20 py-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            {initialData ? "Edit Course" : "Create New Course"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Design your professional curriculum.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Course
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">
                Basic Information
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Course Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                placeholder="e.g. Masterclass in Advanced Endodontics"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Thumbnail URL (Unsplash)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>
              {formData.thumbnail && (
                <div className="mt-3 aspect-video w-48 rounded overflow-hidden border border-slate-200">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Short Description
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 transition-colors resize-none"
                placeholder="A brief summary shown on course cards..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Detailed Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                placeholder="Comprehensive details about the course content, methodology, and goals..."
              />
            </div>
          </Card>

          {/* Learning Outcomes */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Check className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">
                What you'll learn
              </h3>
            </div>
            <div className="space-y-3">
              {outcomes.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListChange(
                        setOutcomes,
                        outcomes,
                        idx,
                        e.target.value,
                      )
                    }
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                    placeholder="e.g. Perform complex root canal treatments..."
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setOutcomes, outcomes, idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(setOutcomes, outcomes)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Outcome
              </button>
            </div>
          </Card>

          {/* Curriculum Builder */}
          <Card className="space-y-4 bg-slate-50/50">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <List className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">Curriculum</h3>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-white border border-slate-200 shadow-sm"
                >
                  <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => updateChapterTitle(cIdx, e.target.value)}
                      className="bg-transparent border-none font-semibold text-slate-700 focus:outline-none w-full text-sm"
                      placeholder="Chapter Title"
                    />
                    <button
                      type="button"
                      onClick={() => removeChapter(cIdx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    {chapter.videos.map((video, vIdx) => (
                      <div key={vIdx} className="flex gap-2 items-center pl-2">
                        <Video className="w-4 h-4 text-slate-300" />

                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) =>
                            updateVideo(cIdx, vIdx, "title", e.target.value)
                          }
                          className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                          placeholder="Lesson Title"
                        />
                        <input
                          type="text"
                          value={video.url}
                          onChange={(e) =>
                            updateVideo(cIdx, vIdx, "url", e.target.value)
                          }
                          className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-400 text-blue-600"
                          placeholder="Video URL"
                        />

                        {/* Preview Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            updateVideo(
                              cIdx,
                              vIdx,
                              "isPreview",
                              !video.isPreview,
                            )
                          }
                          className={`p-1.5 rounded transition-colors ${video.isPreview ? "bg-emerald-100 text-emerald-600" : "text-slate-300 hover:text-emerald-500"}`}
                          title="Toggle Free Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeVideo(cIdx, vIdx)}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addVideo(cIdx)}
                      className="ml-7 mt-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Lesson
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addChapter}
                className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 font-medium text-sm flex items-center justify-center gap-2 bg-white"
              >
                <Plus className="w-4 h-4" /> Add New Chapter
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings & Metadata (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Price */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Pricing
              </h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Price (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </Card>

          {/* Publish Settings */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Publish Settings
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400"
              >
                <option value="">Select Category</option>
                {availableCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Review">In Review</option>
              </select>
            </div>
          </Card>

          {/* Instructors Selector */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Instructors
              </h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {availableInstructors.map((inst) => (
                <label
                  key={inst._id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(inst._id)}
                    onChange={() => toggleInstructor(inst._id)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                  />
                  <div className="flex items-center gap-3">
                    {inst.image ? (
                      <img
                        src={inst.image}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {inst.name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-slate-700 block leading-tight">
                        {inst.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {inst.email}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
              {availableInstructors.length === 0 && (
                <p className="text-xs text-slate-400 italic p-2 text-center">
                  No instructors found. Create one first.
                </p>
              )}
            </div>
          </Card>

          {/* Requirements */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Requirements
            </h3>
            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleListChange(
                        setRequirements,
                        requirements,
                        idx,
                        e.target.value,
                      )
                    }
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
                    placeholder="e.g. Basic DDS degree..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeListItem(setRequirements, requirements, idx)
                    }
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(setRequirements, requirements)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Requirement
              </button>
            </div>
          </Card>

          {/* Course Includes Properties */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              The Course Includes
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Duration (Hrs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.incHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incHours: e.target.value as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Articles
                </label>
                <input
                  type="number"
                  value={formData.incArticles}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incArticles: e.target.value as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Resources
                </label>
                <input
                  type="number"
                  value={formData.incDownloads}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incDownloads: e.target.value as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.incMobile}
                  onChange={(e) =>
                    setFormData({ ...formData, incMobile: e.target.checked })
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Access on mobile and TV
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.incCertificate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incCertificate: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Certificate of completion
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.incCaptions}
                  onChange={(e) =>
                    setFormData({ ...formData, incCaptions: e.target.checked })
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Closed captions
              </label>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};
