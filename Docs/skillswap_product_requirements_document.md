# Product Requirements Document (PRD)
## Project: SkillSwap (B07 · General Software Products)

---

### Context Summary
* **App Name:** SkillSwap
* **Target Users:** Students, early-career professionals, self-taught creators, and hobbyists seeking reciprocal, low-cost learning.
* **Main Problem:** High financial barriers for personalized 1-on-1 tutoring and lack of structured, trusted platforms for mutual peer-to-peer knowledge exchange.
* **Unique Value:** Direct reciprocal barter model ("teach what you know, learn what you want") with built-in discovery, match negotiation, session scheduling, and verified peer feedback.

---

### 1. Problem Statement
Individuals wanting to learn practical skills (e.g., programming, conversational language, graphic design, musical instruments) often face prohibitively expensive tutoring rates or unguided, isolated self-study formats with high abandonment rates. Concurrently, millions possess intermediate or advanced skills they are willing to share in exchange for learning something new. Existing solutions either monetize every interaction (traditional marketplaces) or lack the verification, scheduling, and matching mechanisms necessary to arrange safe, reliable peer learning sessions.

---

### 2. Goals & Objectives (SMART)
1. **Match Conversion Rate:** Achieve an end-to-end match confirmation rate of $\ge 25\%$ among users who initiate a match request within 60 days of launch.
2. **Session Completion:** Facilitate at least 500 completed peer-to-peer learning sessions within the first 90 days post-launch.
3. **Session Satisfaction:** Maintain an average session satisfaction rating of $\ge 4.2$ out of 5 stars across all completed sessions during the MVP phase.
4. **Onboarding Efficiency:** Enable new users to register and list at least one "Skill Offered" and one "Skill Requested" in under 4 minutes.

---

### 3. Success Metrics
* **Monthly Active Exchange Users (MAEU):** Number of unique users who either send a match request, accept a request, or complete a session in a 30-day window.
* **Request Acceptance Latency:** Median time taken for a receiver to respond (accept/decline) to an incoming swap request (Target: $< 24$ hours).
* **Swap Completion Rate:** Percentage of accepted match requests that successfully result in a completed session and feedback submission (Target: $\ge 70\%$).
* **Reciprocity Balance Ratio:** Proportion of active users who both offer and receive at least one session per month (Target: $\ge 40\%$).

---

### 4. Target Personas

#### Persona 1: The Bootstrapping Career Switcher
* **Name:** Ayesha Khan
* **Demographics:** Age 23, Final-year University Student / Aspiring UX Designer, Urban center.
* **Pain Points:** 
  * Cannot afford \$40–\$80/hr professional UI/UX design mentorship.
  * Tutorial videos lack real-time feedback on her portfolio work.
* **Goals:** 
  * Learn Figma and UX research fundamentals from someone working in tech.
  * Share her fluent academic English and content writing skills in exchange.
* **Technical Proficiency:** Moderate (comfortable with SaaS web tools, Google Workspace, Discord).

#### Persona 2: The Self-Taught Coder & Language Enthusiast
* **Name:** Marcus Lee
* **Demographics:** Age 29, Junior Web Developer, Remote worker.
* **Pain Points:** 
  * Struggles with conversational Spanish immersion.
  * Generic language apps are repetitive and do not offer conversational practice.
* **Goals:** 
  * Practice spoken conversational Spanish with native speakers for 45 minutes weekly.
  * Offer practical HTML/CSS and introductory JavaScript debugging help in return.
* **Technical Proficiency:** Advanced (power user, web literate, familiar with developer tooling).

---

### 5. Features & Requirements

#### Tier P0 (Must-Have for Workshop MVP)

##### Feature 1: User Profiles & Skill Tags
* **Description:** User profile setup capturing biographical information, timezone, availability windows, skills offered, and skills requested.
* **User Story:** *As a new user, I want to list the skills I can teach and the skills I want to learn so that relevant exchange partners can discover me.*
* **Acceptance Criteria:**
  1. User can add 1 to 5 skills under "Offered" and 1 to 5 skills under "Requested".
  2. Each skill must be tagged with a proficiency level (`Beginner`, `Intermediate`, `Advanced`).
  3. System prompts an error state if the user attempts to publish a profile without at least one offered skill and one requested skill.
  4. Profile displays user’s display name, bio (up to 300 characters), timezone, and listed skills.
