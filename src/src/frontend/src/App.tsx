import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

export type UserRole = "Admin" | "SchoolAdmin" | "Teacher";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  schoolId: string;
  gradeAssigned: number;
  createdBy: string;
}

function getRoleFromBackend(role: unknown): UserRole {
  if (role && typeof role === "object") {
    if ("Admin" in (role as object)) return "Admin";
    if ("SchoolAdmin" in (role as object)) return "SchoolAdmin";
    if ("Teacher" in (role as object)) return "Teacher";
  }
  return "Teacher";
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("classio_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("classio_user");
      }
    }
  }, []);

  const handleLogin = (rawUser: unknown) => {
    const u = rawUser as {
      id: string;
      name: string;
      email: string;
      username: string;
      role: unknown;
      schoolId: string;
      gradeAssigned: bigint | number;
      createdBy: string;
    };
    const appUser: AppUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      role: getRoleFromBackend(u.role),
      schoolId: u.schoolId,
      gradeAssigned: Number(u.gradeAssigned),
      createdBy: u.createdBy,
    };
    setUser(appUser);
    localStorage.setItem("classio_user", JSON.stringify(appUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("classio_user");
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;
  if (user.role === "Admin")
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  if (user.role === "SchoolAdmin")
    return <SchoolAdminDashboard user={user} onLogout={handleLogout} />;
  return <TeacherDashboard user={user} onLogout={handleLogout} />;
}
