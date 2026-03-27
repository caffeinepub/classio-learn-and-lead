import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

actor {
  // ---- Types ----
  type Role = { #Admin; #SchoolAdmin; #Teacher };

  type User = {
    id: Text;
    name: Text;
    email: Text;
    username: Text;
    role: Role;
    schoolId: Text;
    gradeAssigned: Nat;
    createdBy: Text;
  };

  type ModuleProgress = {
    gradeNumber: Nat;
    sectionId: Text;
    completed: Bool;
  };

  type QuizResult = {
    gradeNumber: Nat;
    score: Nat;
    totalQuestions: Nat;
  };

  type TeacherReport = {
    userId: Text;
    name: Text;
    completedSections: [ModuleProgress];
    quizResults: [QuizResult];
  };

  // ---- Stable storage ----
  stable var usersEntries : [(Text, User)] = [];
  stable var moduleProgressEntries : [(Text, [ModuleProgress])] = [];
  stable var quizResultsEntries : [(Text, [QuizResult])] = [];
  stable var nextId : Nat = 1;

  // ---- In-memory maps (transient = not auto-stable) ----
  transient var users = HashMap.fromIter<Text, User>(usersEntries.vals(), 10, Text.equal, Text.hash);
  transient var moduleProgress = HashMap.fromIter<Text, [ModuleProgress]>(moduleProgressEntries.vals(), 10, Text.equal, Text.hash);
  transient var quizResults = HashMap.fromIter<Text, [QuizResult]>(quizResultsEntries.vals(), 10, Text.equal, Text.hash);

  // ---- Upgrade hooks ----
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    moduleProgressEntries := Iter.toArray(moduleProgress.entries());
    quizResultsEntries := Iter.toArray(quizResults.entries());
  };

  system func postupgrade() {
    usersEntries := [];
    moduleProgressEntries := [];
    quizResultsEntries := [];
  };

  // Seed admin on first deploy
  do {
    if (users.get("admin-001") == null) {
      users.put("admin-001", {
        id = "admin-001";
        name = "Platform Admin";
        email = "admin@classio.learn";
        username = "admin";
        role = #Admin;
        schoolId = "";
        gradeAssigned = 0;
        createdBy = "system";
      });
    };
  };

  // ---- Helpers ----
  func getNextId() : Text {
    let id = "user-" # Nat.toText(nextId);
    nextId += 1;
    id
  };

  func findByUsername(username: Text) : ?User {
    for ((_, u) in users.entries()) {
      if (u.username == username) return ?u;
    };
    null
  };

  // ---- Public API ----

  public query func login(username: Text) : async Result.Result<User, Text> {
    switch (findByUsername(username)) {
      case (?u) #ok(u);
      case null #err("User not found");
    }
  };

  public func createSchoolAdmin(creatorId: Text, name: Text, email: Text, username: Text, schoolName: Text) : async Result.Result<User, Text> {
    switch (users.get(creatorId)) {
      case (?creator) {
        if (creator.role != #Admin) return #err("Only Admin can create School Admins");
        switch (findByUsername(username)) {
          case (?_) return #err("Username already taken");
          case null {};
        };
        let id = getNextId();
        let newUser : User = { id; name; email; username; role = #SchoolAdmin; schoolId = schoolName; gradeAssigned = 0; createdBy = creatorId };
        users.put(id, newUser);
        #ok(newUser)
      };
      case null #err("Creator not found");
    }
  };

  public func createTeacher(creatorId: Text, name: Text, email: Text, username: Text, gradeAssigned: Nat) : async Result.Result<User, Text> {
    switch (users.get(creatorId)) {
      case (?creator) {
        if (creator.role != #SchoolAdmin) return #err("Only School Admin can create Teachers");
        switch (findByUsername(username)) {
          case (?_) return #err("Username already taken");
          case null {};
        };
        let id = getNextId();
        let newUser : User = { id; name; email; username; role = #Teacher; schoolId = creator.schoolId; gradeAssigned; createdBy = creatorId };
        users.put(id, newUser);
        #ok(newUser)
      };
      case null #err("Creator not found");
    }
  };

  public func markSectionComplete(userId: Text, gradeNumber: Nat, sectionId: Text) : async Result.Result<Text, Text> {
    switch (users.get(userId)) {
      case (?_) {
        let existing = switch (moduleProgress.get(userId)) { case (?p) p; case null [] };
        let alreadyExists = Array.find(existing, func(p: ModuleProgress) : Bool { p.gradeNumber == gradeNumber and p.sectionId == sectionId });
        switch (alreadyExists) {
          case (?_) #ok("Already completed");
          case null {
            moduleProgress.put(userId, Array.append(existing, [{ gradeNumber; sectionId; completed = true }]));
            #ok("Marked complete")
          };
        }
      };
      case null #err("User not found");
    }
  };

  public func submitQuiz(userId: Text, gradeNumber: Nat, score: Nat, totalQuestions: Nat) : async Result.Result<Text, Text> {
    switch (users.get(userId)) {
      case (?_) {
        let existing = switch (quizResults.get(userId)) { case (?r) r; case null [] };
        let filtered = Array.filter(existing, func(r: QuizResult) : Bool { r.gradeNumber != gradeNumber });
        quizResults.put(userId, Array.append(filtered, [{ gradeNumber; score; totalQuestions }]));
        #ok("Quiz submitted")
      };
      case null #err("User not found");
    }
  };

  public query func getMyReport(userId: Text) : async Result.Result<TeacherReport, Text> {
    switch (users.get(userId)) {
      case (?u) {
        let progress = switch (moduleProgress.get(userId)) { case (?p) p; case null [] };
        let quiz = switch (quizResults.get(userId)) { case (?r) r; case null [] };
        #ok({ userId; name = u.name; completedSections = progress; quizResults = quiz })
      };
      case null #err("User not found");
    }
  };

  public query func getSchoolTeachers(schoolAdminId: Text) : async Result.Result<[User], Text> {
    switch (users.get(schoolAdminId)) {
      case (?admin) {
        if (admin.role != #SchoolAdmin) return #err("Not a school admin");
        let teachers = Iter.toArray(Iter.filter(users.vals(), func(u: User) : Bool {
          u.role == #Teacher and u.schoolId == admin.schoolId
        }));
        #ok(teachers)
      };
      case null #err("User not found");
    }
  };

  public query func getTeacherReport(requesterId: Text, teacherId: Text) : async Result.Result<TeacherReport, Text> {
    switch (users.get(requesterId)) {
      case (?requester) {
        if (requester.role != #SchoolAdmin and requester.role != #Admin) return #err("Unauthorized");
        switch (users.get(teacherId)) {
          case (?t) {
            let progress = switch (moduleProgress.get(teacherId)) { case (?p) p; case null [] };
            let quiz = switch (quizResults.get(teacherId)) { case (?r) r; case null [] };
            #ok({ userId = teacherId; name = t.name; completedSections = progress; quizResults = quiz })
          };
          case null #err("Teacher not found");
        }
      };
      case null #err("Requester not found");
    }
  };

  public query func getAllSchoolAdmins(adminId: Text) : async Result.Result<[User], Text> {
    switch (users.get(adminId)) {
      case (?admin) {
        if (admin.role != #Admin) return #err("Unauthorized");
        let admins = Iter.toArray(Iter.filter(users.vals(), func(u: User) : Bool { u.role == #SchoolAdmin }));
        #ok(admins)
      };
      case null #err("User not found");
    }
  };

  public query func getPlatformStats(adminId: Text) : async Result.Result<{ totalSchools: Nat; totalTeachers: Nat; totalCompletions: Nat }, Text> {
    switch (users.get(adminId)) {
      case (?admin) {
        if (admin.role != #Admin) return #err("Unauthorized");
        var schools = HashMap.HashMap<Text, Bool>(10, Text.equal, Text.hash);
        var teacherCount : Nat = 0;
        var completionCount : Nat = 0;
        for ((_, u) in users.entries()) {
          if (u.role == #SchoolAdmin) schools.put(u.schoolId, true);
          if (u.role == #Teacher) teacherCount += 1;
        };
        for ((_, prog) in moduleProgress.entries()) {
          completionCount += prog.size();
        };
        #ok({ totalSchools = schools.size(); totalTeachers = teacherCount; totalCompletions = completionCount })
      };
      case null #err("User not found");
    }
  };

  public func _initializeAccessControlWithSecret(_ : Text) : async () {};
}
