from datetime import datetime, timedelta
import zoneinfo

def generate_ics_content(session) -> str:
    """
    Generates standard RFC 5545 iCalendar content for a SwapSession.
    """
    if not session.session_date or not session.session_time:
        raise ValueError("Cannot export calendar file for session without date and time.")

    start_dt = datetime.combine(session.session_date, session.session_time)
    end_dt = start_dt + timedelta(minutes=session.duration_minutes)

    # Format in UTC/Zulu representation
    dtstamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    dtstart = start_dt.strftime("%Y%m%dT%H%M%SZ")
    dtend = end_dt.strftime("%Y%m%dT%H%M%SZ")

    summary = f"SkillSwap: {session.skill_taught_by_a} & {session.skill_taught_by_b}"
    description = (
        f"SkillSwap 1-on-1 Peer Session\\n"
        f"Participants: {session.user_a.display_name} & {session.user_b.display_name}\\n"
        f"Topics: {session.skill_taught_by_a} <-> {session.skill_taught_by_b}\\n"
        f"Meeting Link: {session.meeting_url}"
    )

    ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SkillSwap//SkillSwap Session Scheduling//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        f"UID:skillswap-session-{session.id}@skillswap.app",
        f"DTSTAMP:{dtstamp}",
        f"DTSTART:{dtstart}",
        f"DTEND:{dtend}",
        f"SUMMARY:{summary}",
        f"DESCRIPTION:{description}",
        f"URL:{session.meeting_url}",
        f"LOCATION:{session.meeting_url}",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ]

    return "\r\n".join(ics)
