from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, time, timedelta
from apps.users.models import User
from apps.skills.models import Skill, UserSkill
from apps.swaps.models import SwapRequest
from apps.sessions_app.models import SwapSession, SessionFeedback
from apps.notifications.models import InAppNotification
from rest_framework.authtoken.models import Token

class Command(BaseCommand):
    help = "Seed initial demonstration data for SkillSwap platform"

    def handle(self, *args, **options):
        self.stdout.write("Clearing previous data...")
        InAppNotification.objects.all().delete()
        SessionFeedback.objects.all().delete()
        SwapSession.objects.all().delete()
        SwapRequest.objects.all().delete()
        UserSkill.objects.all().delete()
        Skill.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write("Seeding Users...")
        # 1. Ayesha Khan
        ayesha = User.objects.create_user(
            username="ayesha_ux",
            email="ayesha@example.com",
            password="Password123!",
            display_name="Ayesha Khan",
            headline="Aspiring UI/UX Designer & Student",
            bio="Final-year design student looking to sharpen mobile design workflows in Figma. Passionate about typography, design systems, and user research. Happy to help you with academic/business English!",
            timezone="Asia/Karachi",
            published=True,
            average_rating=4.90,
            total_completed_sessions=8,
            avatar_color="emerald",
            avatar_initials="AK"
        )
        Token.objects.get_or_create(user=ayesha)

        # 2. Marcus Lee
        marcus = User.objects.create_user(
            username="marcus_lee",
            email="marcus@example.com",
            password="Password123!",
            display_name="Marcus Lee",
            headline="Junior Web Developer & Language Learner",
            bio="Front-end enthusiast building clean accessible web apps with Tailwind and React. Preparing for a relocation to Madrid and eager to practice spoken conversational Spanish.",
            timezone="Europe/London",
            published=True,
            average_rating=4.80,
            total_completed_sessions=12,
            avatar_color="blue",
            avatar_initials="ML"
        )
        Token.objects.get_or_create(user=marcus)

        # 3. Elena Rostova
        elena = User.objects.create_user(
            username="elena_piano",
            email="elena@example.com",
            password="Password123!",
            display_name="Elena Rostova",
            headline="Classical Pianist & Creative Producer",
            bio="Conservatory graduate teaching ear training, chord theory, and foundational piano technique. Seeking hands-on guidance with digital audio workstations like Ableton Live.",
            timezone="Europe/Berlin",
            published=True,
            average_rating=5.00,
            total_completed_sessions=19,
            avatar_color="indigo",
            avatar_initials="ER"
        )
        Token.objects.get_or_create(user=elena)

        # 4. David Kim
        david = User.objects.create_user(
            username="david_kim",
            email="david@example.com",
            password="Password123!",
            display_name="David Kim",
            headline="Music Producer & Sound Engineer",
            bio="Freelance audio producer working in Ableton and Logic Pro. Looking to learn basic watercolor illustration for album artwork concepts.",
            timezone="America/Los_Angeles",
            published=True,
            average_rating=4.70,
            total_completed_sessions=6,
            avatar_color="violet",
            avatar_initials="DK"
        )
        Token.objects.get_or_create(user=david)

        # 5. Priya Patel
        priya = User.objects.create_user(
            username="priya_art",
            email="priya@example.com",
            password="Password123!",
            display_name="Priya Patel",
            headline="Illustrator & Concept Artist",
            bio="Traditional and digital artist specializing in watercolor and ink sketching. Always wanted to learn Python scripting for automating daily freelance asset exports.",
            timezone="Asia/Kolkata",
            published=True,
            average_rating=4.95,
            total_completed_sessions=22,
            avatar_color="amber",
            avatar_initials="PP"
        )
        Token.objects.get_or_create(user=priya)

        self.stdout.write("Seeding Skills...")
        def add_skill(user, skill_name, category, skill_type, level):
            name_clean = skill_name.strip()
            skill_obj = Skill.objects.filter(name__iexact=name_clean).first()
            if not skill_obj:
                skill_obj = Skill.objects.create(name=name_clean, category=category)
            UserSkill.objects.create(
                user=user,
                skill=skill_obj,
                skill_type=skill_type,
                level=level
            )

        # Ayesha skills
        add_skill(ayesha, "Conversational English", "Languages", "offered", "Advanced")
        add_skill(ayesha, "Academic Essay Writing", "Writing", "offered", "Advanced")
        add_skill(ayesha, "Figma", "Design", "requested", "Beginner")
        add_skill(ayesha, "UI Prototyping", "Design", "requested", "Beginner")
        add_skill(ayesha, "Design Systems", "Design", "requested", "Beginner")

        # Marcus skills
        add_skill(marcus, "Figma Basics", "Design", "offered", "Intermediate")
        add_skill(marcus, "Responsive Web Design", "Programming", "offered", "Advanced")
        add_skill(marcus, "JavaScript Fundamentals", "Programming", "offered", "Intermediate")
        add_skill(marcus, "Conversational Spanish", "Languages", "requested", "Beginner")
        add_skill(marcus, "Spanish Pronunciation", "Languages", "requested", "Beginner")

        # Elena skills
        add_skill(elena, "Piano Technique", "Music", "offered", "Advanced")
        add_skill(elena, "Music Theory & Harmony", "Music", "offered", "Advanced")
        add_skill(elena, "Ear Training", "Music", "offered", "Advanced")
        add_skill(elena, "Ableton Live", "Music Production", "requested", "Beginner")
        add_skill(elena, "Audio Mixing", "Music Production", "requested", "Beginner")

        # David skills
        add_skill(david, "Ableton Live", "Music Production", "offered", "Advanced")
        add_skill(david, "Audio Mixing", "Music Production", "offered", "Advanced")
        add_skill(david, "Beat Production", "Music Production", "offered", "Intermediate")
        add_skill(david, "Watercolor Illustration", "Art", "requested", "Beginner")
        add_skill(david, "Music Theory & Harmony", "Music", "requested", "Intermediate")

        # Priya skills
        add_skill(priya, "Watercolor Illustration", "Art", "offered", "Advanced")
        add_skill(priya, "Character Sketching", "Art", "offered", "Advanced")
        add_skill(priya, "Digital Inking", "Art", "offered", "Intermediate")
        add_skill(priya, "Python for Beginners", "Programming", "requested", "Beginner")
        add_skill(priya, "Responsive Web Design", "Programming", "requested", "Beginner")

        self.stdout.write("Seeding Swap Requests & Sessions...")
        # Swap 1: Ayesha -> Marcus (Accepted & Scheduled)
        req1 = SwapRequest.objects.create(
            sender=ayesha,
            recipient=marcus,
            sender_skill="Conversational English",
            recipient_skill="Figma Basics",
            intro_note="Hi Marcus! I can help you practice conversational English for tech interviews in exchange for feedback on my Figma mobile layout.",
            status="Accepted"
        )
        session1 = SwapSession.objects.create(
            swap_request=req1,
            user_a=ayesha,
            user_b=marcus,
            skill_taught_by_a="Conversational English",
            skill_taught_by_b="Figma Basics",
            session_date=date.today() + timedelta(days=2),
            session_time=time(15, 0),
            duration_minutes=45,
            meeting_url="https://meet.google.com/abc-defg-hij",
            status="Scheduled",
            proposed_by=marcus,
            proposed_at=timezone.now()
        )

        # Swap 2: Elena -> David (Accepted & Pending Confirmation)
        req2 = SwapRequest.objects.create(
            sender=elena,
            recipient=david,
            sender_skill="Music Theory & Harmony",
            recipient_skill="Ableton Live",
            intro_note="Hello David! I would love to learn MIDI routing in Ableton. In exchange, I can walk you through chord progressions and functional harmony.",
            status="Accepted"
        )
        session2 = SwapSession.objects.create(
            swap_request=req2,
            user_a=elena,
            user_b=david,
            skill_taught_by_a="Music Theory & Harmony",
            skill_taught_by_b="Ableton Live",
            session_date=date.today() + timedelta(days=4),
            session_time=time(18, 0),
            duration_minutes=60,
            meeting_url="https://meet.google.com/xyz-uvwx-rst",
            status="Pending Confirmation",
            proposed_by=elena,
            proposed_at=timezone.now()
        )

        # Swap 3: Priya -> Marcus (Pending)
        req3 = SwapRequest.objects.create(
            sender=priya,
            recipient=marcus,
            sender_skill="Watercolor Illustration",
            recipient_skill="Responsive Web Design",
            intro_note="Hi Marcus, would love to learn how to make portfolio galleries responsive with CSS Grid in exchange for hands-on watercolor sketching tips!",
            status="Pending"
        )

        self.stdout.write("Seeding Notifications...")
        InAppNotification.objects.create(
            user=ayesha,
            title="Session Schedule Confirmed!",
            message=f"Marcus Lee confirmed the session for {session1.session_date} at 15:00 UTC.",
            notification_type="schedule",
            target_type="session",
            target_id=str(session1.id)
        )
        InAppNotification.objects.create(
            user=marcus,
            title="New Swap Proposal",
            message=f"Priya Patel proposed a skill exchange (Watercolor Illustration for Responsive Web Design).",
            notification_type="request",
            target_type="request",
            target_id=str(req3.id)
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded SkillSwap database!"))
