import { useEffect, useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GRADE_CONTENT } from "../gradeContent";
import { useActor } from "../hooks/useActor";

interface Props {
  user: AppUser;
  onLogout: () => void;
}
interface Teacher {
  id: string;
  name: string;
  email: string;
  username: string;
  gradeAssigned: number;
}
interface TeacherReport {
  userId: string;
  name: string;
  completedSections: {
    gradeNumber: number;
    sectionId: string;
    completed: boolean;
  }[];
  quizResults: { gradeNumber: number; score: number; totalQuestions: number }[];
}
type Tab = "teachers" | "reports";

export default function SchoolAdminDashboard({ user, onLogout }: Props) {
  const { actor } = useActor();
  const [tab, setTab] = useState<Tab>("teachers");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    grade: "1",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherReport, setTeacherReport] = useState<TeacherReport | null>(
    null,
  );
  const [reportLoading, setReportLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    if (!actor) return;
    try {
      const res = await actor.getSchoolTeachers(user.id);
      if ("ok" in (res as object)) {
        const list = (
          res as {
            ok: {
              id: string;
              name: string;
              email: string;
              username: string;
              gradeAssigned: bigint | number;
            }[];
          }
        ).ok;
        setTeachers(
          list.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            username: u.username,
            gradeAssigned: Number(u.gradeAssigned),
          })),
        );
      }
    } catch {}
  };

  const handleCreate = async () => {
    if (!actor) return;
    if (!form.name || !form.username) {
      setFormError("Please fill all required fields.");
      return;
    }
    setFormLoading(true);
    setFormError("");
    try {
      const res = await actor.createTeacher(
        user.id,
        form.name,
        form.email,
        form.username,
        BigInt(form.grade),
      );
      if ("ok" in (res as object)) {
        setShowModal(false);
        setForm({ name: "", email: "", username: "", grade: "1" });
        showToast("Teacher account created!");
        loadTeachers();
      } else {
        setFormError((res as { err: string }).err);
      }
    } catch {
      setFormError("Failed. Try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const loadReport = async (t: Teacher) => {
    if (!actor) return;
    setSelectedTeacher(t);
    setReportLoading(true);
    setTeacherReport(null);
    try {
      const res = await actor.getTeacherReport(user.id, t.id);
      if ("ok" in (res as object)) {
        const r = (
          res as {
            ok: {
              userId: string;
              name: string;
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
        setTeacherReport({
          userId: r.userId,
          name: r.name,
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
    } catch {
    } finally {
      setReportLoading(false);
    }
  };

  const getTeacherStats = (t: Teacher, report: TeacherReport | null) => {
    const gc = GRADE_CONTENT.find((g) => g.grade === t.gradeAssigned);
    if (!gc || !report)
      return {
        completed: 0,
        total: 10,
        pct: 0,
        quizPassed: false,
        certified: false,
      };
    const completed = report.completedSections.filter(
      (s) => s.gradeNumber === t.gradeAssigned,
    ).length;
    const total = gc.modules.length;
    const pct = Math.round((completed / total) * 100);
    const quiz = report.quizResults.find(
      (q) => q.gradeNumber === t.gradeAssigned,
    );
    const quizPassed = quiz
      ? Math.round((quiz.score / quiz.totalQuestions) * 100) >= 80
      : false;
    const certified = completed === total && quizPassed;
    return { completed, total, pct, quizPassed, certified };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
            alt="Classio"
            className="h-10"
          />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            type="button"
            onClick={() => setTab("teachers")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "teachers"
                ? "bg-cyan-50 text-cyan-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            My Teachers
          </button>
          <button
            type="button"
            onClick={() => setTab("reports")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "reports"
                ? "bg-cyan-50 text-cyan-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Progress Reports
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Signed in as</div>
          <div className="text-sm font-medium text-gray-800">{user.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{user.schoolId}</div>
          <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
            School Admin
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="w-full mt-3 text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {toast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-medium">
            {toast}
          </div>
        )}

        {tab === "teachers" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                <p className="text-gray-500 text-sm mt-1">{user.schoolId}</p>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                + Add Teacher
              </Button>
            </div>
            {teachers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-400">
                  No teachers yet. Add your first one.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">
                          Name
                        </th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">
                          Grade
                        </th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">
                          Username
                        </th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="px-6 py-3 font-medium text-gray-800">
                            {t.name}
                          </td>
                          <td className="px-6 py-3">
                            <Badge className="bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
                              Grade {t.gradeAssigned}
                            </Badge>
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                              {t.username}
                            </code>
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            {t.email || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {tab === "reports" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Progress Reports
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  Select a Teacher
                </h2>
                {teachers.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-400 text-sm">
                      No teachers added yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {teachers.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => loadReport(t)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedTeacher?.id === t.id
                            ? "border-cyan-400 bg-cyan-50"
                            : "border-gray-200 bg-white hover:border-cyan-200"
                        }`}
                      >
                        <div className="font-medium text-gray-800">
                          {t.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Grade {t.gradeAssigned} • {t.username}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {selectedTeacher && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {selectedTeacher.name}’s Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reportLoading ? (
                        <div className="py-8 text-center text-gray-400 text-sm">
                          Loading report...
                        </div>
                      ) : teacherReport ? (
                        <div className="space-y-5">
                          {(() => {
                            const stats = getTeacherStats(
                              selectedTeacher,
                              teacherReport,
                            );
                            const quiz = teacherReport.quizResults.find(
                              (q) =>
                                q.gradeNumber === selectedTeacher.gradeAssigned,
                            );
                            const gc = GRADE_CONTENT.find(
                              (g) => g.grade === selectedTeacher.gradeAssigned,
                            );
                            return (
                              <>
                                {stats.certified && (
                                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                                    <span className="text-amber-600 text-lg">
                                      🏆
                                    </span>
                                    <div>
                                      <div className="text-sm font-semibold text-amber-800">
                                        Certificate Earned
                                      </div>
                                      <div className="text-xs text-amber-600">
                                        All modules completed + quiz passed
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-cyan-600">
                                      {stats.pct}%
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      Module Progress
                                    </div>
                                  </div>
                                  <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-cyan-600">
                                      {stats.completed}/{stats.total}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      Modules Done
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">
                                    Module Completion
                                  </div>
                                  <Progress value={stats.pct} className="h-2" />
                                </div>
                                {gc && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                      Module Details
                                    </h3>
                                    <div className="space-y-1 max-h-48 overflow-auto">
                                      {gc.modules.map((mod, idx) => {
                                        const done =
                                          teacherReport.completedSections.some(
                                            (s) =>
                                              s.gradeNumber ===
                                                selectedTeacher.gradeAssigned &&
                                              s.sectionId === mod.id,
                                          );
                                        return (
                                          <div
                                            key={mod.id}
                                            className="flex items-center justify-between text-xs py-1 border-b border-gray-50"
                                          >
                                            <span className="text-gray-600">
                                              {idx + 1}. {mod.title}
                                            </span>
                                            {done ? (
                                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                                ✓
                                              </Badge>
                                            ) : (
                                              <Badge className="bg-gray-100 text-gray-400 hover:bg-gray-100 text-xs">
                                                —
                                              </Badge>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                {quiz && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">
                                      Assessment Quiz
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        {quiz.score}/{quiz.totalQuestions} (
                                        {Math.round(
                                          (quiz.score / quiz.totalQuestions) *
                                            100,
                                        )}
                                        %)
                                      </span>
                                      <Badge
                                        className={`text-xs ${
                                          stats.quizPassed
                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                            : "bg-orange-100 text-orange-600 hover:bg-orange-100"
                                        }`}
                                      >
                                        {stats.quizPassed
                                          ? "Passed"
                                          : "Not passed"}
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-400 text-sm">
                          No progress data yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input
                placeholder="e.g. Anjali Verma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Grade Assigned *</Label>
              <Select
                value={form.grade}
                onValueChange={(v) => setForm({ ...form, grade: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      Grade {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Username *</Label>
              <Input
                placeholder="e.g. anjali.verma"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                placeholder="e.g. anjali@school.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={formLoading}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {formLoading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
