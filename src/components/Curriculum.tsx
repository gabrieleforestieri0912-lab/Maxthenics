"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  BookOpen,
  Dumbbell,
  Target,
  Zap,
  Lock,
  ChevronDown,
  ListVideo,
  GraduationCap,
  Check,
} from "lucide-react";
import type { LessonKind, ProgramCurriculum } from "../data/curriculum";
import { useLanguage } from "../context/LanguageContext";

const KIND_ICON: Record<LessonKind, React.ElementType> = {
  intro: GraduationCap,
  theory: BookOpen,
  anatomy: BookOpen,
  technique: Target,
  plan: ListVideo,
  workout: Dumbbell,
  video: Play,
  tips: Zap,
};

interface CurriculumProps {
  curriculum: ProgramCurriculum;
  /** Sales-page mode: descriptions hidden, non-free lessons locked. */
  preview?: boolean;
  /** Member-area navigation callbacks. */
  onOpenWorkout?: () => void;
  onOpenExercise?: (exerciseId?: string) => void;
  /** Completed lesson ids (member area). Enables progress + checkmarks. */
  progress?: Set<string>;
  onToggleLesson?: (lessonId: string) => void;
}

function formatMinutes(min: number, locale: "it" | "en") {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0
    ? locale === "en"
      ? `${h}h`
      : `${h}h`
    : `${h}h ${m}min`;
}

