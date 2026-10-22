# Application Flow Documentation (APP_FLOW.md)

**Application Name:** SkillSwap

**Platform Architecture:** Responsive Web Application (React frontend, Django REST API backend, Supabase DB/Auth)

**Version:** 1.0 Baseline

## 1. ENTRY POINTSCreate comprehensive Application Flow documentation (APP_FLOW.md) for \[YOUR APP NAME\].

Context:

\[Provide brief description of app\]

Generate documentation with these sections:

1\. ENTRY POINTS

List all ways users can enter the app:

\- Direct URL access

\- Deep links (email, notifications)

\- OAuth/social login

\- Search engines

\- Marketing campaigns

2\. CORE USER FLOWS

For each major user task, create a detailed flow:

Required Flows:

\- User onboarding/registration

\- Main feature usage (e.g., create post, make purchase, book appointment)

\- Account management

\- Error recovery

For EACH flow, document:

\*\*HAPPY PATH\*\* (Step-by-step):

\- Page/Screen name

\- UI elements present

\- User actions (clicks, inputs)

\- System responses

\- Validation rules

\- Next page/state

\- Success criteria

\*\*ERROR STATES\*\* (What can go wrong):

\- Invalid inputs (how they're handled)

\- System errors (display and recovery)

\- Timeout scenarios

\- Offline behavior

\*\*EDGE CASES\*\*:

\- User abandons flow

\- User goes back

\- Concurrent actions

\- Session expiry

3\. NAVIGATION MAP

Create a hierarchical tree showing:

\- Main navigation structure

\- Sub-pages and nesting

\- Cross-links between sections

\- Authentication requirements per page

4\. SCREEN INVENTORY

For each unique screen/page, specify:

\- URL/Route

\- Access level (public/authenticated/admin)

\- Purpose

\- Key UI elements

\- Available actions → where they lead

\- State variants (loading, empty, error, success)

5\. DECISION POINTS

Document every conditional in the flow using IF-THEN logic:

### Direct URL Access

* `https://skillswap.app/` — Public landing page explaining product principles and reciprocal skill barter.

* `https://skillswap.app/explore` — Publicly discoverable directory of published peer profiles.

* `https://skillswap.app/login` & `https://skillswap.app/register` — Direct authentication access routes.

* `https://skillswap.app/dashboard`, `https://skillswap.app/requests`, `https://skillswap.app/sessions` — Protected functional endpoints that trigger unauthenticated redirects to `/login?redirect=<path>`.

### Deep Links (Email & In-Platform Notifications)

* **Swap Proposal Notice:** `https://skillswap.app/requests/{request_id}` — Navigates directly to the proposal review screen.

* **Schedule Counter/Confirmation:** `https://skillswap.app/sessions/{session_id}/schedule` — Deep links partner into the scheduling proposal view.

* **Session Reminder (T-24h & T-1h):** `https://skillswap.app/sessions/{session_id}` — Navigates to confirmed room details containing the third-party meeting URL and `.ics` export.

* **Mutual Feedback Request (End Time + 15m):** `https://skillswap.app/sessions/{session_id}/feedback` — Lands directly on the post-session evaluation form.

### OAuth & Social Login

* `https://skillswap.app/auth/callback` — Inbound OAuth callback redirect endpoint handling authorization code exchanges with external identity providers.

### Search Engines (Organic SEO)

* Direct indexing of public canonical landing routes (`/`, `/explore`) and crawlable skill tags (e.g., `/explore?skill=Figma`) with OpenGraph meta-tags. Individual profile cards omit private user contact info.

### Marketing Campaigns

* Targeted acquisition campaigns landing at `https://skillswap.app/signup?utm_source={channel}&utm_campaign={campaign}`.

## 2. CORE USER FLOWS

```
       [ Unauthenticated ]
                │
                ▼
        ┌───────────────┐
        │ Register / In │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │  Onboarding   │◄─── Missing offered/requested skills
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │ Explore & Find│
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │ Swap Proposal │
        └───────┬───────┘
                ▼
         [ Recipient ] ──(Decline)──► [ Closed ]
                │
            (Accept)
                ▼
        ┌───────────────┐
        │ Schedule Slot │◄─── Counter-proposal Loop
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │ Session Live  │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │ Post-Feedback │
        └───────────────┘


```

### Flow 1: User Onboarding & Registration

#### Happy Path

 1. **Screen Name:** `RegistrationPage` (`/register`)

 2. UI Elements **Present:** Name input, Email input, Password input, Confirm Password input, "Create Account" CTA button, OAuth SSO buttons, link to `/login`.

 3. **User Actions:** User enters display name, valid email, and secure password, then clicks "Create Account".

 4. **System Responses:** System checks for existing accounts, registers user credentials, returns authenticated session token, and immediately routes to `/onboarding`.

 5. **Validation Rules:** Display name required; email format valid; password meets work factor requirements (salted password hashing equivalent to bcrypt cost 12 or stronger).

 6. **Next Page/State:** `OnboardingProfilePage` (`/onboarding`).

 7. **UI Elements Present (Onboarding):**

    * Bio textarea (maximum 300 characters, live counter).

    * Timezone picker (auto-detected via browser Intl API, editable).

    * Skills Offered section: autocomplete skill input, proficiency dropdown (`Beginner`, `Intermediate`, `Advanced`), "Add Offered Skill" button (accepts 1 to 5 skills).

    * Skills Requested section: autocomplete skill input, proficiency dropdown (`Beginner`, `Intermediate`, `Advanced`), "Add Requested Skill" button (accepts 1 to 5 skills).

    * "Publish Profile" primary action button.

 8. **User Actions:** User types bio, confirms timezone, selects at least 1 offered skill with proficiency, selects at least 1 requested skill with proficiency, and clicks "Publish Profile".

 9. **System Responses:** Validates 1–5 range on both categories, creates profile records, activates user state as `published = true`, and transitions to `/dashboard` with a success toast.

10. **Success Criteria:** User profile is marked published, visible in the directory, and onboarding duration is completed in under 4 minutes.

#### Error States

* **Duplicate or Invalid Credentials:** Inline warning: *"An account with this email already exists"* or *"Password does not meet complexity criteria"*.

* **Validation Errors on Onboarding:** If "Publish Profile" is pressed with 0 offered or 0 requested skills, highlight respective section inputs in red: *"The profile cannot be published unless it contains at least one offered skill and one requested skill"*.

* Bio Character **Exceeded:** Bio text area prevents entry past 300 characters and sets counter color to error state.

* **System/Network Errors:** API failure on publish triggers a non-destructive floating banner: *"Profile creation failed. Entered data remains available for retry."* Form entries remain populated in React state.

* **Offline Behavior:** Offline toast appears: *"Network connection lost. Please reconnect to save your profile."*

#### Edge Cases

* **Abandon Flow:** If user drops off during `/onboarding`, subsequent logins detect `published == false` and force redirect back to `/onboarding`. Unpublished profiles do not appear in public search.

* **Browser Back Button:** Pressing back from `/onboarding` to `/register` redirects immediately forward to `/onboarding` due to active auth session.

* **Concurrent Login:** Authenticating across devices synchronizes onboarding draft state via persistent server-side draft storage.

### Flow 2: Main Feature Usage (Directory Search, Proposal, Scheduling & Feedback)

#### Happy Path

 1. **Screen Name:** `ExplorePage` (`/explore`)

 2. **UI Elements Present:** Search keyword input, Filter drawer (`Skills Offered`, `Skills Requested`, `Proficiency Level`), Profile Card Grid (Display Name, Bio, Offered Tags, Requested Tags, Compatibility Match Indicator, "Request Swap" CTA).

 3. **User Actions:** User searches for a skill keyword, filters by proficiency level, inspects a card, and clicks "Request Swap".

 4. **Screen Name:** `SwapProposalModal` (`/explore?action=request&peer={peer_id}`)

 5. **UI Elements Present:** Sender's offered skill selector dropdown, Recipient's offered skill selector dropdown, Introductory note textarea (20–500 characters, live counter), Cancel button, "Send Proposal" CTA.

 6. **User Actions:** Sender selects one of their offered skills, selects one of the recipient's offered skills they want to learn, inputs an introductory note between 20 and 500 characters, and clicks "Send Proposal".

 7. **System Responses:** Validates note length (20–500 characters), verifies sender is not sending a request to themselves, records request as `Pending`, sends in-platform notification to recipient, closes modal, and displays a success alert.

 8. **Recipient Action:** Recipient visits `/requests`, opens incoming request, reviews details, and clicks "Accept Swap". Status moves to `Accepted`.

 9. **Screen Name:** `SessionScheduleModal` (`/sessions/{session_id}/schedule`)

10. **UI Elements Present:** Date picker, Time picker (shows local time and peer time conversion preview), Duration selector buttons (`30`, `45`, or `60 minutes`), Meeting URL input (third-party meeting link), "Propose Schedule" CTA.

11. **User Actions:** Either participant picks date/time, selects duration (30, 45, or 60 minutes), inputs external meeting URL, and clicks "Propose Schedule".

12. **System Responses:** Status updates to `Pending Confirmation`. Counterpart reviews proposal and clicks "Confirm Schedule". Status updates to `Scheduled`, displaying time in each participant's local timezone. Calendar export button (`.ics`) becomes available.

13. **Session Execution & Feedback:** 15 minutes after the scheduled session end time, status unlocks the post-session feedback prompt at `/sessions/{session_id}/feedback`.

14. **Feedback UI Elements:** Radio group: "Did session take place?" (Yes/No), 1–5 star ratings for `Punctuality`, `Knowledge Sharing`, and `Overall Experience`, optional written review textarea (up to 400 characters), "Submit Feedback" CTA.

15. **User Actions:** Both users submit feedback. Once both submit (or the 72-hour feedback window closes), aggregate profile scores update according to review rules.

16. **Success Criteria:** Swap moves from Proposal $\to$ Scheduled $\to$ Completed with recorded mutual feedback.

#### Error States

* **Invalid Meeting URL:** Input of non-URL or invalid format is rejected with an example of a valid URL (e.g., `https://meet.google.com/abc-defg-hij`).

* **Proposal Note Out of Bounds:** Submitting fewer than 20 or more than 500 characters blocks submission with an explanatory validation message.

* **Double Submission:** CTA button is disabled on click to prevent duplicate requests from accidental double-clicks.

* **Cancellation Inside Cutoff:** Cancelling less than 2 hours before session start is blocked by self-serve flow, communicating that the two-hour cancellation cutoff has passed.

* **No-Show Reported:** User indicates session did not take place; system records `No-Show Reported`, asks for details, and does not grant completed-session credit.

#### Edge Cases

* **Skill Removed During Proposal:** If the selected skill has been removed from the sender's or recipient's profile, the proposal is blocked and must be updated before submission.

* **Concurrent Proposals:** Concurrent schedule proposals prevent contradictory confirmed times by requiring confirmation before overwriting the active proposal.

* **Session Expiry:** Expired authentication tokens prompt a re-authentication modal without clearing entered form state.

### Flow 3: Account & Profile Management

#### Happy Path

1. **Screen Name:** `ProfileSettingsPage` (`/settings/profile`)

2. **UI Elements Present:** Display Name input, Avatar selector, Bio textarea (max 300 characters), Timezone selector dropdown, Offered Skills Manager (tag list with delete badge, add new skill tag + proficiency), Requested Skills Manager (tag list with delete badge, add new skill tag + proficiency), "Save Changes" CTA.

3. **User Actions:** User modifies bio, adjusts timezone, adds or deletes skills (maintaining 1–5 offered and 1–5 requested), and clicks "Save Changes".

4. **System Responses:** Re-validates that at least 1 offered skill and 1 requested skill remain present, commits changes to database, and reflects updates in subsequent directory results.

5. **Success Criteria:** Profile changes are saved and immediately reflected in directory searches.

#### Error States

* **Attempting to Delete Last Skill:** When attempting to remove the only remaining offered or requested skill, the interface blocks the action and identifies that at least one offered and one requested skill must remain.

* **Network Error:** Saves that fail keep entered data intact for retry and display a clear error message.

#### Edge Cases

* **Active Swap Dependency:** Deleting a skill currently associated with an active request preserves historical records but prevents new proposals against that skill tag.

### Flow 4: Error Recovery & Dispute Handling

#### Happy Path

1. **Screen Name:** `DisputedSessionPage` (`/sessions/{session_id}`)

2. **UI Elements Present:** Status banner: *"No-Show Reported"*, Detail submission summary, "Contact Support" action button.

3. **User Actions:** Participant reviews the reported no-show status and submits dispute or context details.

4. **System Responses:** Distinguishes reported no-show from an independently verified finding, retains report for platform dispute processing, and does not automatically award completed session credit.

## 3. NAVIGATION MAP

```
[ Public Zone ]
├── / (Landing Page)
├── /explore (Directory & Public Search)
├── /login (User Sign In)
├── /register (User Sign Up)
└── /terms & /privacy (Policies)

[ Authenticated Zone (Requires Valid Session) ]
├── /onboarding (Gated if profile incomplete)
├── /dashboard (Activity Overview & Upcoming Sessions)
├── /explore (Directory with active "Request Swap" action)
│    └── /explore?action=request&peer={id} (Swap Modal)
├── /requests (Swap Proposal Center)
│    ├── /requests?tab=incoming
│    ├── /requests?tab=outgoing
│    └── /requests/{id} (Proposal Detail & Acceptance View)
├── /sessions (Session Overview Hub)
│    ├── /sessions?status=scheduled
│    ├── /sessions?status=past
│    └── /sessions/{id} (Confirmed Session Details, Links, ICS export)
│         ├── /sessions/{id}/schedule (Propose / Counter-Propose Modal)
│         ├── /sessions/{id}/cancel (Cancellation Modal, >=2h rule)
│         └── /sessions/{id}/feedback (Rating & Review Form, unlocked T+15m)
├── /settings (Account Settings)
│    ├── /settings/profile (Skills, Bio, Timezone management)
│    └── /settings/account (Password, Email preferences)
└── /disputes/{id} (Dispute Resolution View)


```

## 4. SCREEN INVENTORY

| Route / Screen | Access Level | Primary Purpose | Key UI Elements | Available Actions $\to$ Target | State Variants | 
| ----- | ----- | ----- | ----- | ----- | ----- | 
| `/` (`LandingPage`) | Public | Introduce platform value proposition and direct skill barter model. | Hero CTA |  |  | 
