import { useEffect, useRef, useState } from "react";
import type { AppUser } from "../App";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { GRADE_CONTENT } from "../gradeContent";
import { useActor } from "../hooks/useActor";

interface Props {
  user: AppUser;
  onLogout: () => void;
}
interface SectionProgress {
  gradeNumber: number;
  sectionId: string;
  completed: boolean;
}
interface QuizResult {
  gradeNumber: number;
  score: number;
  totalQuestions: number;
}
interface UserProgress {
  completedSections: SectionProgress[];
  quizResults: QuizResult[];
}

export default function TeacherDashboard({ user, onLogout }: Props) {
  const { actor } = useActor();
  const assignedGrade = user.gradeAssigned || 1;
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    completedSections: [],
    quizResults: [],
  });
  const [completing, setCompleting] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<{
    answers: number[];
    submitted: boolean;
    score: number;
  } | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [toast, setToast] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [listeningModuleId, setListeningModuleId] = useState<string | null>(
    null,
  );
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [moduleQuizState, setModuleQuizState] = useState<{
    [moduleId: string]: {
      answers: number[];
      submitted: boolean;
      score: number;
    };
  }>({});
  const [activityChecks, setActivityChecks] = useState<{
    [key: string]: boolean;
  }>({});
  const certRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const loadProgress = async () => {
    if (!actor) return;
    try {
      const res = await actor.getMyReport(user.id);
      if ("ok" in (res as object)) {
        const r = (
          res as {
            ok: {
              completedSections: {
                gradeNumber: bigint | number;
                sectionId: string;
                completed: boolean;
              }[];
              quizResults: {
                gradeNumber: bigint | number;
                score: bigint | number;
                totalQuestions: bigint | number;
              }[];
            };
          }
        ).ok;
        setProgress({
          completedSections: r.completedSections.map((s) => ({
            gradeNumber: Number(s.gradeNumber),
            sectionId: s.sectionId,
            completed: s.completed,
          })),
          quizResults: r.quizResults.map((q) => ({
            gradeNumber: Number(q.gradeNumber),
            score: Number(q.score),
            totalQuestions: Number(q.totalQuestions),
          })),
        });
      }
    } catch {}
  };

  const speakModule = (mod: { id: string; content: string }) => {
    window.speechSynthesis.cancel();
    if (listeningModuleId === mod.id) {
      setListeningModuleId(null);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      mod.content.replace(/\*\*/g, ""),
    );
    utter.lang = "en-IN";
    utter.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find((v) => v.lang === "en-IN");
    const englishVoice = voices.find((v) => v.lang.startsWith("en"));
    if (indianVoice) utter.voice = indianVoice;
    else if (englishVoice) utter.voice = englishVoice;
    utter.onend = () => setListeningModuleId(null);
    utter.onerror = () => setListeningModuleId(null);
    speechRef.current = utter;
    setListeningModuleId(mod.id);
    window.speechSynthesis.speak(utter);
  };

  const toggleActivity = (moduleId: string, taskIdx: number) => {
    const key = `${moduleId}-${taskIdx}`;
    setActivityChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const initModuleQuiz = (moduleId: string, questionCount: number) => {
    if (!moduleQuizState[moduleId]) {
      setModuleQuizState((prev) => ({
        ...prev,
        [moduleId]: {
          answers: Array(questionCount).fill(-1),
          submitted: false,
          score: 0,
        },
      }));
    }
  };

  const setModuleAnswer = (moduleId: string, qi: number, ans: number) => {
    setModuleQuizState((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        answers: prev[moduleId].answers.map((a, i) => (i === qi ? ans : a)),
      },
    }));
  };

  const submitModuleQuiz = async (
    moduleId: string,
    quiz: { answer: number }[],
  ) => {
    const state = moduleQuizState[moduleId];
    if (!state) return;
    const score = state.answers.reduce(
      (acc, ans, i) => acc + (ans === quiz[i].answer ? 1 : 0),
      0,
    );
    setModuleQuizState((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], submitted: true, score },
    }));
    if (score / quiz.length >= 0.7 && !isModuleDone(moduleId)) {
      await markComplete(moduleId);
    }
  };

  const retakeModuleQuiz = (moduleId: string, questionCount: number) => {
    setModuleQuizState((prev) => ({
      ...prev,
      [moduleId]: {
        answers: Array(questionCount).fill(-1),
        submitted: false,
        score: 0,
      },
    }));
  };

  const isModuleDone = (moduleId: string) =>
    progress.completedSections.some(
      (s) => s.gradeNumber === assignedGrade && s.sectionId === moduleId,
    );

  const getQuizResult = () =>
    progress.quizResults.find((q) => q.gradeNumber === assignedGrade);

  const markComplete = async (moduleId: string) => {
    if (!actor) return;
    setCompleting(moduleId);
    try {
      await actor.markSectionComplete(user.id, BigInt(assignedGrade), moduleId);
      setProgress((prev) => ({
        ...prev,
        completedSections: [
          ...prev.completedSections.filter(
            (s) =>
              !(s.gradeNumber === assignedGrade && s.sectionId === moduleId),
          ),
          { gradeNumber: assignedGrade, sectionId: moduleId, completed: true },
        ],
      }));
      showToast("Module marked as complete!");
    } catch {}
    setCompleting(null);
  };

  const gradeContent = GRADE_CONTENT.find((g) => g.grade === assignedGrade)!;
  const completedCount = gradeContent.modules.filter((m) =>
    isModuleDone(m.id),
  ).length;
  const gradeProgress = Math.round(
    (completedCount / gradeContent.modules.length) * 100,
  );
  const quizResult = getQuizResult();
  const quizPassed = quizResult
    ? Math.round((quizResult.score / quizResult.totalQuestions) * 100) >= 80
    : false;
  const certificateEarned =
    completedCount === gradeContent.modules.length && quizPassed;

  const startQuiz = () => {
    setQuizState({
      answers: Array(gradeContent.quiz.length).fill(-1),
      submitted: false,
      score: 0,
    });
  };

  const submitQuiz = async () => {
    if (!quizState || !actor) return;
    const score = quizState.answers.reduce(
      (acc, ans, i) => acc + (ans === gradeContent.quiz[i].answer ? 1 : 0),
      0,
    );
    setSubmitLoading(true);
    try {
      await actor.submitQuiz(
        user.id,
        BigInt(assignedGrade),
        BigInt(score),
        BigInt(gradeContent.quiz.length),
      );
      setQuizState({ ...quizState, submitted: true, score });
      setProgress((prev) => ({
        ...prev,
        quizResults: [
          ...prev.quizResults.filter((q) => q.gradeNumber !== assignedGrade),
          {
            gradeNumber: assignedGrade,
            score,
            totalQuestions: gradeContent.quiz.length,
          },
        ],
      }));
      showToast(`Quiz submitted! Score: ${score}/${gradeContent.quiz.length}`);
    } catch {}
    setSubmitLoading(false);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const completionDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
            alt="Classio"
            className="h-9"
          />
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Progress:</span>
              <div className="w-28">
                <Progress value={gradeProgress} className="h-2" />
              </div>
              <span className="font-medium text-cyan-600">
                {gradeProgress}%
              </span>
            </div>
            {certificateEarned && (
              <Button
                size="sm"
                onClick={() => setShowCertificate(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs"
              >
                🏆 Certificate
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReport(true)}
              className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            >
              My Report
            </Button>
            <div className="text-sm font-medium text-gray-700">{user.name}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-500"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-medium print:hidden">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Grade Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 text-sm px-3 py-1">
                  Grade {assignedGrade}
                </Badge>
                {certificateEarned && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-sm px-3 py-1">
                    🏆 Certified
                  </Badge>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {gradeContent.title}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Complete all 10 modules and pass the assessment to earn your
                certificate
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-600">
                {gradeProgress}%
              </div>
              <div className="text-xs text-gray-400">
                {completedCount}/{gradeContent.modules.length} modules
              </div>
            </div>
          </div>
          <Progress value={gradeProgress} className="h-2.5 mt-4" />
          <div className="flex gap-6 mt-4 text-sm text-gray-500">
            <span>
              📚{" "}
              <strong className="text-gray-700">
                {gradeContent.modules.length}
              </strong>{" "}
              Modules
            </span>
            <span>
              ⏱ <strong className="text-gray-700">~10 hours</strong> of content
            </span>
            <span>
              ✅ <strong className="text-gray-700">{completedCount}</strong>{" "}
              completed
            </span>
            {quizResult && (
              <span>
                📝 Quiz:{" "}
                <strong
                  className={quizPassed ? "text-green-600" : "text-orange-500"}
                >
                  {quizResult.score}/{quizResult.totalQuestions}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Certificate Banner */}
        {certificateEarned && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 mb-6 flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-amber-800">
                🏆 Congratulations, {user.name}!
              </div>
              <div className="text-sm text-amber-700 mt-0.5">
                You have completed all Grade {assignedGrade} modules and passed
                the assessment.
              </div>
            </div>
            <Button
              onClick={() => setShowCertificate(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              View Certificate
            </Button>
          </div>
        )}

        {/* Modules List */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Learning Modules
        </h2>
        <div className="space-y-3 mb-8">
          {gradeContent.modules.map((mod, idx) => {
            const done = isModuleDone(mod.id);
            const isOpen = activeModule === mod.id;
            return (
              <Card
                key={mod.id}
                className={`transition-all border ${
                  done
                    ? "border-green-200 bg-green-50/30"
                    : "border-gray-100 bg-white"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    if (listeningModuleId === mod.id) {
                      window.speechSynthesis.cancel();
                      setListeningModuleId(null);
                    }
                    setActiveModule(isOpen ? null : mod.id);
                  }}
                >
                  <CardHeader className="py-4 px-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            done
                              ? "bg-green-500 text-white"
                              : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {done ? "✓" : idx + 1}
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold text-gray-800">
                            {mod.title}
                          </CardTitle>
                          <div className="text-xs text-gray-400 mt-0.5">
                            ⏱ {mod.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {done && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                            Complete
                          </Badge>
                        )}
                        <span className="text-gray-400 text-sm">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </button>
                {isOpen && (
                  <CardContent className="pt-0 pb-6 px-5">
                    <div className="border-t border-gray-100 pt-4">
                      {/* Listen Button */}
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          type="button"
                          data-ocid="module.toggle"
                          onClick={() => speakModule(mod)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            listeningModuleId === mod.id
                              ? "bg-cyan-600 text-white shadow-md"
                              : "bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100"
                          }`}
                        >
                          {listeningModuleId === mod.id
                            ? "⏹ Stop Listening"
                            : "🔊 Listen to Module"}
                        </button>
                        {listeningModuleId === mod.id && (
                          <span className="text-xs text-cyan-600 animate-pulse">
                            Reading aloud with Indian accent...
                          </span>
                        )}
                      </div>

                      {/* Module Content */}
                      <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-6">
                        {mod.content}
                      </div>

                      {/* Activity Section */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">🎯</span>
                          <h3 className="font-bold text-amber-900 text-base">
                            {mod.activity.title}
                          </h3>
                        </div>
                        <p className="text-amber-800 text-sm mb-4">
                          {mod.activity.description}
                        </p>
                        <div className="space-y-2">
                          {mod.activity.tasks.map((task, ti) => {
                            const key = `${mod.id}-${ti}`;
                            const checked = activityChecks[key] || false;
                            return (
                              <button
                                type="button"
                                key={key}
                                data-ocid={`module.checkbox.${ti + 1}`}
                                onClick={() => toggleActivity(mod.id, ti)}
                                className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all ${
                                  checked
                                    ? "bg-amber-100 border-amber-300 line-through text-amber-600"
                                    : "bg-white border-amber-200 text-amber-900 hover:border-amber-400"
                                }`}
                              >
                                <span
                                  className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                    checked
                                      ? "bg-amber-500 text-white"
                                      : "bg-amber-200 text-amber-700"
                                  }`}
                                >
                                  {checked ? "✓" : ti + 1}
                                </span>
                                <span className="text-sm">{task}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 text-xs text-amber-700 font-medium">
                          {
                            Object.keys(activityChecks).filter(
                              (k) =>
                                k.startsWith(`${mod.id}-`) && activityChecks[k],
                            ).length
                          }
                          /{mod.activity.tasks.length} tasks completed
                        </div>
                      </div>

                      {/* My Learning Test */}
                      {(() => {
                        const mqs = moduleQuizState[mod.id];
                        if (!mqs) {
                          return (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-5">
                              <h3 className="font-bold text-indigo-900 text-base mb-1">
                                📝 My Learning Test
                              </h3>
                              <p className="text-indigo-700 text-sm mb-4">
                                Test your understanding of this module with 5
                                quick questions.
                              </p>
                              <button
                                type="button"
                                data-ocid="module.primary_button"
                                onClick={() =>
                                  initModuleQuiz(mod.id, mod.moduleQuiz.length)
                                }
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Start Learning Test
                              </button>
                            </div>
                          );
                        }
                        if (mqs.submitted) {
                          const pct = Math.round(
                            (mqs.score / mod.moduleQuiz.length) * 100,
                          );
                          const passed = pct >= 70;
                          return (
                            <div
                              className={`border rounded-xl p-5 mb-5 ${passed ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
                            >
                              <h3 className="font-bold text-base mb-2">
                                📝 My Learning Test — Results
                              </h3>
                              <div
                                className={`text-4xl font-bold mb-1 ${passed ? "text-green-600" : "text-orange-500"}`}
                              >
                                {mqs.score}/{mod.moduleQuiz.length}
                              </div>
                              <p
                                className={`text-sm font-medium mb-3 ${passed ? "text-green-700" : "text-orange-700"}`}
                              >
                                {passed
                                  ? "🎉 Great job! You've mastered this module"
                                  : "⚠️ Review the content and try again"}
                              </p>
                              {!passed && (
                                <button
                                  type="button"
                                  data-ocid="module.secondary_button"
                                  onClick={() =>
                                    retakeModuleQuiz(
                                      mod.id,
                                      mod.moduleQuiz.length,
                                    )
                                  }
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                  Retake Test
                                </button>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-5">
                            <h3 className="font-bold text-indigo-900 text-base mb-4">
                              📝 My Learning Test
                            </h3>
                            <div className="space-y-5">
                              {mod.moduleQuiz.map((q, qi) => (
                                <div key={q.question}>
                                  <p className="font-medium text-gray-800 text-sm mb-2">
                                    {qi + 1}. {q.question}
                                  </p>
                                  <div className="space-y-1.5">
                                    {q.options.map((opt, oi) => (
                                      <button
                                        type="button"
                                        key={opt}
                                        data-ocid={`module.radio.${qi + 1}`}
                                        onClick={() =>
                                          setModuleAnswer(mod.id, qi, oi)
                                        }
                                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                                          mqs.answers[qi] === oi
                                            ? "border-cyan-500 bg-cyan-50 text-cyan-800 font-medium"
                                            : "border-gray-200 bg-white hover:border-cyan-300 text-gray-700"
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                data-ocid="module.submit_button"
                                onClick={() =>
                                  submitModuleQuiz(mod.id, mod.moduleQuiz)
                                }
                                disabled={mqs.answers.includes(-1)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                              >
                                Submit Answers
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Mark Complete / Done indicator */}
                      {!done && !moduleQuizState[mod.id] && (
                        <Button
                          onClick={() => markComplete(mod.id)}
                          disabled={completing === mod.id}
                          className="bg-cyan-500 hover:bg-cyan-600 text-sm"
                        >
                          {completing === mod.id
                            ? "Saving..."
                            : "Mark Module as Complete"}
                        </Button>
                      )}
                      {done && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <span>✓</span>
                          <span>Module completed</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Video Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Video Revision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gradeContent.videos.map((v) => (
                <div
                  key={v.title}
                  className="rounded-lg overflow-hidden border border-gray-100"
                >
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      src={v.url}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      title={v.title}
                    />
                  </div>
                  <div className="p-3 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700">
                      {v.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Grade {assignedGrade} Assessment Quiz
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">
                  Score 80% or above to earn your certificate
                </p>
              </div>
              {quizResult && (
                <Badge
                  className={`text-sm ${
                    quizPassed
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  {quizPassed ? "✓ Passed" : "Retake needed"}:{" "}
                  {quizResult.score}/{quizResult.totalQuestions}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!quizState ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-4">
                  {gradeContent.quiz.length} questions covering all 10 modules
                  for Grade {assignedGrade}. You need 80% to pass.
                </p>
                <Button
                  onClick={startQuiz}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  {quizResult ? "Retake Quiz" : "Start Quiz"}
                </Button>
              </div>
            ) : quizState.submitted ? (
              <div className="text-center py-6">
                <div
                  className={`text-5xl font-bold mb-2 ${
                    Math.round(
                      (quizState.score / gradeContent.quiz.length) * 100,
                    ) >= 80
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {quizState.score}/{gradeContent.quiz.length}
                </div>
                <p className="text-gray-500 mb-1">
                  {Math.round(
                    (quizState.score / gradeContent.quiz.length) * 100,
                  )}
                  % —{" "}
                  {Math.round(
                    (quizState.score / gradeContent.quiz.length) * 100,
                  ) >= 80
                    ? "Passed! 🎉"
                    : "Keep studying and retake."}
                </p>
                {Math.round(
                  (quizState.score / gradeContent.quiz.length) * 100,
                ) >= 80 &&
                  completedCount === gradeContent.modules.length && (
                    <Button
                      onClick={() => setShowCertificate(true)}
                      className="bg-amber-500 hover:bg-amber-600 mt-3 mr-2"
                    >
                      🏆 View Certificate
                    </Button>
                  )}
                <Button
                  variant="outline"
                  onClick={() => setQuizState(null)}
                  className="mt-3"
                >
                  Retake Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {gradeContent.quiz.map((q, qi) => (
                  <div key={q.question.slice(0, 30)}>
                    <p className="font-medium text-gray-800 mb-3">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => {
                            const newAnswers = [...quizState.answers];
                            newAnswers[qi] = q.options.indexOf(opt);
                            setQuizState({ ...quizState, answers: newAnswers });
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                            quizState.answers[qi] === q.options.indexOf(opt)
                              ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                              : "border-gray-200 hover:border-cyan-200 text-gray-700"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={submitQuiz}
                  disabled={quizState.answers.includes(-1) || submitLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                >
                  {submitLoading ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Report Modal */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>My Learning Report — {user.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-cyan-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {gradeProgress}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Grade Progress</div>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {completedCount}/{gradeContent.modules.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Modules Done</div>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {quizResult
                    ? `${Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%`
                    : "—"}
                </div>
                <div className="text-xs text-gray-500 mt-1">Quiz Score</div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Module Status
              </h3>
              <div className="space-y-1 max-h-64 overflow-auto">
                {gradeContent.modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50"
                  >
                    <span className="text-gray-600">
                      {idx + 1}. {mod.title}
                    </span>
                    {isModuleDone(mod.id) ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        Done
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {certificateEarned && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-amber-800 text-sm font-medium">
                  🏆 Certificate Earned
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowReport(false);
                    setShowCertificate(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs"
                >
                  View
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Modal */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate of Completion</DialogTitle>
          </DialogHeader>
          <div ref={certRef} className="py-2">
            <div className="border-4 border-double border-amber-400 rounded-2xl p-8 bg-gradient-to-br from-amber-50 via-white to-cyan-50 text-center">
              <img
                src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
                alt="Classio"
                className="h-12 mx-auto mb-4"
              />
              <div className="text-xs font-semibold tracking-[0.25em] text-amber-600 uppercase mb-3">
                Certificate of Completion
              </div>
              <div className="text-sm text-gray-500 mb-2">
                This is to certify that
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                has successfully completed all
              </div>
              <div className="text-xl font-bold text-cyan-700 mb-1">
                10 Modules of Grade {assignedGrade} Teacher Training
              </div>
              <div className="text-sm text-gray-500 mb-4">
                on the Classio Learn platform
              </div>
              <div className="flex justify-center gap-12 mb-6">
                <div>
                  <div className="text-xs text-gray-400">Quiz Score</div>
                  <div className="font-bold text-green-600">
                    {quizResult
                      ? `${quizResult.score}/${quizResult.totalQuestions}`
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Date</div>
                  <div className="font-bold text-gray-700">
                    {completionDate}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Grade</div>
                  <div className="font-bold text-gray-700">
                    Grade {assignedGrade}
                  </div>
                </div>
              </div>
              <div className="border-t border-amber-200 pt-4">
                <div className="text-xs text-gray-400">
                  Classio Learn — Learn and Lead
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <Button
              onClick={handlePrintCertificate}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Print / Download Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