const Curriculum: React.FC<CurriculumProps> = ({
  curriculum,
  preview = false,
  onOpenWorkout,
  onOpenExercise,
  progress,
  onToggleLesson,
}) => {
  const { locale, t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(
    curriculum.sections[0]?.id ?? null
  );
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  const doneCount = progress
    ? curriculum.sections.flatMap((s) => s.lessons).filter((l) => progress.has(l.id)).length
    : 0;

  // Running lesson numbers across sections (1-based, like "Lesson 12").
  const sectionOffsets = React.useMemo(() => {
    const offsets: number[] = [];
    let count = 0;
    for (const s of curriculum.sections) {
      offsets.push(count);
      count += s.lessons.length;
    }
    return offsets;
  }, [curriculum]);

  return (
    <div className="space-y-3">
      {/* Header stats */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-black uppercase tracking-widest">
          <ListVideo size={13} />
          {t(
            `${curriculum.totalLessons} lezioni`,
            `${curriculum.totalLessons} lessons`
          )}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-[11px] font-black uppercase tracking-widest">
          {t(
            `Circa ${formatMinutes(curriculum.totalMinutes, locale)} di contenuti`,
            `About ${formatMinutes(curriculum.totalMinutes, locale)} of content`
          )}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-black uppercase tracking-widest">
          IT / EN
        </span>
        {progress && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
            {t(`${doneCount}/${curriculum.totalLessons} completate`, `${doneCount}/${curriculum.totalLessons} done`)}
          </span>
        )}
      </div>

      {curriculum.sections.map((section, si) => {
        const isOpen = openSection === section.id;
        const firstLessonNo = (sectionOffsets[si] ?? 0) + 1;
        const lastLessonNo = (sectionOffsets[si] ?? 0) + section.lessons.length;
        return (
          <div
            key={section.id}
            className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenSection(isOpen ? null : section.id)}
              className="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-zinc-900/[0.03] dark:hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-[11px] font-black text-red-500 tracking-widest shrink-0">
                {String(si + 1).padStart(2, "0")}
              </span>
              <span className="grow min-w-0">
                <span className="block font-black text-zinc-900 dark:text-white text-sm sm:text-base uppercase tracking-tight truncate">
                  {locale === "en" ? section.titleEn : section.title}
                </span>
                <span className="block text-[11px] text-zinc-500 font-medium mt-0.5">
                  {t(
                    `Lezioni ${firstLessonNo}–${lastLessonNo}`,
                    `Lessons ${firstLessonNo}–${lastLessonNo}`
                  )}{" "}
                  · {section.lessons.length}{" "}
                  {t("lezioni", "lessons")}
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`text-zinc-500 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 sm:px-4 pb-4 space-y-1.5">
                    {section.lessons.map((lesson, li) => {
                      const lessonNo = firstLessonNo + li;
                      const Icon = KIND_ICON[lesson.kind];
                      const locked = preview && !lesson.freePreview;
                      const expanded = !locked && openLesson === lesson.id;
                      const done = progress?.has(lesson.id) ?? false;
                      return (
                        <div
                          key={lesson.id}
                          className={`rounded-xl border transition-colors ${
                            locked
                              ? "border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-950/40"
                              : done
                                ? "border-green-500/20 bg-green-500/[0.03]"
                                : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-950/60 hover:border-zinc-400 dark:hover:border-white/15"
                          }`}
                        >
                          <button
                            disabled={locked}
                            onClick={() => setOpenLesson(expanded ? null : lesson.id)}
                            className={`w-full p-3 flex items-center gap-3 text-left ${
                              locked ? "cursor-not-allowed" : ""
                            }`}
                          >
                            <span
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                locked
                                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600"
                                  : done
                                    ? "bg-green-500/15 text-green-400"
                                    : "bg-red-600/15 text-red-400"
                              }`}
                            >
                              {locked ? (
                                <Lock size={14} />
                              ) : done ? (
                                <Check size={14} strokeWidth={3} />
                              ) : (
                                <Icon size={14} />
                              )}
                            </span>
                            <span className="grow min-w-0">
                              <span
                                className={`block text-[10px] font-black uppercase tracking-widest ${
                                  locked
                                    ? "text-zinc-400 dark:text-zinc-600"
                                    : "text-zinc-500"
                                }`}
                              >
                                {t("Lezione", "Lesson")} {lessonNo}
                                {(!preview || lesson.freePreview) && (
                                  <span className="ml-2 normal-case font-medium">
                                    · {lesson.minutes} min
                                  </span>
                                )}
                              </span>
                              <span
                                className={`block text-sm font-bold truncate ${
                                  locked ? "text-zinc-400 dark:text-zinc-600" : done ? "text-zinc-500 dark:text-zinc-400 line-through" : "text-zinc-800 dark:text-zinc-100"
                                }`}
                              >
                                {locale === "en"
                                  ? lesson.titleEn
                                  : lesson.title}
                              </span>
                            </span>
                            {preview && lesson.freePreview && (
                              <span className="shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                                {t("Anteprima", "Preview")}
                              </span>
                            )}
                            {!preview && onToggleLesson && !locked && (
                              <span
                                role="button"
                                tabIndex={0}
                                aria-label={t("Segna come completata", "Mark as done")}
                                aria-pressed={done}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleLesson(lesson.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleLesson(lesson.id);
                                  }
                                }}
                                className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                                  done
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-zinc-300 dark:border-white/15 text-zinc-400 dark:text-zinc-600 hover:border-green-500/50 hover:text-green-400"
                                }`}
                              >
                                <Check size={14} strokeWidth={3} />
                              </span>
                            )}
                            {!locked && (
                              <ChevronDown
                                size={15}
                                className={`text-zinc-500 transition-transform shrink-0 ${
                                  expanded ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 pt-1 ml-11">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                                    {locale === "en"
                                      ? lesson.descriptionEn
                                      : lesson.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {(lesson.kind === "workout" ||
                                      lesson.kind === "plan") &&
                                      onOpenWorkout && (
                                        <button
                                          onClick={onOpenWorkout}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-widest transition-colors"
                                        >
                                          <Dumbbell size={12} />
                                          {t(
                                            "Vai al workout",
                                            "Go to workout"
                                          )}
                                        </button>
                                      )}
                                    {lesson.kind === "video" &&
                                      onOpenExercise && (
                                        <button
                                          onClick={() =>
                                            onOpenExercise(lesson.exerciseId)
                                          }
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-700 dark:bg-white/10 dark:hover:bg-white/15 text-white text-[11px] font-black uppercase tracking-widest transition-colors"
                                        >
                                          <Play size={12} />
                                          {t(
                                            "Apri negli esercizi",
                                            "Open in exercises"
                                          )}
                                        </button>
                                      )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Curriculum;
