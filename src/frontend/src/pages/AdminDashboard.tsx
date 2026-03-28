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
import { useActor } from "../hooks/useActor";

interface Props {
  user: AppUser;
  onLogout: () => void;
}
interface SchoolAdmin {
  id: string;
  name: string;
  email: string;
  username: string;
  schoolId: string;
}
interface PlatformStats {
  totalSchools: number;
  totalTeachers: number;
  totalCompletions: number;
}
type Tab = "overview" | "schools";

export default function AdminDashboard({ user, onLogout }: Props) {
  const { actor } = useActor();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdmin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    schoolName: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    loadStats();
    loadSchoolAdmins();
  }, []);

  const loadStats = async () => {
    if (!actor) return;
    try {
      const res = await actor.getPlatformStats(user.id);
      if ("ok" in (res as object)) {
        const r = (
          res as {
            ok: {
              totalSchools: bigint;
              totalTeachers: bigint;
              totalCompletions: bigint;
            };
          }
        ).ok;
        setStats({
          totalSchools: Number(r.totalSchools),
          totalTeachers: Number(r.totalTeachers),
          totalCompletions: Number(r.totalCompletions),
        });
      }
    } catch {}
  };

  const loadSchoolAdmins = async () => {
    if (!actor) return;
    try {
      const res = await actor.getAllSchoolAdmins(user.id);
      if ("ok" in (res as object)) {
        const list = (
          res as {
            ok: {
              id: string;
              name: string;
              email: string;
              username: string;
              schoolId: string;
            }[];
          }
        ).ok;
        setSchoolAdmins(
          list.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            username: u.username,
            schoolId: u.schoolId,
          })),
        );
      }
    } catch {}
  };

  const handleCreate = async () => {
    if (!actor) return;
    if (!form.name || !form.username || !form.password || !form.schoolName) {
      setFormError("Please fill all required fields.");
      return;
    }
    setFormLoading(true);
    setFormError("");
    try {
      const res = await (actor as any).createSchoolAdmin(
        user.id,
        form.name,
        form.email,
        form.username,
        form.password,
        form.schoolName,
      );
      if ("ok" in (res as object)) {
        setShowModal(false);
        setForm({
          name: "",
          email: "",
          username: "",
          password: "",
          schoolName: "",
        });
        showToast("School Admin created successfully!");
        loadSchoolAdmins();
        loadStats();
      } else {
        setFormError((res as { err: string }).err);
      }
    } catch {
      setFormError("Failed to create. Please try again.");
    } finally {
      setFormLoading(false);
    }
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
            onClick={() => setTab("overview")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "overview" ? "bg-cyan-50 text-cyan-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Platform Overview
          </button>
          <button
            type="button"
            onClick={() => setTab("schools")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "schools" ? "bg-cyan-50 text-cyan-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            School Admins
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Signed in as</div>
          <div className="text-sm font-medium text-gray-800">{user.name}</div>
          <Badge className="mt-1 bg-cyan-100 text-cyan-700 hover:bg-cyan-100 text-xs">
            Platform Admin
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

        {tab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Platform Overview
            </h1>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-medium">
                    Total Schools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-cyan-600">
                    {stats?.totalSchools ?? "—"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-medium">
                    Total Teachers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-cyan-600">
                    {stats?.totalTeachers ?? "—"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-medium">
                    Module Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-cyan-600">
                    {stats?.totalCompletions ?? "—"}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>
                  1. Go to <strong>School Admins</strong> tab to add schools to
                  the platform.
                </p>
                <p>
                  2. Each School Admin can then create teacher accounts for
                  their school.
                </p>
                <p>
                  3. Teachers access self-paced training modules across Grades
                  1–10.
                </p>
                <p>4. Track progress through the overview stats above.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "schools" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                School Admins
              </h1>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                + Add School Admin
              </Button>
            </div>
            {schoolAdmins.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-400">
                  No school admins yet. Add your first one.
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
                          School
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
                      {schoolAdmins.map((sa) => (
                        <tr
                          key={sa.id}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="px-6 py-3 font-medium text-gray-800">
                            {sa.name}
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            {sa.schoolId}
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                              {sa.username}
                            </code>
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            {sa.email || "—"}
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
      </main>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add School Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>School Name *</Label>
              <Input
                placeholder="e.g. Delhi Public School"
                value={form.schoolName}
                onChange={(e) =>
                  setForm({ ...form, schoolName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Username *</Label>
              <Input
                placeholder="e.g. priya.sharma"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Password *</Label>
              <Input
                type="password"
                placeholder="Set a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                placeholder="e.g. priya@school.edu"
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
