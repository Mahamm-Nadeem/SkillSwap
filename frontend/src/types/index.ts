export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SkillItem {
  id: string;
  name: string;
  level: ProficiencyLevel;
  category?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  headline: string;
  bio: string; // max 300 characters
  timezone: string;
  skillsOffered: SkillItem[]; // 1 to 5 skills
  skillsRequested: SkillItem[]; // 1 to 5 skills
  published: boolean;
  averageRating: number;
  totalCompletedSessions: number;
  avatarColor: string;
  avatarInitials: string;
  memberSince: string;
}

export type SwapRequestStatus = 'Pending' | 'Accepted' | 'Declined';

export interface SwapRequest {
  id: string;
  senderId: string;
  recipientId: string;
  senderSkill: string; // Offered by sender
  recipientSkill: string; // Requested by sender (offered by recipient)
  introNote: string; // 20 - 500 characters
  status: SwapRequestStatus;
  declineReason?: string;
  createdAt: string;
  sessionId?: string;
}

export type SessionDuration = 30 | 45 | 60;

export type SessionStatus = 
  | 'Pending Confirmation' 
  | 'Scheduled' 
  | 'Completed' 
  | 'No-Show Reported' 
  | 'Cancelled';

export interface SessionFeedback {
  sessionTookPlace: boolean;
  punctualityRating: number; // 1-5
  knowledgeSharingRating: number; // 1-5
  overallRating: number; // 1-5
  reviewText?: string; // max 400 chars
  noShowDetails?: string;
  submittedAt: string;
}

export interface SwapSession {
  id: string;
  swapRequestId: string;
  userAId: string; // Sender of original swap
  userBId: string; // Recipient of original swap
  skillTaughtByA: string;
  skillTaughtByB: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: SessionDuration;
  meetingUrl: string;
  status: SessionStatus;
  proposedBy: string; // User ID who proposed the current time
  proposedAt: string;
  cancelReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  feedbacks: Record<string, SessionFeedback>; // userId -> feedback
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'acceptance' | 'schedule' | 'feedback' | 'cancelled';
  timestamp: string;
  read: boolean;
  linkAction?: {
    type: 'request' | 'session';
    targetId: string;
  };
}
