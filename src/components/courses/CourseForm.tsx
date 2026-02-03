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

interface Video {
  title: string;
  url: string;
  isPreview: boolean;
}

interface Chapter {
  title: string;
  videos: Video[];
}

interface CourseFormProps {
  initialData?: any;
  userRole?: "admin" | "instructor";
}

export const CourseForm = ({
  initialData,
  userRole = "instructor",
}: CourseFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableInstructors, setAvailableInstructors] = useState<any[]>([]);

  const isReadOnly = userRole === "admin";

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, instRes] = await Promise.all([
          fetch("/api/categories?type=course"),
          fetch("/api/instructors"),
        ]);
        if (catRes.ok) setAvailableCategories(await catRes.json());
        if (instRes.ok) setAvailableInstructors(await instRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // --- Form State ---
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
    incHours: initialData?.courseIncludes?.hours || 0,
    incArticles: initialData?.courseIncludes?.articles || 0,
    incDownloads: initialData?.courseIncludes?.downloads || 0,
    incMobile: initialData?.courseIncludes?.mobileAccess ?? true,
    incCertificate: initialData?.courseIncludes?.certificate ?? true,
    incCaptions: initialData?.courseIncludes?.closedCaptions ?? true,
  });

  const [chapters, setChapters] = useState<Chapter[]>(
    initialData?.chapters || [
      {
        title: "Introduction",
        videos: [{ title: "Welcome", url: "", isPreview: true }],
      },
    ],
  );

  const [outcomes, setOutcomes] = useState<string[]>(
    initialData?.learningOutcomes || [""],
  );
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [""],
  );

  // Instructors Selection (Invitation)
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

  // --- Handlers ---
  const handleInputChange = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleInstructor = (id: string) => {
    if (selectedInstructors.includes(id)) {
      setSelectedInstructors(selectedInstructors.filter((i) => i !== id));
    } else {
      setSelectedInstructors([...selectedInstructors, id]);
    }
  };

  // Dynamic Lists Helpers
  const handleListChange = (
    setter: any,
    list: string[],
    idx: number,
    val: string,
  ) => {
    const n = [...list];
    n[idx] = val;
    setter(n);
  };
  const addListItem = (setter: any, list: string[]) => setter([...list, ""]);
  const removeListItem = (setter: any, list: string[], idx: number) =>
    setter(list.filter((_, i) => i !== idx));

  // Chapter Helpers
  const addChapter = () =>
    setChapters([...chapters, { title: "New Chapter", videos: [] }]);
  const removeChapter = (idx: number) =>
    setChapters(chapters.filter((_, i) => i !== idx));
  const updateChapterTitle = (idx: number, val: string) => {
    const n = [...chapters];
    n[idx].title = val;
    setChapters(n);
  };

  // Video Helpers
  const addVideo = (cIdx: number) => {
    const n = [...chapters];
    n[cIdx].videos.push({ title: "", url: "", isPreview: false });
    setChapters(n);
  };
  const removeVideo = (cIdx: number, vIdx: number) => {
    const n = [...chapters];
    n[cIdx].videos.splice(vIdx, 1);
    setChapters(n);
  };
  const updateVideo = (
    cIdx: number,
    vIdx: number,
    field: keyof Video,
    val: any,
  ) => {
    const n = [...chapters];
    n[cIdx].videos[vIdx][field] = val;
    setChapters(n);
  };

  // --- Submission ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    setLoading(true);

    try {
      const url = initialData?._id
        ? `/api/courses/${initialData._id}`
        : "/api/courses";
      const method = initialData?._id ? "PUT" : "POST";

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
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/instructor/courses");
        router.refresh();
      } else {
        alert("Failed to save course.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-8 max-w-6xl mx-auto pb-20 relative"
    >
      {/* Header */}
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
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
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
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              Basic Info
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Thumbnail URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      handleInputChange("thumbnail", e.target.value)
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    placeholder="Unsplash URL"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              What you'll learn
            </h3>
            <div className="space-y-2">
              {outcomes.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListChange(setOutcomes, outcomes, i, e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(setOutcomes, outcomes, i)}
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(setOutcomes, outcomes)}
                className="text-xs font-bold text-blue-600 uppercase flex gap-1 items-center"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
          </Card>

          <Card className="space-y-4 bg-slate-50/50">
            <h3 className="text-lg font-medium text-slate-900 pb-2">
              Curriculum
            </h3>
            {chapters.map((chapter, cIdx) => (
              <div
                key={cIdx}
                className="bg-white border border-slate-200 shadow-sm"
              >
                <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => updateChapterTitle(cIdx, e.target.value)}
                    className="bg-transparent border-none font-semibold text-slate-700 w-full text-sm focus:outline-none"
                    placeholder="Chapter Title"
                  />
                  <button type="button" onClick={() => removeChapter(cIdx)}>
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  {chapter.videos.map((vid, vIdx) => (
                    <div key={vIdx} className="flex items-center gap-2 pl-2">
                      <Video className="w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={vid.title}
                        onChange={(e) =>
                          updateVideo(cIdx, vIdx, "title", e.target.value)
                        }
                        className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={vid.url}
                        onChange={(e) =>
                          updateVideo(cIdx, vIdx, "url", e.target.value)
                        }
                        className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs focus:outline-none text-blue-600"
                        placeholder="URL"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateVideo(cIdx, vIdx, "isPreview", !vid.isPreview)
                        }
                        className={`p-1.5 rounded ${vid.isPreview ? "bg-emerald-100 text-emerald-600" : "text-slate-300"}`}
                        title="Free Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVideo(cIdx, vIdx)}
                      >
                        <X className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addVideo(cIdx)}
                    className="ml-7 mt-2 text-[10px] font-bold text-slate-500 uppercase flex gap-1 items-center"
                  >
                    <Plus className="w-3 h-3" /> Add Lesson
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addChapter}
              className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 font-medium text-sm flex justify-center gap-2 bg-white"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
              >
                <option value="">Select...</option>
                {availableCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Price ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Review">Submit for Review</option>
              </select>
            </div>
          </Card>

          {/* Invite Instructors */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Invite Instructors
              </h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {availableInstructors.map((inst) => (
                <label
                  key={inst._id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 border border-transparent rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(inst._id)}
                    onChange={() => toggleInstructor(inst._id)}
                    className="rounded border-slate-300 text-slate-900"
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
                    <span className="text-sm font-medium text-slate-700">
                      {inst.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};
