import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SwapRequest,
  SwapSession,
  InAppNotification,
  SessionFeedback,
  SessionDuration,
  SkillItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface AppContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  requests: SwapRequest[];
  sessions: SwapSession[];
  notifications: InAppNotification[];
  currentRoute: string;
  activeModal: string | null;
  modalPayload: any;
  unreadCount: number;
  
  // Navigation & Modals
  navigateTo: (route: string) => void;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;
  
  // User Management
  switchUser: (userId: string) => void;
  startNewUserOnboarding: () => void;
  publishProfile: (data: {
    displayName: string;
    headline: string;
    bio: string;
    timezone: string;
    skillsOffered: SkillItem[];
    skillsRequested: SkillItem[];
  }) => { success: boolean; error?: string };
  updateProfile: (data: Partial<UserProfile>) => { success: boolean; error?: string };
  
  // Proposals & Swaps
  sendSwapProposal: (params: {
    recipientId: string;
    senderSkill: string;
    recipientSkill: string;
    introNote: string;
  }) => { success: boolean; error?: string };
  acceptSwapRequest: (requestId: string) => void;
  declineSwapRequest: (requestId: string, reason?: string) => void;
  
  // Sessions & Scheduling
  proposeSessionSchedule: (params: {
    sessionId: string;
    date: string;
    time: string;
    durationMinutes: SessionDuration;
    meetingUrl: string;
  }) => { success: boolean; error?: string };
  confirmSessionSchedule: (sessionId: string) => void;
  cancelSession: (sessionId: string, reason: string) => { success: boolean; error?: string };
  submitFeedback: (sessionId: string, feedback: SessionFeedback) => { success: boolean; error?: string };
  exportCalendarIcs: (session: SwapSession) => void;
  
  // Notifications & Helpers
  markNotificationRead: (notifId: string) => void;
  calculateCompatibility: (userA: UserProfile, userB: UserProfile) => {
    isReciprocalMatch: boolean;
    userATeachesB: string[];
    userBTeachesA: string[];
    matchPercentage: number;
  };
  getPartnerForSession: (session: SwapSession, currentUserId: string) => UserProfile | undefined;
  getUserById: (id: string) => UserProfile | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('skillswap_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('skillswap_current_user_id');
    return saved || 'user_ayesha';
  });

  const [requests, setRequests] = useState<SwapRequest[]>(() => {
    const saved = localStorage.getItem('skillswap_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [sessions, setSessions] = useState<SwapSession[]>(() => {
    const saved = localStorage.getItem('skillswap_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('skillswap_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentRoute, setCurrentRoute] = useState<string>('/explore');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('skillswap_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('skillswap_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('skillswap_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('skillswap_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('skillswap_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  // Unread notifications count
  const unreadCount = notifications.filter(
    (n) => n.userId === currentUserId && !n.read
  ).length;

  const navigateTo = (route: string) => {
    // If user is unpublished and trying to access protected routes, divert to onboarding
    if (currentUser && !currentUser.published && route !== '/onboarding' && route !== '/') {
      setCurrentRoute('/onboarding');
      return;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (modalName: string, payload?: any) => {
    setActiveModal(modalName);
    setModalPayload(payload || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    closeModal();
  };

  const startNewUserOnboarding = () => {
    const newId = `user_draft_${Date.now()}`;
    const draftUser: UserProfile = {
      id: newId,
      displayName: 'New Freelancer',
      headline: 'Independent Creator',
      bio: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
      published: false,
      averageRating: 5.0,
      totalCompletedSessions: 0,
      avatarColor: 'from-amber-600 to-orange-700',
      avatarInitials: 'NF',
      memberSince: 'October 2026',
      skillsOffered: [],
      skillsRequested: []
    };

    setUsers((prev) => [...prev.filter(u => u.published), draftUser]);
    setCurrentUserId(newId);
    setCurrentRoute('/onboarding');
  };

  const publishProfile = (data: {
    displayName: string;
    headline: string;
    bio: string;
    timezone: string;
    skillsOffered: SkillItem[];
    skillsRequested: SkillItem[];
  }) => {
    if (!data.displayName.trim()) {
      return { success: false, error: 'Display name is required.' };
    }
    if (data.bio.length > 300) {
      return { success: false, error: 'Bio must not exceed 300 characters.' };
    }
    if (data.skillsOffered.length < 1 || data.skillsOffered.length > 5) {
      return { success: false, error: 'You must add between 1 and 5 offered skills.' };
    }
    if (data.skillsRequested.length < 1 || data.skillsRequested.length > 5) {
      return { success: false, error: 'You must add between 1 and 5 requested skills.' };
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUserId) {
          const initials = data.displayName
            .split(' ')
            .map((p) => p[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';

          return {
            ...u,
            ...data,
            avatarInitials: initials,
            published: true
          };
        }
        return u;
      })
    );

    setCurrentRoute('/dashboard');
    return { success: true };
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (data.bio && data.bio.length > 300) {
      return { success: false, error: 'Bio must not exceed 300 characters.' };
    }
    if (data.skillsOffered && (data.skillsOffered.length < 1 || data.skillsOffered.length > 5)) {
      return { success: false, error: 'You must maintain between 1 and 5 offered skills.' };
    }
    if (data.skillsRequested && (data.skillsRequested.length < 1 || data.skillsRequested.length > 5)) {
      return { success: false, error: 'You must maintain between 1 and 5 requested skills.' };
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...data } : u))
    );
    return { success: true };
  };

  const sendSwapProposal = ({
    recipientId,
    senderSkill,
    recipientSkill,
    introNote
  }: {
    recipientId: string;
    senderSkill: string;
    recipientSkill: string;
    introNote: string;
  }) => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to send a proposal.' };
    }
    if (currentUser.id === recipientId) {
      return { success: false, error: 'You cannot send a swap request to yourself.' };
    }
    const trimmedNote = introNote.trim();
    if (trimmedNote.length < 20 || trimmedNote.length > 500) {
      return {
        success: false,
        error: 'Introductory note must be between 20 and 500 characters.'
      };
    }

    // Check if duplicate pending request exists
    const existing = requests.find(
      (r) =>
        r.senderId === currentUser.id &&
        r.recipientId === recipientId &&
        r.status === 'Pending'
    );
    if (existing) {
      return {
        success: false,
        error: 'An active proposal to this peer is already pending.'
      };
    }

    const newRequest: SwapRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      senderSkill,
      recipientSkill,
      introNote: trimmedNote,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Add in-platform notification for recipient
    const newNotif: InAppNotification = {
      id: `notif_${Date.now()}`,
      userId: recipientId,
      title: 'New Swap Proposal',
      message: `${currentUser.displayName} proposed a skill swap: "${senderSkill}" for "${recipientSkill}".`,
      type: 'request',
      timestamp: new Date().toISOString(),
      read: false,
      linkAction: {
        type: 'request',
        targetId: newRequest.id
      }
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true };
  };

  const acceptSwapRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending') return;

    const newSessionId = `sess_${Date.now()}`;

    // Create session in 'Pending Confirmation' state
    const newSession: SwapSession = {
      id: newSessionId,
      swapRequestId: req.id,
      userAId: req.senderId,
      userBId: req.recipientId,
      skillTaughtByA: req.senderSkill,
      skillTaughtByB: req.recipientSkill,
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days ahead
      time: '14:00',
      durationMinutes: 45,
      meetingUrl: 'https://meet.google.com/new',
      status: 'Pending Confirmation',
      proposedBy: req.recipientId,
      proposedAt: new Date().toISOString(),
      feedbacks: {}
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Accepted', sessionId: newSessionId } : r))
    );

    setSessions((prev) => [newSession, ...prev]);

    // Notify sender that proposal was accepted
    const sender = users.find((u) => u.id === req.senderId);
    const recipient = users.find((u) => u.id === req.recipientId);
    if (sender && recipient) {
      const notif: InAppNotification = {
        id: `notif_${Date.now()}`,
        userId: sender.id,
        title: 'Swap Request Accepted',
        message: `${recipient.displayName} accepted your swap request! A session proposal has been created.`,
        type: 'acceptance',
        timestamp: new Date().toISOString(),
        read: false,
        linkAction: {
          type: 'session',
          targetId: newSessionId
        }
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const declineSwapRequest = (requestId: string, reason?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'Declined', declineReason: reason || 'Not a good fit at this time.' }
          : r
      )
    );
  };

  const proposeSessionSchedule = ({
    sessionId,
    date,
    time,
    durationMinutes,
    meetingUrl
  }: {
    sessionId: string;
    date: string;
    time: string;
    durationMinutes: SessionDuration;
    meetingUrl: string;
  }) => {
    // Validate meeting URL
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(meetingUrl.trim())) {
      return {
        success: false,
        error: 'Please provide a valid meeting URL (e.g., https://meet.google.com/abc-defg-hij).'
      };
    }

    if (!date || !time) {
      return { success: false, error: 'Please select both date and time.' };
    }

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            date,
            time,
            durationMinutes,
            meetingUrl: meetingUrl.trim(),
            status: 'Pending Confirmation',
            proposedBy: currentUserId,
            proposedAt: new Date().toISOString()
          };
        }
        return s;
      })
    );

    return { success: true };
  };

  const confirmSessionSchedule = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'Scheduled' } : s))
    );
  };

  const cancelSession = (sessionId: string, reason: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      return { success: false, error: 'Session not found.' };
    }

    if (!reason.trim()) {
      return { success: false, error: 'A cancellation reason is required.' };
    }

    // Verify 2-hour cancellation rule
    // Session start timestamp
    const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
    const now = new Date();
    const diffHours = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // If less than 2 hours before start and session is in the future
    if (diffHours < 2 && diffHours > -2) {
      return {
        success: false,
        error: 'Cancellation window has passed. Sessions cannot be cancelled less than 2 hours before the scheduled start time. Please contact support if you have an emergency.'
      };
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'Cancelled',
              cancelReason: reason,
              cancelledAt: new Date().toISOString(),
              cancelledBy: currentUserId
            }
          : s
      )
    );

    return { success: true };
  };

  const submitFeedback = (sessionId: string, feedback: SessionFeedback) => {
    if (!currentUser) return { success: false, error: 'Not authenticated.' };

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return { success: false, error: 'Session not found.' };

    const updatedFeedbacks = {
      ...session.feedbacks,
      [currentUser.id]: feedback
    };

    let nextStatus = session.status;
    if (!feedback.sessionTookPlace) {
      nextStatus = 'No-Show Reported';
    } else {
      // Check if both users gave feedback or normal completion
      const partnerId = session.userAId === currentUser.id ? session.userBId : session.userAId;
      if (updatedFeedbacks[partnerId]?.sessionTookPlace) {
        nextStatus = 'Completed';
      }
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: nextStatus,
              feedbacks: updatedFeedbacks
            }
          : s
      )
    );

    // If normal feedback, update user's completed sessions count and rating
    if (feedback.sessionTookPlace) {
      const reviewedUserId = session.userAId === currentUser.id ? session.userBId : session.userAId;
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === reviewedUserId) {
            const newCount = u.totalCompletedSessions + 1;
            const newRating = Number(
              ((u.averageRating * u.totalCompletedSessions + feedback.overallRating) / newCount).toFixed(1)
            );
            return {
              ...u,
              totalCompletedSessions: newCount,
              averageRating: newRating
            };
          }
          return u;
        })
      );
    }

    return { success: true };
  };

  const exportCalendarIcs = (session: SwapSession) => {
    const partner = getPartnerForSession(session, currentUserId);
    const partnerName = partner ? partner.displayName : 'Peer';

    // Parse start and end date
    const startStr = `${session.date.replace(/-/g, '')}T${session.time.replace(/:/g, '')}00`;
    const startDate = new Date(`${session.date}T${session.time}:00`);
    const endDate = new Date(startDate.getTime() + session.durationMinutes * 60000);
    const endHour = String(endDate.getHours()).padStart(2, '0');
    const endMin = String(endDate.getMinutes()).padStart(2, '0');
    const endStr = `${session.date.replace(/-/g, '')}T${endHour}${endMin}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SkillSwap//Peer Exchange Calendar 1.0//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:skillswap-${session.id}@skillswap.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:SkillSwap: ${session.skillTaughtByA} ⇄ ${session.skillTaughtByB} with ${partnerName}`,
      `DESCRIPTION:Peer-to-peer skill swap on SkillSwap.\\nMeeting link: ${session.meetingUrl}\\nDuration: ${session.durationMinutes} mins`,
      `LOCATION:${session.meetingUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `skillswap-${session.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const calculateCompatibility = (userA: UserProfile, userB: UserProfile) => {
    const aOffered = userA.skillsOffered.map((s) => s.name.toLowerCase());
    const aRequested = userA.skillsRequested.map((s) => s.name.toLowerCase());
    const bOffered = userB.skillsOffered.map((s) => s.name.toLowerCase());
    const bRequested = userB.skillsRequested.map((s) => s.name.toLowerCase());

    const userATeachesB = userA.skillsOffered
      .filter((s) => bRequested.includes(s.name.toLowerCase()))
      .map((s) => s.name);

    const userBTeachesA = userB.skillsOffered
      .filter((s) => aRequested.includes(s.name.toLowerCase()))
      .map((s) => s.name);

    const isReciprocalMatch = userATeachesB.length > 0 && userBTeachesA.length > 0;
    const matchPercentage = isReciprocalMatch
      ? 95
      : userATeachesB.length > 0 || userBTeachesA.length > 0
      ? 65
      : 25;

    return {
      isReciprocalMatch,
      userATeachesB,
      userBTeachesA,
      matchPercentage
    };
  };

  const getPartnerForSession = (session: SwapSession, curUserId: string) => {
    const partnerId = session.userAId === curUserId ? session.userBId : session.userAId;
    return users.find((u) => u.id === partnerId);
  };

  const getUserById = (id: string) => {
    return users.find((u) => u.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        requests,
        sessions,
        notifications,
        currentRoute,
        activeModal,
        modalPayload,
        unreadCount,
        navigateTo,
        openModal,
        closeModal,
        switchUser,
        startNewUserOnboarding,
        publishProfile,
        updateProfile,
        sendSwapProposal,
        acceptSwapRequest,
        declineSwapRequest,
        proposeSessionSchedule,
        confirmSessionSchedule,
        cancelSession,
        submitFeedback,
        exportCalendarIcs,
        markNotificationRead,
        calculateCompatibility,
        getPartnerForSession,
        getUserById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
