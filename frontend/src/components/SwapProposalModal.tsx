import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { X, Send, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface SwapProposalModalProps {
  peer: UserProfile;
}

export const SwapProposalModal: React.FC<SwapProposalModalProps> = ({ peer }) => {
  const { currentUser, sendSwapProposal, closeModal, navigateTo } = useApp();

  const [senderSkill, setSenderSkill] = useState<string>(
    currentUser?.skillsOffered[0]?.name || ''
  );
  const [recipientSkill, setRecipientSkill] = useState<string>(
    peer.skillsOffered[0]?.name || ''
  );
  const [introNote, setIntroNote] = useState<string>(
    `Hi ${peer.displayName.split(' ')[0]}! I would love to learn ${peer.skillsOffered[0]?.name || 'this skill'} from you, and can share practical experience with ${currentUser?.skillsOffered[0]?.name || 'my skill'} in return.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center shadow-xl">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Sign In Required</h3>
          <p className="text-xs text-slate-600 mt-2">
            You must have a published SkillSwap profile to propose an exchange.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                closeModal();
                navigateTo('/onboarding');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
            >
              Complete Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  const noteLength = introNote.trim().length;
  const isLengthValid = noteLength >= 20 && noteLength <= 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!senderSkill) {
      setErrorMsg('Please select a skill you will teach.');
      return;
    }
    if (!recipientSkill) {
      setErrorMsg('Please select a skill you want to learn.');
      return;
    }
    if (noteLength < 20) {
      setErrorMsg('Introductory note must be at least 20 characters.');
      return;
    }
    if (noteLength > 500) {
      setErrorMsg('Introductory note must not exceed 500 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = sendSwapProposal({
        recipientId: peer.id,
        senderSkill,
        recipientSkill,
        introNote: introNote.trim()
      });

      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit proposal.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Propose Skill Swap
            </h3>
            <p className="text-xs text-slate-500">
              Direct reciprocal trade with {peer.displayName}
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
          // Success State
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Proposal Submitted!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your exchange proposal for <strong>{recipientSkill}</strong> in return for <strong>{senderSkill}</strong> has been sent to {peer.displayName}.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigateTo('/requests');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                View Outgoing Requests
              </button>
            </div>
          </div>
        ) : (
          // Proposal Form
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bilateral Trade Selector */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
              {/* What sender teaches */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  1. You Teach ({currentUser.displayName})
                </label>
                <select
                  value={senderSkill}
                  onChange={(e) => setSenderSkill(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {currentUser.skillsOffered.map((skill) => (
                    <option key={skill.id} value={skill.name}>
                      {skill.name} ({skill.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center text-slate-400">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="px-2 text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  IN EXCHANGE FOR
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* What sender learns */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  2. {peer.displayName} Teaches You
                </label>
                <select
                  value={recipientSkill}
                  onChange={(e) => setRecipientSkill(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {peer.skillsOffered.map((skill) => (
                    <option key={skill.id} value={skill.name}>
                      {skill.name} ({skill.level})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Introductory Note with live character counter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-900">
                  Introductory Note
                </label>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    noteLength < 20 || noteLength > 500
                      ? 'text-rose-600 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  {noteLength} / 500 chars (min 20)
                </span>
              </div>
              <textarea
                rows={4}
                value={introNote}
                onChange={(e) => setIntroNote(e.target.value)}
                placeholder="Introduce yourself, your availability, and what specific topic or project you'd like to work on..."
                className={`w-full p-3 text-xs bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  noteLength < 20 || noteLength > 500
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-slate-900'
                }`}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                A clear proposal explaining your learning goals leads to an 80%+ acceptance rate.
              </p>
            </div>

            {/* Actions */}
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
                disabled={isSubmitting || !isLengthValid}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Swap Proposal'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
