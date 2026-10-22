# API Contract: SkillSwap MVP

> Concise specification of all REST endpoints implemented by the SkillSwap backend.
> Base path: `/api/v1`

---

## Authentication & Profiles

### `POST /auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "ayesha@example.com",
  "username": "ayesha_ux",
  "password": "SecurePassword123!",
  "displayName": "Ayesha Khan"
}
```

**Success `201`:**
```json
{
  "token": "e0a1b2c3d4...",
  "user": {
    "id": 1,
    "email": "ayesha@example.com",
    "username": "ayesha_ux",
    "displayName": "Ayesha Khan",
    "published": false
  }
}
```
**Errors:** `400` validation error / email already taken.

---

### `POST /auth/login`
Authenticate with email/username and password.

**Request:**
```json
{
  "username": "ayesha@example.com",
  "password": "SecurePassword123!"
}
```

**Success `200`:**
```json
{
  "token": "e0a1b2c3d4...",
  "user": {
    "id": 1,
    "email": "ayesha@example.com",
    "displayName": "Ayesha Khan",
    "published": true
  }
}
```
**Errors:** `400` missing fields · `401` invalid credentials.

---

### `GET /auth/me`
Retrieve current authenticated user and profile state.
*Auth required.*

**Success `200`:**
```json
{
  "id": 1,
  "email": "ayesha@example.com",
  "displayName": "Ayesha Khan",
  "headline": "Aspiring UX Designer",
  "bio": "Final year student eager to learn Figma.",
  "timezone": "Asia/Karachi",
  "published": true,
  "averageRating": 4.9,
  "totalCompletedSessions": 8,
  "skillsOffered": [
    { "id": 1, "name": "Conversational English", "level": "Advanced", "category": "Languages" }
  ],
  "skillsRequested": [
    { "id": 2, "name": "Figma", "level": "Beginner", "category": "Design" }
  ]
}
```
**Errors:** `401` unauthorized.

---

### `POST /profiles/publish`
Onboarding step to publish initial profile with required skills (1–5 offered, 1–5 requested).
*Auth required.*

**Request:**
```json
{
  "displayName": "Ayesha Khan",
  "headline": "Aspiring UX Designer",
  "bio": "Final year student eager to learn Figma.",
  "timezone": "Asia/Karachi",
  "skillsOffered": [
    { "name": "Conversational English", "level": "Advanced", "category": "Languages" }
  ],
  "skillsRequested": [
    { "name": "Figma", "level": "Beginner", "category": "Design" }
  ]
}
```

**Success `200`:**
```json
{
  "success": true,
  "profile": {
    "id": 1,
    "published": true,
    "skillsOfferedCount": 1,
    "skillsRequestedCount": 1
  }
}
```
**Errors:** `400` validation failure (0 skills offered/requested, >5 skills, bio >300 chars) · `401` unauthorized.

---

### `GET /profiles/directory`
Explore & search published peer directory with skill and keyword filters.
*Public / Optional Auth.*

**Query Parameters:**
- `search`: string keyword
- `offered`: skill name filter
- `requested`: skill name filter
- `level`: `Beginner` | `Intermediate` | `Advanced`

**Success `200`:**
```json
{
  "count": 1,
  "results": [
    {
      "id": 2,
      "displayName": "Marcus Lee",
      "headline": "Junior Web Developer",
      "bio": "Frontend developer wanting conversational Spanish.",
      "timezone": "Europe/London",
      "averageRating": 4.8,
      "totalCompletedSessions": 12,
      "skillsOffered": [
        { "id": 3, "name": "Figma", "level": "Intermediate", "category": "Design" }
      ],
      "skillsRequested": [
        { "id": 4, "name": "Spanish", "level": "Beginner", "category": "Languages" }
      ]
    }
  ]
}
```

---

## Skill Swap Requests

### `POST /swaps/requests`
Send a swap proposal to a peer.
*Auth required.*

**Request:**
```json
{
  "recipientId": 2,
  "senderSkill": "Conversational English",
  "recipientSkill": "Figma",
  "introNote": "Hi Marcus! I can help you practice English in exchange for Figma guidance."
}
```

**Success `201`:**
```json
{
  "id": 10,
  "senderId": 1,
  "recipientId": 2,
  "senderSkill": "Conversational English",
  "recipientSkill": "Figma",
  "introNote": "Hi Marcus! I can help you practice English in exchange for Figma guidance.",
  "status": "Pending",
  "createdAt": "2026-10-22T10:00:00Z"
}
```
**Errors:** `400` note length not between 20 and 500 chars / swapping with self / missing skills · `401` unauthorized · `404` recipient not found.

---

### `GET /swaps/requests`
List swap requests for current user.
*Auth required.*

**Query Parameters:**
- `tab`: `incoming` | `outgoing`

**Success `200`:**
```json
[
  {
    "id": 10,
    "sender": { "id": 1, "displayName": "Ayesha Khan" },
    "recipient": { "id": 2, "displayName": "Marcus Lee" },
    "senderSkill": "Conversational English",
    "recipientSkill": "Figma",
    "introNote": "Hi Marcus! I can help you practice English in exchange for Figma guidance.",
    "status": "Pending",
    "createdAt": "2026-10-22T10:00:00Z"
  }
]
```

---

### `POST /swaps/requests/{id}/accept`
Accept an incoming swap request. Automatically initializes a swap session.
*Auth required (recipient only).*

**Success `200`:**
```json
{
  "id": 10,
  "status": "Accepted",
  "sessionId": 5
}
```
**Errors:** `400` request already resolved · `403` only recipient can accept · `404` not found.

---

### `POST /swaps/requests/{id}/decline`
Decline an incoming swap request with an optional reason.
*Auth required (recipient only).*

**Request:**
```json
{
  "reason": "Schedule full this month"
}
```

**Success `200`:**
```json
{
  "id": 10,
  "status": "Declined",
  "declineReason": "Schedule full this month"
}
```
**Errors:** `403` not recipient · `404` not found.

---

## Sessions & Scheduling

### `GET /sessions`
List scheduled and past swap sessions for current user.
*Auth required.*

**Query Parameters:**
- `status`: `scheduled` | `past`

**Success `200`:**
```json
[
  {
    "id": 5,
    "swapRequestId": 10,
    "userA": { "id": 1, "displayName": "Ayesha Khan" },
    "userB": { "id": 2, "displayName": "Marcus Lee" },
    "skillTaughtByA": "Conversational English",
    "skillTaughtByB": "Figma",
    "sessionDate": "2026-10-25",
    "sessionTime": "15:00:00",
    "durationMinutes": 45,
    "meetingUrl": "https://meet.google.com/abc-defg-hij",
    "status": "Scheduled",
    "proposedBy": 1
  }
]
```

---

### `POST /sessions/{id}/propose-schedule`
Propose or counter-propose a date, time, duration, and external meeting link.
*Auth required (session participant only).*

**Request:**
```json
{
  "sessionDate": "2026-10-25",
  "sessionTime": "15:00:00",
  "durationMinutes": 45,
  "meetingUrl": "https://meet.google.com/abc-defg-hij"
}
```

**Success `200`:**
```json
{
  "id": 5,
  "status": "Pending Confirmation",
  "proposedBy": 1,
  "sessionDate": "2026-10-25",
  "sessionTime": "15:00:00",
  "durationMinutes": 45,
  "meetingUrl": "https://meet.google.com/abc-defg-hij"
}
```
**Errors:** `400` invalid URL / invalid duration (must be 30, 45, 60) · `403` not participant.

---

### `POST /sessions/{id}/confirm-schedule`
Confirm proposed schedule time.
*Auth required (counterpart of proposer only).*

**Success `200`:**
```json
{
  "id": 5,
  "status": "Scheduled"
}
```
**Errors:** `400` cannot confirm own proposal or session not pending confirmation · `403` not participant.

---

### `POST /sessions/{id}/cancel`
Cancel a scheduled session with a mandatory reason (enforces $\ge 2$ hours prior cutoff).
*Auth required (session participant only).*

**Request:**
```json
{
  "reason": "Emergency conflict arose"
}
```

**Success `200`:**
```json
{
  "id": 5,
  "status": "Cancelled",
  "cancelReason": "Emergency conflict arose",
  "cancelledBy": 1
}
```
**Errors:** `400` cancellation inside 2-hour cutoff / missing reason · `403` not participant.

---

### `POST /sessions/{id}/feedback`
Submit mutual rating & review after session completion (unlocked 15 minutes after session end time).
*Auth required (session participant only).*

**Request:**
```json
{
  "sessionTookPlace": true,
  "punctualityRating": 5,
  "knowledgeSharingRating": 5,
  "overallRating": 5,
  "reviewText": "Marcus gave fantastic, actionable Figma critique!"
}
```

**Success `201`:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully."
}
```
**Errors:** `400` ratings not between 1 and 5 / review >400 chars / already submitted · `403` not participant.

---

### `GET /sessions/{id}/export-ics`
Download an iCalendar (`.ics`) file for the scheduled session.
*Auth required (session participant only).*

**Success `200`:**
`text/calendar; charset=utf-8` attachment.

---

## Notifications

### `GET /notifications`
List recent notifications for current user.
*Auth required.*

**Success `200`:**
```json
[
  {
    "id": 1,
    "title": "New Swap Proposal",
    "message": "Ayesha Khan sent you a swap proposal.",
    "type": "request",
    "read": false,
    "createdAt": "2026-10-22T10:00:00Z",
    "targetType": "request",
    "targetId": "10"
  }
]
```

---

### `POST /notifications/{id}/read`
Mark notification as read.
*Auth required.*

**Success `200`:**
```json
{ "success": true }
```
