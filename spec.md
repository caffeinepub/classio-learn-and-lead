# Classio Learn - Password Authentication

## Current State
The login page only has a username field. The backend `login` function takes only a username (no password). Users are authenticated by username alone.

## Requested Changes (Diff)

### Add
- Password field to the login form with show/hide eye toggle
- Password stored in backend User type
- Default password for seeded admin account
- Password parameter to createSchoolAdmin and createTeacher functions
- changePassword function for teachers

### Modify
- Backend `login` function to accept username + password
- LoginPage to include both username and password inputs
- createSchoolAdmin and createTeacher to store password

### Remove
- Nothing removed

## Implementation Plan
1. Update backend main.mo: add password to User, update login(username, password), update createSchoolAdmin/createTeacher to accept password, add changePassword
2. Update LoginPage.tsx: add separate password field, update handleSubmit to pass both username and password
3. Update all places in frontend that call createSchoolAdmin/createTeacher to include password field