* **Success Metric:** $90\%$ of onboarded users successfully publish both an offered and requested skill during initial session.

##### Feature 2: Directory Discovery & Skill Matching Search
* **Description:** Searchable and filterable directory displaying user cards based on skills offered, skills requested, and keyword matching.
* **User Story:** *As a learner, I want to search for people offering a specific skill so that I can evaluate potential exchange partners.*
* **Acceptance Criteria:**
  1. Search bar allows querying by skill name keyword.
  2. Filter options allow isolating results by "Skills Offered", "Skills Requested", and "Proficiency Level".
  3. Search results render as cards showing name, match compatibility (offered vs. requested overlap indicator), and a direct "Request Swap" action button.
  4. Empty search states show clear guidance and a "Clear filters" action.
* **Success Metric:** Average time to locate a compatible match partner $< 90$ seconds.

##### Feature 3: Match Request & Negotiation Flow
* **Description:** A bilateral invitation system enabling User A to propose a skill exchange with User B.
* **User Story:** *As a user, I want to send a swap proposal with a custom message so that the other user can evaluate if our skills align.*
* **Acceptance Criteria:**
  1. Sender can select which of their offered skills they propose to teach and which of the recipient's skills they wish to learn.
  2. Sender can include a required introductory note (minimum 20 characters, maximum 500 characters).
  3. Recipient receives an on-platform notification and can click "Accept" or "Decline".
  4. Declined requests allow an optional reason selection and terminate the request state without opening a chat thread.
* **Success Metric:** $\ge 60\%$ of sent requests receive a status resolution (Accept or Decline) within 48 hours.

##### Feature 4: Basic Session Scheduling
* **Description:** A lightweight scheduling module where matched peers propose and confirm a date, time, and session meeting link.
* **User Story:** *As a matched peer, I want to agree on a date, time, and meeting link so that we have an agreed plan to conduct our swap session.*
* **Acceptance Criteria:**
  1. Once a swap request is accepted, either party can propose a date, time slot, duration (30, 45, or 60 minutes), and meeting URL (e.g., Google Meet, Zoom).
  2. The opposing party must click "Confirm Schedule" or "Propose New Time".
  3. Once confirmed, the session status updates to "Scheduled" and shows the agreed time converted automatically to each user's local timezone.
  4. Either user can cancel the scheduled session at least 2 hours prior with a mandatory reason note.
* **Success Metric:** $\ge 80\%$ of accepted matches schedule a session within 5 days.

##### Feature 5: Mutual Post-Session Feedback & Rating
* **Description:** A closed-loop rating and qualitative review form triggered after a scheduled session time has elapsed.
* **User Story:** *As a participant, I want to rate my peer and leave feedback so that honest and reliable members are recognized.*
* **Acceptance Criteria:**
  1. Feedback form unlocks automatically 15 minutes after the scheduled session end time.
  2. Form requires a 1-to-5 star rating for "Punctuality", "Knowledge Sharing", and "Overall Experience".
  3. Form includes an optional public review text field (max 400 characters).
  4. Aggregate score on a user's public profile updates only after both users have submitted feedback or after 72 hours have elapsed.
* **Success Metric:** Feedback completion rate $\ge 65\%$ across all completed sessions.

---

#### Tier P1 (Should-Have for Post-MVP / v1.0)
* **Direct 1-on-1 In-App Messaging:** Text chat between matched peers to discuss agendas prior to scheduling.
  * *User Story:* As a matched user, I want to message my peer directly on SkillSwap so that I don't need to share personal contact details before the session.
  * *Acceptance Criteria:* Messages send in real time; unread badges update; block/report actions available in chat header.
  * *Metric:* Messages per matched pair $\ge 4$.
