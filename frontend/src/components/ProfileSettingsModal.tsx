import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillItem, ProficiencyLevel } from '../types';
import { X, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

export const ProfileSettingsModal: React.FC = () => {
  const { currentUser, closeModal, updateProfile } = useApp();

  if (!currentUser) return null;

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [headline, setHeadline] = useState(currentUser.headline);
  const [bio, setBio] = useState(currentUser.bio);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [skillsOffered, setSkillsOffered] = useState<SkillItem[]>([...currentUser.skillsOffered]);
  const [skillsRequested, setSkillsRequested] = useState<SkillItem[]>([...currentUser.skillsRequested]);

  // Temp inputs
  const [newOfferedName, setNewOfferedName] = useState('');
  const [newOfferedLevel, setNewOfferedLevel] = useState<ProficiencyLevel>('Intermediate');

  const [newRequestedName, setNewRequestedName] = useState('');
  const [newRequestedLevel, setNewRequestedLevel] = useState<ProficiencyLevel>('Beginner');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const bioLength = bio.length;

  const handleAddOffered = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newOfferedName.trim();
    if (!name) return;
    if (skillsOffered.length >= 5) {
      setErrorMsg('Maximum 5 offered skills allowed.');
      return;
    }
    if (skillsOffered.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setErrorMsg(`Skill "${name}" is already offered.`);
      return;
    }
    setSkillsOffered([
      ...skillsOffered,
      { id: `so_${Date.now()}`, name, level: newOfferedLevel }
    ]);
    setNewOfferedName('');
    setErrorMsg(null);
  };

  const handleRemoveOffered = (id: string) => {
    if (skillsOffered.length <= 1) {
      setErrorMsg('You must maintain at least one offered skill.');
      return;
    }
    setSkillsOffered(skillsOffered.filter((s) => s.id !== id));
    setErrorMsg(null);
  };

  const handleAddRequested = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newRequestedName.trim();
    if (!name) return;
    if (skillsRequested.length >= 5) {
      setErrorMsg('Maximum 5 requested skills allowed.');
      return;
    }
    if (skillsRequested.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setErrorMsg(`Skill "${name}" is already requested.`);
      return;
    }
    setSkillsRequested([
      ...skillsRequested,
      { id: `sr_${Date.now()}`, name, level: newRequestedLevel }
    ]);
    setNewRequestedName('');
    setErrorMsg(null);
  };

  const handleRemoveRequested = (id: string) => {
    if (skillsRequested.length <= 1) {
      setErrorMsg('You must maintain at least one requested skill.');
      return;
    }
    setSkillsRequested(skillsRequested.filter((s) => s.id !== id));
    setErrorMsg(null);
  };

  const handleSave = () => {
    setErrorMsg(null);
    if (!displayName.trim()) {
      setErrorMsg('Display name is required.');
      return;
    }
    if (skillsOffered.length < 1) {
      setErrorMsg('You must maintain at least one offered skill.');
      return;
    }
    if (skillsRequested.length < 1) {
      setErrorMsg('You must maintain at least one requested skill.');
      return;
    }
    if (bioLength > 300) {
      setErrorMsg('Bio must not exceed 300 characters.');
      return;
    }

    const res = updateProfile({
      displayName: displayName.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      timezone,
      skillsOffered,
      skillsRequested
    });

    if (res.success) {
      setSuccessMsg('Profile updated successfully.');
      setTimeout(() => {
        closeModal();
      }, 500);
    } else {
      setErrorMsg(res.error || 'Failed to save changes.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Edit Profile & Exchange Skills
            </h3>
            <p className="text-xs text-slate-500">
              Keep your profile accurate to receive relevant swap proposals.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline / Role
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Bio (max 300 chars)
              </label>
              <span className={`text-[11px] font-mono ${bioLength > 300 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                {bioLength} / 300
              </span>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Timezone
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
            />
          </div>

          {/* Skills Offered Manager */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Skills You Teach (1 to 5)
              </span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {skillsOffered.length} / 5
              </span>
            </div>
            <div className="space-y-1.5">
              {skillsOffered.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                  <span>{s.name} ({s.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOffered(s.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {skillsOffered.length < 5 && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="New skill name..."
                  value={newOfferedName}
                  onChange={(e) => setNewOfferedName(e.target.value)}
                  className="flex-1 p-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                />
                <select
                  value={newOfferedLevel}
                  onChange={(e) => setNewOfferedLevel(e.target.value as ProficiencyLevel)}
                  className="p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddOffered}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Skills Requested Manager */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Skills You Want to Learn (1 to 5)
              </span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {skillsRequested.length} / 5
              </span>
            </div>
            <div className="space-y-1.5">
              {skillsRequested.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                  <span>{s.name} ({s.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequested(s.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {skillsRequested.length < 5 && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="New requested skill..."
                  value={newRequestedName}
                  onChange={(e) => setNewRequestedName(e.target.value)}
                  className="flex-1 p-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                />
                <select
                  value={newRequestedLevel}
                  onChange={(e) => setNewRequestedLevel(e.target.value as ProficiencyLevel)}
                  className="p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddRequested}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
