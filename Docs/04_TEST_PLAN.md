# Test Plan: SkillSwap MVP

> Verification suite for critical user journeys and high-risk edge cases in SkillSwap.

---

## 1. Critical Test Scenarios

| ID | Module | Scenario | Input / Action | Expected Result |
|---|---|---|---|---|
| **T1** | **Auth & Onboarding** | Register new user and publish profile | Provide email, password, 1 offered skill & 1 requested skill | Profile marked `published = true`, user visible in directory |
| **T2** | **Validation** | Publish profile without minimum skills | 0 offered skills or 0 requested skills | Rejected with `400 Bad Request` and clear validation error |
| **T3** | **Swap Proposal** | Send valid swap proposal | Select offered skill, recipient skill, 20–500 char note | Request saved as `Pending`; notification created for recipient |
| **T4** | **Validation** | Self-proposal & note length check | Attempt to propose swap to self, or submit note $<20$ chars | Blocked with `400 Bad Request` |
| **T5** | **Acceptance** | Recipient accepts swap request | Recipient clicks "Accept" | Request status moves to `Accepted`; SwapSession auto-created |
| **T6** | **Permissions** | Non-recipient attempts accept | Proposer or random user tries to accept | Rejected with `403 Forbidden` |
| **T7** | **Scheduling** | Propose & confirm time slot | Propose valid future time, 45 min, Google Meet URL | Counterpart confirms; session locks as `Scheduled` |
| **T8** | **Cancellation** | Cancel session $\ge 2$ hours prior | Provide cancellation reason 3 hours before start time | Session marked `Cancelled` with reason stored |
| **T9** | **Cancellation Rule** | Cancel session $< 2$ hours prior | Attempt cancellation 45 minutes before start time | Blocked with `400 Bad Request` enforcing 2-hour cutoff |
| **T10** | **Feedback** | Submit mutual rating & review | 5 stars across categories + 200 char review text | Review saved; average rating recalculated once conditions met |
| **T11** | **Dispute / No-show** | Report partner no-show | Select "Did not take place" with reason | Session marked `No-Show Reported`; no completed session credit |

---

## 2. Security & Authorization Checklist
- [x] Unauthenticated requests to `/api/v1/auth/me`, `/swaps/requests`, `/sessions` return `401 Unauthorized`.
- [x] User cannot accept/decline a swap request addressed to someone else (`403 Forbidden`).
- [x] User cannot confirm a schedule proposed by themselves (`400 Bad Request`).
- [x] User cannot modify or cancel sessions they are not a participant in (`403 Forbidden`).
- [x] Direct user emails are never exposed in public directory responses.

---

## 3. Automated Test Execution
Run automated backend test suite:
```bash
python manage.py test
```
