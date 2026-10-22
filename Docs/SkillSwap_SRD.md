# SRD: SkillSwap MVP

## 1. Goal
Build a peer-to-peer skill exchange platform where users teach skills they already have in exchange for learning skills they want, without monetary payments.

## 2. Users
- **Learner:** Searches for people who can teach a desired skill and requests a skill exchange.
- **Peer Teacher:** Lists skills they can teach, responds to exchange requests, and learns from their exchange partner.

A user can act as both a learner and a peer teacher.

## 3. Main Workflow
1. A user signs up and logs in.
2. The user creates a profile listing skills they offer and skills they want to learn.
3. The user searches and filters profiles to find a suitable exchange partner.
4. The user sends a swap request with a message explaining the proposed exchange.
5. The recipient accepts or declines the request.
6. If accepted, both users schedule a session and add a meeting link.
7. After the session, users submit ratings and optional written feedback.

## 4. Must-Have Features
- User authentication and profile management.
- Profiles with offered and requested skills, proficiency levels, and descriptions.
- Searchable user directory with relevant filters.
- Skill-swap requests with a message, acceptance, and decline options.
- Session scheduling for 30, 45, or 60 minutes.
- Time-zone-aware session times and an external meeting link.
- Session cancellation with a reason.
- Post-session ratings for punctuality, knowledge sharing, and overall experience.
- Optional written reviews.
- Authorization checks to prevent users from modifying other users' requests or sessions.
- Responsive interface with loading, empty, validation, and error states.

## 5. Out of Scope
- Payments or paid tutoring.
- Native mobile applications.
- Built-in video conferencing.
- In-app messaging.
- Automated skill verification quizzes.
- File hosting and asynchronous video reviews.
- Group skill exchanges and multi-party trades.

## 6. Acceptance Check
A user can register, create a profile with at least one offered skill and one requested skill, find a suitable exchange partner, and send a swap request. The recipient can accept the request, both users can schedule a session and add a meeting link, and both can submit feedback after the session. Unauthorized users cannot access protected account information or modify another user's requests or sessions.

## 7. Build Notes
- **Frontend:** React with a responsive interface.
- **Backend:** Python/Django REST API.
- **Database:** Supabase.
- **Authentication:** [DECIDE: confirm whether to use Supabase Auth or another authentication provider].
- **Meetings:** Use external meeting links instead of building video conferencing.
- **Deployment:** Deploy the frontend and backend according to the chosen hosting setup.

## 8. Decisions to Finalize
- [DECIDE] Skill categories and matching rules.
- [DECIDE] Whether users can have multiple active requests with the same person.
- [DECIDE] Rules for confirming session completion and handling missed sessions.
- [DECIDE] Whether feedback is one-sided or requires both users to submit it.
- [DECIDE] Cancellation exceptions and dispute handling.
- [DECIDE] Account deletion and data-retention policy.
