/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export type Role = { Admin: null } | { SchoolAdmin: null } | { Teacher: null };
export interface User {
  id: string; name: string; email: string; username: string; password: string;
  role: Role; schoolId: string; gradeAssigned: bigint; createdBy: string;
}
export interface ModuleProgress { gradeNumber: bigint; sectionId: string; completed: boolean; }
export interface QuizResult { gradeNumber: bigint; score: bigint; totalQuestions: bigint; }
export interface TeacherReport {
  userId: string; name: string;
  completedSections: Array<ModuleProgress>;
  quizResults: Array<QuizResult>;
}
export interface PlatformStats { totalSchools: bigint; totalTeachers: bigint; totalCompletions: bigint; }
export type ResultUser = { ok: User } | { err: string };
export type ResultText = { ok: string } | { err: string };
export type ResultUsers = { ok: Array<User> } | { err: string };
export type ResultReport = { ok: TeacherReport } | { err: string };
export type ResultStats = { ok: PlatformStats } | { err: string };

export interface _SERVICE {
  login: ActorMethod<[string, string], ResultUser>;
  changePassword: ActorMethod<[string, string, string], ResultText>;
  createSchoolAdmin: ActorMethod<[string, string, string, string, string, string], ResultUser>;
  createTeacher: ActorMethod<[string, string, string, string, string, bigint], ResultUser>;
  markSectionComplete: ActorMethod<[string, bigint, string], ResultText>;
  submitQuiz: ActorMethod<[string, bigint, bigint, bigint], ResultText>;
  getMyReport: ActorMethod<[string], ResultReport>;
  getSchoolTeachers: ActorMethod<[string], ResultUsers>;
  getTeacherReport: ActorMethod<[string, string], ResultReport>;
  getAllSchoolAdmins: ActorMethod<[string], ResultUsers>;
  getPlatformStats: ActorMethod<[string], ResultStats>;
  _initializeAccessControlWithSecret: ActorMethod<[string], undefined>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
