import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> { __kind__: "Some"; value: T; }
export interface None { __kind__: "None"; }
export type Option<T> = Some<T> | None;

export type Role = { Admin: null } | { SchoolAdmin: null } | { Teacher: null };
export interface AppUserData {
  id: string; name: string; email: string; username: string;
  password: string;
  role: Role; schoolId: string; gradeAssigned: bigint; createdBy: string;
}
export interface ModuleProgressData { gradeNumber: bigint; sectionId: string; completed: boolean; }
export interface QuizResultData { gradeNumber: bigint; score: bigint; totalQuestions: bigint; }
export interface TeacherReportData {
  userId: string; name: string;
  completedSections: Array<ModuleProgressData>;
  quizResults: Array<QuizResultData>;
}
export interface PlatformStatsData { totalSchools: bigint; totalTeachers: bigint; totalCompletions: bigint; }

export interface backendInterface {
  _initializeAccessControlWithSecret(secret: string): Promise<undefined>;
  login(username: string, password: string): Promise<{ ok: AppUserData } | { err: string }>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ ok: string } | { err: string }>;
  createSchoolAdmin(creatorId: string, name: string, email: string, username: string, password: string, schoolName: string): Promise<{ ok: AppUserData } | { err: string }>;
  createTeacher(creatorId: string, name: string, email: string, username: string, password: string, gradeAssigned: bigint): Promise<{ ok: AppUserData } | { err: string }>;
  markSectionComplete(userId: string, gradeNumber: bigint, sectionId: string): Promise<{ ok: string } | { err: string }>;
  submitQuiz(userId: string, gradeNumber: bigint, score: bigint, totalQuestions: bigint): Promise<{ ok: string } | { err: string }>;
  getMyReport(userId: string): Promise<{ ok: TeacherReportData } | { err: string }>;
  getSchoolTeachers(schoolAdminId: string): Promise<{ ok: AppUserData[] } | { err: string }>;
  getTeacherReport(requesterId: string, teacherId: string): Promise<{ ok: TeacherReportData } | { err: string }>;
  getAllSchoolAdmins(adminId: string): Promise<{ ok: AppUserData[] } | { err: string }>;
  getPlatformStats(adminId: string): Promise<{ ok: PlatformStatsData } | { err: string }>;
}