* **Calendar Sync Integration (.ics / Google Calendar Export):** One-click export of scheduled sessions to personal calendars.
  * *User Story:* As a busy user, I want to add confirmed sessions to my Google Calendar so that I do not miss appointments.
  * *Acceptance Criteria:* Generates standard `.ics` file download and direct "Add to Google Calendar" OAuth/web link.
  * *Metric:* Calendar export click rate $\ge 40\%$ of scheduled sessions.
* **Automated Email Reminders:** Transactional notifications sent 24 hours and 1 hour before a scheduled session.
  * *User Story:* As a participant, I want email reminders so that I remember upcoming swap commitments.
  * *Acceptance Criteria:* Email triggers at $T-24\text{h}$ and $T-1\text{h}$; contains session link, partner name, and timezone-adjusted time.
  * *Metric:* Session no-show rate reduced to $< 10\%$.

---

#### Tier P2 (Nice-to-Have / Future Enhancements)
* **Skill Badges & Endorsements:** Users receive skill badges after completing $\ge 5$ sessions in a specific skill category with an average score $> 4.5$.
* **Asynchronous Video/File Reviews:** Bartering code reviews or design critiques asynchronously instead of live synchronous calls.
* **Group Skill Circles:** One-to-many peer workshops where 1 teacher hosts up to 4 learners simultaneously in a round-robin format.

---

### 6. Explicitly Out of Scope (For Workshop MVP & V1.0)
1. **Monetary Transactions & Paid Tiers:** No credit card processing, payment gateways, or options to pay cash instead of swapping skills.
2. **Native Video Conferencing Infrastructure:** SkillSwap will not build or host native WebRTC video rooms; users will supply third-party meeting links (Zoom, Google Meet, Teams).
3. **Automated Skill Verification / Quizzes:** No automated testing or proctoring to independently verify skill levels; rely strictly on peer reviews.
4. **Native Mobile Applications:** iOS and Android native apps are strictly excluded; focus is 100% on a responsive web application.
5. **Multi-Party / Group Swaps:** No 3-way or circular trade algorithms (e.g., A teaches B, B teaches C, C teaches A); only direct 1-to-1 bilateral swaps.
6. **File Storage & Asset Hosting:** Users cannot upload project files, large videos, or portfolio assets directly to the platform servers.

---

### 7. User Scenarios

#### Scenario 1: Successful Discovery to Confirmed Match
* **Context:** Ayesha searches for someone to review her Figma design portfolio.
* **Step-by-Step Flow:**
  1. Ayesha navigates to `/explore` and filters by "Skills Offered: Figma".
  2. System displays Marcus’s profile card indicating he offers "Figma Basics" and seeks "Conversational English".
  3. Ayesha clicks "Request Swap", selects her offered skill ("English"), and types: *"Hi Marcus! I can help you practice conversational English for tech interviews in exchange for feedback on my Figma mobile layout."*
  4. System validates character count, transitions request status to `Pending`, and sends an on-screen alert to Marcus.
  5. Marcus logs in, views the request under `/requests`, reads Ayesha’s note, and clicks "Accept Swap".
* **Expected Outcome:** Request moves to `Accepted` status; both users are prompted with a button to "Schedule Session".
* **Edge Case / Error Handling:** If Marcus declines, the system requires him to pick a quick reason (e.g., "Schedule full", "Skill mismatch"). Ayesha receives a polite status update (`Declined`), and no further action is allowed on that thread.

#### Scenario 2: Proposing and Rescheduling a Session Time
* **Context:** Marcus and Ayesha coordinate a time to meet online.
* **Step-by-Step Flow:**
  1. Marcus clicks "Schedule Session" inside the accepted swap view.
  2. Marcus selects Friday at 6:00 PM (his local timezone: UTC+1), enters duration (45 mins), and pastes a Google Meet URL.
  3. System converts the proposed time to Ayesha’s timezone (UTC+5: Friday at 10:00 PM) and displays a "Pending Confirmation" banner on both accounts.
  4. Ayesha reviews the proposed time, sees it conflicts with her schedule, and clicks "Propose New Time" (Saturday at 3:00 PM UTC+5).
  5. Marcus receives the counter-proposal, verifies availability, and clicks "Confirm Schedule".
