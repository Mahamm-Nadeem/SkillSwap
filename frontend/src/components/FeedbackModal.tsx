import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SwapSession, SessionFeedback } from '../types';
import { 
  X, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Send,
  ThumbsUp,
  Clock,
  BookOpen
} from 'lucide-react';

interface FeedbackModalProps {
  session: SwapSession;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ session }) => {
  const { currentUser, closeModal, submitFeedback, getPartnerForSession } = useApp();

  const partner = currentUser ? getPartnerForSession(session, currentUser.id) : undefined;

  const [sessionTookPlace, setSessionTookPlace] = useState<boolean>(true);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [knowledgeSharingRating, setKnowledgeSharingRating] = useState<number>(5);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [noShowDetails, setNoShowDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const reviewLength = reviewText.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!sessionTookPlace && !noShowDetails.trim()) {
      setErrorMsg('Please provide brief details regarding the missed meeting.');
      return;
    }

    if (reviewLength > 400) {
      setErrorMsg('Written review cannot exceed 400 characters.');
      return;
    }

    setIsSubmitting(true);

    const feedbackPayload: SessionFeedback = {
      sessionTookPlace,
      punctualityRating: sessionTookPlace ? punctualityRating : 1,
      knowledgeSharingRating: sessionTookPlace ? knowledgeSharingRating : 1,
      overallRating: sessionTookPlace ? overallRating : 1,
      reviewText: sessionTookPlace ? reviewText.trim() : undefined,
      noShowDetails: !sessionTookPlace ? noShowDetails.trim() : undefined,
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      const res = submitFeedback(session.id, feedbackPayload);
      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit feedback.');
      }
    }, 400);
  };

  const renderStarSelector = (
    label: string, 
    value: number, 
    onChange: (val: number) => void,
    icon: React.ReactNode
  ) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <span className="text-xs font-medium text-slate-800">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-mono font-bold text-slate-700 w-4 text-right ml-1">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Mutual Session Feedback
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate exchange with {partner?.displayName || 'Peer'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {sessionTookPlace ? 'Feedback Recorded!' : 'Incident Reported'}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {sessionTookPlace
                ? 'Thank you for contributing to our peer reputation system. Mutual ratings help keep our barter network dependable.'
                : 'Your no-show report has been logged under our dispute procedures. Completion credit has been withheld.'}
            </p>
            <div className="pt-3">
              <button
                onClick={closeModal}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Attendance Question */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Did the scheduled session take place?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionTookPlace(true)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    sessionTookPlace
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Yes, session completed
                </button>
                <button
                  type="button"
                  onClick={() => setSessionTookPlace(false)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    !sessionTookPlace
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  No, partner did not attend
                </button>
              </div>
            </div>

            {/* If No-Show: Report Form */}
            {!sessionTookPlace ? (
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold">Report Missed Session / No-Show</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Per SkillSwap guidelines, reporting a no-show prevents unearned completion credit and helps maintain reliable matching.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Details of the occurrence:
                  </label>
                  <textarea
                    rows={3}
                    value={noShowDetails}
                    onChange={(e) => setNoShowDetails(e.target.value)}
                    placeholder="e.g., Joined Google Meet on time and waited 15 minutes, but partner did not connect or send a message."
                    required
                    className="w-full p-2.5 text-xs bg-white border border-rose-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            ) : (
              // If Attended: 3-Dimensional 1-5 Star Ratings
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Peer Ratings (1 to 5 Stars)
                  </span>

                  {renderStarSelector(
                    'Punctuality & Reliability', 
                    punctualityRating, 
                    setPunctualityRating, 
                    <Clock className="w-3.5 h-3.5" />
                  )}

                  {renderStarSelector(
                    'Knowledge Sharing & Quality', 
                    knowledgeSharingRating, 
                    setKnowledgeSharingRating, 
                    <BookOpen className="w-3.5 h-3.5" />
                  )}

                  {renderStarSelector(
                    'Overall Exchange Experience', 
                    overallRating, 
                    setOverallRating, 
                    <ThumbsUp className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Optional Public Review */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-900">
                      Public Review (Optional)
                    </label>
                    <span
                      className={`text-[11px] font-mono tabular-nums ${
                        reviewLength > 400 ? 'text-rose-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {reviewLength} / 400 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share what worked well and what you learned from this exchange..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
