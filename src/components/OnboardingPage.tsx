import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillItem, ProficiencyLevel } from '../types';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  GraduationCap,
  Globe
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { currentUser, publishProfile, navigateTo } = useApp();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Alex Rivera');
  const [headline, setHeadline] = useState(currentUser?.headline || 'Independent Freelance Specialist');
  const [bio, setBio] = useState(currentUser?.bio || 'Freelance developer & technical writer looking to trade code reviews for contract guidance.');
  const [timezone, setTimezone] = useState(
    currentUser?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  );

  // Skill collections: 1 to 5 required
  const [skillsOffered, setSkillsOffered] = useState<SkillItem[]>([
    { id: 'so_init_1', name: 'TypeScript Architecture', level: 'Advanced' }
  ]);
  const [skillsRequested, setSkillsRequested] = useState<SkillItem[]>([
    { id: 'sr_init_1', name: 'Client Scoping & Contracts', level: 'Beginner' }
  ]);

  // New skill input temp state
  const [newOfferedName, setNewOfferedName] = useState('');
  const [newOfferedLevel, setNewOfferedLevel] = useState<ProficiencyLevel>('Intermediate');

  const [newRequestedName, setNewRequestedName] = useState('');
  const [newRequestedLevel, setNewRequestedLevel] = useState<ProficiencyLevel>('Beginner');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bioLength = bio.length;

  const handleAddOffered = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newOfferedName.trim();
    if (!name) return;
    if (skillsOffered.length >= 5) {
      setValidationError('You can add a maximum of 5 offered skills.');
      return;
    }
    if (skillsOffered.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setValidationError(`Skill "${name}" is already in your offered skills list.`);
      return;
    }
    setSkillsOffered([
      ...skillsOffered,
      { id: `so_${Date.now()}`, name, level: newOfferedLevel }
    ]);
    setNewOfferedName('');
    setValidationError(null);
  };

  const handleRemoveOffered = (id: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s.id !== id));
  };

  const handleAddRequested = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newRequestedName.trim();
    if (!name) return;
    if (skillsRequested.length >= 5) {
      setValidationError('You can add a maximum of 5 requested skills.');
      return;
    }
    if (skillsRequested.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setValidationError(`Skill "${name}" is already in your requested skills list.`);
      return;
    }
    setSkillsRequested([
      ...skillsRequested,
      { id: `sr_${Date.now()}`, name, level: newRequestedLevel }
    ]);
    setNewRequestedName('');
    setValidationError(null);
  };

  const handleRemoveRequested = (id: string) => {
    setSkillsRequested(skillsRequested.filter((s) => s.id !== id));
  };

  const handlePublish = () => {
    setValidationError(null);

    if (!displayName.trim()) {
      setValidationError('Please enter a display name.');
      return;
    }

    if (skillsOffered.length < 1) {
      setValidationError(
        'The profile cannot be published unless it contains at least one offered skill and one requested skill.'
      );
      return;
    }

    if (skillsRequested.length < 1) {
      setValidationError(
        'The profile cannot be published unless it contains at least one offered skill and one requested skill.'
      );
      return;
    }

    if (bioLength > 300) {
      setValidationError('Bio must not exceed 300 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = publishProfile({
        displayName: displayName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        timezone,
        skillsOffered,
        skillsRequested
      });

      setIsSubmitting(false);

      if (!res.success) {
        setValidationError(res.error || 'Failed to publish profile.');
      }
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Onboarding Header */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            Step 1 of 1 · Initial Profile Setup
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Publish Your Exchange Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            SkillSwap is a reciprocal barter network: every member teaches what they know and learns what they need. Set up your baseline skills to unlock discovery.
          </p>
        </div>

        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-medium">{validationError}</div>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. Identity & Timezone
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline or Role
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. UX Designer & Essayist"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Short Bio (Max 300 characters)
              </label>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  bioLength > 300 ? 'text-rose-600 font-bold' : 'text-slate-400'
                }`}
              >
                {bioLength} / 300
              </span>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell peers what practical experience you bring, what problems you're tackling, and your general learning goals..."
              className={`w-full p-2.5 text-xs bg-white border rounded-lg text-slate-900 focus:outline-none focus:ring-2 ${
                bioLength > 300
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-slate-900'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Timezone
            </label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Auto-detected from your browser; used to synchronize session times seamlessly.
            </p>
          </div>
        </div>

        {/* Skills Offered (1 to 5) */}
        <div
          className={`space-y-4 pt-2 p-4 rounded-xl transition-all ${
            skillsOffered.length === 0
              ? 'bg-rose-50/40 border border-rose-200'
              : 'bg-slate-50/60 border border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                2. Skills You Can Teach (1 to 5 required)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add skills you feel comfortable sharing or pairing on with another peer.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
              {skillsOffered.length} / 5
            </span>
          </div>

          {/* List of current offered */}
          <div className="space-y-2">
            {skillsOffered.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{skill.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    · {skill.level}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOffered(skill.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add offered input form */}
          {skillsOffered.length < 5 && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                value={newOfferedName}
                onChange={(e) => setNewOfferedName(e.target.value)}
                placeholder="e.g. HTML & CSS, Figma Basics, Conversational French"
                className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <select
                value={newOfferedLevel}
                onChange={(e) => setNewOfferedLevel(e.target.value as ProficiencyLevel)}
                className="p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={handleAddOffered}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          )}
        </div>

        {/* Skills Requested (1 to 5) */}
        <div
          className={`space-y-4 pt-2 p-4 rounded-xl transition-all ${
            skillsRequested.length === 0
              ? 'bg-rose-50/40 border border-rose-200'
              : 'bg-slate-50/60 border border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                3. Skills You Want to Learn (1 to 5 required)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add skills you are actively looking to learn or practice.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
              {skillsRequested.length} / 5
            </span>
          </div>

          {/* List of current requested */}
          <div className="space-y-2">
            {skillsRequested.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{skill.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    · Desired: {skill.level}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRequested(skill.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add requested input form */}
          {skillsRequested.length < 5 && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                value={newRequestedName}
                onChange={(e) => setNewRequestedName(e.target.value)}
                placeholder="e.g. JavaScript Debugging, SEO Writing, UI Wireframing"
                className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <select
                value={newRequestedLevel}
                onChange={(e) => setNewRequestedLevel(e.target.value as ProficiencyLevel)}
                className="p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={handleAddRequested}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          )}
        </div>

        {/* Publish Action Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Publishing activates your card in public directory search and enables bilateral proposals.
          </p>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Publishing Profile...' : 'Publish Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