* **Expected Outcome:** Session status is locked as `Scheduled`. Both parties see the final confirmed time in their respective local timezones along with the clickable video link.
* **Edge Case / Error Handling:** If the video link field contains an invalid URL format (e.g., missing protocol or invalid domain), the form blocks submission with an inline validation error: *"Please provide a valid URL (e.g., https://meet.google.com/abc-defg-hij)"*.

#### Scenario 3: Post-Session Review and Disputed Attendance
* **Context:** A scheduled session time elapses, but one party fails to attend (no-show).
* **Step-by-Step Flow:**
  1. 15 minutes after the scheduled end time, both users receive a prompt: *"Did your session with [Partner] take place?"*
  2. Ayesha clicks "Yes" and fills out the 5-star rating and leaves feedback: *"Marcus gave fantastic, actionable Figma critique!"*
  3. Marcus never joined the call and does not log in to respond.
  4. After 72 hours of inactivity from Marcus, the system automatically closes the review window.
* **Expected Outcome:** Ayesha’s review is published to Marcus’s profile. Marcus does not receive credit for completing a reciprocal session.
* **Edge Case / Error Handling:** If Ayesha clicks "No, partner did not show up", the system tags the session as `No-Show Reported`, prompts Ayesha for details, suppresses the public rating form, and flags Marcus’s reliability score internally.

---

### 8. Non-Functional Requirements (NFRs)
* **Performance:**
  * Directory search and filter queries must return results in $< 500\text{ ms}$ for a database of up to 100,000 profile records.
  * Core web pages must achieve a Google Lighthouse Performance score $\ge 85$.
* **Security & Privacy:**
  * User authentication must use salted password hashing (e.g., bcrypt factor $\ge 12$) or secure OAuth 2.0 (Google/GitHub).
  * Direct contact info (email addresses, phone numbers) must never be exposed publicly on profile cards.
  * Protection against standard web vulnerabilities: mandatory CSRF tokens, strict Content Security Policy (CSP), and parameterized queries to prevent SQL/NoSQL injection.
* **Accessibility:**
  * Strict adherence to WCAG 2.1 Level AA standards.
  * All interactive elements (forms, buttons, modal windows) must be 100% operable via keyboard navigation with visible focus rings.
  * Contrast ratio of at least $4.5:1$ for normal text and $3:1$ for large text.
* **Scalability:**
  * Architecture must support at least 200 concurrent active users and up to 50 match requests per minute without degradation.

---

### 9. Dependencies & Constraints
* **Dependencies:**
  * **Transactional Email Service:** External email delivery provider (e.g., SendGrid, Postmark, AWS SES) for transactional confirmation and reminder emails.
  * **Timezone Resolution Engine:** Client-side and server-side IANA timezone database handling (e.g., Luxon/Day.js) for accurate cross-timezone conversion.
* **Constraints:**
  * **Zero Monetization Infrastructure:** No integration with payment processors (Stripe, PayPal); all platform mechanics must remain barter/reciprocal.
  * **Browser Support:** Must function seamlessly on modern evergreen desktop and mobile browsers (Chrome, Firefox, Safari, Edge, last 2 major versions).

---

### 10. Release Timeline & Milestones

| Milestone | Target Date | Included Scope & Deliverables |
| :--- | :--- | :--- |
| **M1: Workshop MVP** | **Week 4** | User onboarding, profile creation with Offered/Requested skill tags, directory search & filtering, match request flow (Accept/Decline), basic time-slot proposal & third-party link submission, post-session rating form. |
| **M2: Beta Testing** | **Week 6** | Closed cohort test (50 users), bug squashing, match response latency tracking, edge-case validation (no-shows, cancellations). |
| **M3: V1.0 General Launch** | **Week 8** | Direct 1-on-1 text messaging, automated email reminders ($T-24\text{h}$, $T-1\text{h}$), calendar export (`.ics`), user blocking & content reporting mechanisms. |