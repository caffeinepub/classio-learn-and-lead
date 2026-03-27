/* eslint-disable */
// @ts-nocheck
import { IDL } from '@icp-sdk/core/candid';

const Role = IDL.Variant({ Admin: IDL.Null, SchoolAdmin: IDL.Null, Teacher: IDL.Null });
const User = IDL.Record({
  id: IDL.Text,
  name: IDL.Text,
  email: IDL.Text,
  username: IDL.Text,
  role: Role,
  schoolId: IDL.Text,
  gradeAssigned: IDL.Nat,
  createdBy: IDL.Text,
});
const ModuleProgress = IDL.Record({ gradeNumber: IDL.Nat, sectionId: IDL.Text, completed: IDL.Bool });
const QuizResult = IDL.Record({ gradeNumber: IDL.Nat, score: IDL.Nat, totalQuestions: IDL.Nat });
const TeacherReport = IDL.Record({
  userId: IDL.Text,
  name: IDL.Text,
  completedSections: IDL.Vec(ModuleProgress),
  quizResults: IDL.Vec(QuizResult),
});
const PlatformStats = IDL.Record({ totalSchools: IDL.Nat, totalTeachers: IDL.Nat, totalCompletions: IDL.Nat });
const ResultUserText = IDL.Variant({ ok: User, err: IDL.Text });
const ResultTextText = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
const ResultUsersText = IDL.Variant({ ok: IDL.Vec(User), err: IDL.Text });
const ResultReportText = IDL.Variant({ ok: TeacherReport, err: IDL.Text });
const ResultStatsText = IDL.Variant({ ok: PlatformStats, err: IDL.Text });

export const idlService = IDL.Service({
  login: IDL.Func([IDL.Text], [ResultUserText], ['query']),
  createSchoolAdmin: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [ResultUserText], []),
  createTeacher: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat], [ResultUserText], []),
  markSectionComplete: IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [ResultTextText], []),
  submitQuiz: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat], [ResultTextText], []),
  getMyReport: IDL.Func([IDL.Text], [ResultReportText], ['query']),
  getSchoolTeachers: IDL.Func([IDL.Text], [ResultUsersText], ['query']),
  getTeacherReport: IDL.Func([IDL.Text, IDL.Text], [ResultReportText], ['query']),
  getAllSchoolAdmins: IDL.Func([IDL.Text], [ResultUsersText], ['query']),
  getPlatformStats: IDL.Func([IDL.Text], [ResultStatsText], ['query']),
  _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
});

export const idlInitArgs = [];
export const idlFactory = ({ IDL }) => {
  const Role = IDL.Variant({ Admin: IDL.Null, SchoolAdmin: IDL.Null, Teacher: IDL.Null });
  const User = IDL.Record({ id: IDL.Text, name: IDL.Text, email: IDL.Text, username: IDL.Text, role: Role, schoolId: IDL.Text, gradeAssigned: IDL.Nat, createdBy: IDL.Text });
  const ModuleProgress = IDL.Record({ gradeNumber: IDL.Nat, sectionId: IDL.Text, completed: IDL.Bool });
  const QuizResult = IDL.Record({ gradeNumber: IDL.Nat, score: IDL.Nat, totalQuestions: IDL.Nat });
  const TeacherReport = IDL.Record({ userId: IDL.Text, name: IDL.Text, completedSections: IDL.Vec(ModuleProgress), quizResults: IDL.Vec(QuizResult) });
  const PlatformStats = IDL.Record({ totalSchools: IDL.Nat, totalTeachers: IDL.Nat, totalCompletions: IDL.Nat });
  const ResultUserText = IDL.Variant({ ok: User, err: IDL.Text });
  const ResultTextText = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const ResultUsersText = IDL.Variant({ ok: IDL.Vec(User), err: IDL.Text });
  const ResultReportText = IDL.Variant({ ok: TeacherReport, err: IDL.Text });
  const ResultStatsText = IDL.Variant({ ok: PlatformStats, err: IDL.Text });
  return IDL.Service({
    login: IDL.Func([IDL.Text], [ResultUserText], ['query']),
    createSchoolAdmin: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [ResultUserText], []),
    createTeacher: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat], [ResultUserText], []),
    markSectionComplete: IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [ResultTextText], []),
    submitQuiz: IDL.Func([IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat], [ResultTextText], []),
    getMyReport: IDL.Func([IDL.Text], [ResultReportText], ['query']),
    getSchoolTeachers: IDL.Func([IDL.Text], [ResultUsersText], ['query']),
    getTeacherReport: IDL.Func([IDL.Text, IDL.Text], [ResultReportText], ['query']),
    getAllSchoolAdmins: IDL.Func([IDL.Text], [ResultUsersText], ['query']),
    getPlatformStats: IDL.Func([IDL.Text], [ResultStatsText], ['query']),
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
