import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SwapRequest } from '../types';
import { 
  Inbox, 
  Send, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  AlertCircle, 
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';

export const RequestsPage: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    users, 
    acceptSwapRequest, 
    declineSwapRequest, 
    navigateTo, 
    sessions 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [decliningRequestId, setDecliningRequestId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<string>('Schedule conflict at this time');

  if (!currentUser) return null;

  // Filter requests
  const incomingRequests = requests.filter((r) => r.recipientId === currentUser.id);
  const outgoingRequests = requests.filter((r) => r.senderId === currentUser.id);

  const displayedRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  const handleConfirmDecline = (requestId: string) => {
    declineSwapRequest(requestId, declineReason);
    setDecliningRequestId(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Swap Proposals Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Manage incoming proposals from potential partners and track your outgoing swap invitations.
          </p>
        </div>

        {/* Tab Controls (Functional Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'incoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Incoming</span>
            {incomingRequests.filter((r) => r.status === 'Pending').length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-mono rounded">
                {incomingRequests.filter((r) => r.status === 'Pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'outgoing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Outgoing</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({outgoingRequests.length})
            </span>
          </button>
        </div>
      </div>

      {/* Decline Reason Modal */}
      {decliningRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Decline Swap Proposal
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an optional reason to let the sender know why this exchange isn't a fit right now:
            </p>
            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 mb-5"
            >
              <option value="Schedule conflict at this time">Schedule conflict at this time</option>
              <option value="Already practicing this skill with another peer">Already practicing this skill with another peer</option>
              <option value="Timezone incompatibility">Timezone incompatibility</option>
              <option value="Proficiency level mismatch">Proficiency level mismatch</option>
              <option value="Other commitments">Other commitments</option>
            </select>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDecliningRequestId(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
              <button
                onClick={() => handleConfirmDecline(decliningRequestId)}
                className="px-4 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      {displayedRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            {activeTab === 'incoming' ? (
              <Inbox className="w-6 h-6" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No {activeTab} proposals yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'incoming'
              ? 'When other members discover your profile and propose a swap, their proposals will appear here.'
              : 'You have not sent any swap proposals yet. Explore published peers to initiate a skill trade!'}
          </p>
          <div className="mt-5">
            <button
              onClick={() => navigateTo('/explore')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Browse Directory
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((req) => {
            const otherUserId = activeTab === 'incoming' ? req.senderId : req.recipientId;
            const otherUser = users.find((u) => u.id === otherUserId);

            // Related session if accepted
            const relatedSession = req.sessionId
              ? sessions.find((s) => s.id === req.sessionId)
              : null;

            return (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Partner Info */}
                  <div className="flex items-start gap-3.5">
                    <AvatarVisual
                      id={otherUser?.id || 'unknown'}
                      name={otherUser?.displayName || 'Peer'}
                      initials={otherUser?.avatarInitials || 'P'}
                      gradientClass={otherUser?.avatarColor || 'from-slate-600 to-slate-800'}
                      size="md"
                      showStatus={true}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {otherUser?.displayName || 'Unknown Peer'}
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">
                          {otherUser?.timezone.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {otherUser?.headline}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {req.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending Review
                      </span>
                    )}
                    {req.status === 'Accepted' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Accepted Match
                      </span>
                    )}
                    {req.status === 'Declined' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
                        <X className="w-3 h-3 text-slate-400" />
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Exchange Pair Details */}
                <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        {activeTab === 'incoming' ? `${otherUser?.displayName} Teaches` : 'You Teach'}
                      </span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {req.senderSkill}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        {activeTab === 'incoming' ? 'You Teach' : `${otherUser?.displayName} Teaches`}
                      </span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {req.recipientSkill}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Intro Note */}
                <div className="mt-3.5 text-xs text-slate-600 bg-white border border-slate-100 rounded-lg p-3">
                  <p className="italic">"{req.introNote}"</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">
                    Sent {new Date(req.createdAt).toLocaleDateString()} at{' '}
                    {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Decline reason note if declined */}
                {req.status === 'Declined' && req.declineReason && (
                  <p className="mt-2 text-xs text-slate-500 italic">
                    Reason: {req.declineReason}
                  </p>
                )}

                {/* Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Request ID: {req.id}
                  </span>

                  {activeTab === 'incoming' && req.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDecliningRequestId(req.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptSwapRequest(req.id)}
                        className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Swap</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'Accepted' && relatedSession && (
                    <button
                      onClick={() => navigateTo('/sessions')}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-700" />
                      <span>Coordinate Session Schedule</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
