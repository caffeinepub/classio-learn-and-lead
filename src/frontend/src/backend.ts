/* eslint-disable */
// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

export interface Some<T> { __kind__: "Some"; value: T; }
export interface None { __kind__: "None"; }
export type Option<T> = Some<T> | None;

export class ExternalBlob {
  _blob?: Uint8Array<ArrayBuffer> | null;
  directURL: string;
  onProgress?: (percentage: number) => void = undefined;
  private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
    if (blob) this._blob = blob;
    this.directURL = directURL;
  }
  static fromURL(url: string): ExternalBlob { return new ExternalBlob(url, null); }
  static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
    const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
    return new ExternalBlob(url, blob);
  }
  public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._blob) return this._blob;
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  public getDirectURL(): string { return this.directURL; }
  public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.onProgress = onProgress;
    return this;
  }
}

export interface backendInterface {
  _initializeAccessControlWithSecret(secret: string): Promise<undefined>;
  login(username: string, password: string): Promise<unknown>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<unknown>;
  createSchoolAdmin(creatorId: string, name: string, email: string, username: string, password: string, schoolName: string): Promise<unknown>;
  createTeacher(creatorId: string, name: string, email: string, username: string, password: string, gradeAssigned: bigint): Promise<unknown>;
  markSectionComplete(userId: string, gradeNumber: bigint, sectionId: string): Promise<unknown>;
  submitQuiz(userId: string, gradeNumber: bigint, score: bigint, totalQuestions: bigint): Promise<unknown>;
  getMyReport(userId: string): Promise<unknown>;
  getSchoolTeachers(schoolAdminId: string): Promise<unknown>;
  getTeacherReport(requesterId: string, teacherId: string): Promise<unknown>;
  getAllSchoolAdmins(adminId: string): Promise<unknown>;
  getPlatformStats(adminId: string): Promise<unknown>;
}

export class Backend implements backendInterface {
  constructor(
    private actor: ActorSubclass<_SERVICE>,
    private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private processError?: (error: unknown) => never
  ) {}

  async _initializeAccessControlWithSecret(secret: string): Promise<undefined> {
    try { return await this.actor._initializeAccessControlWithSecret(secret); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async login(username: string, password: string) {
    try { return await this.actor.login(username, password); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try { return await this.actor.changePassword(userId, oldPassword, newPassword); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async createSchoolAdmin(creatorId: string, name: string, email: string, username: string, password: string, schoolName: string) {
    try { return await this.actor.createSchoolAdmin(creatorId, name, email, username, password, schoolName); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async createTeacher(creatorId: string, name: string, email: string, username: string, password: string, gradeAssigned: bigint) {
    try { return await this.actor.createTeacher(creatorId, name, email, username, password, gradeAssigned); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async markSectionComplete(userId: string, gradeNumber: bigint, sectionId: string) {
    try { return await this.actor.markSectionComplete(userId, gradeNumber, sectionId); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async submitQuiz(userId: string, gradeNumber: bigint, score: bigint, totalQuestions: bigint) {
    try { return await this.actor.submitQuiz(userId, gradeNumber, score, totalQuestions); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async getMyReport(userId: string) {
    try { return await this.actor.getMyReport(userId); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async getSchoolTeachers(schoolAdminId: string) {
    try { return await this.actor.getSchoolTeachers(schoolAdminId); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async getTeacherReport(requesterId: string, teacherId: string) {
    try { return await this.actor.getTeacherReport(requesterId, teacherId); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async getAllSchoolAdmins(adminId: string) {
    try { return await this.actor.getAllSchoolAdmins(adminId); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
  async getPlatformStats(adminId: string) {
    try { return await this.actor.getPlatformStats(adminId); }
    catch (e) { if (this.processError) this.processError(e); throw e; }
  }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {}
): Backend {
  const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions.");
  }
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
