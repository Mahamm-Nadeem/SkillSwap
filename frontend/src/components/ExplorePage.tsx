import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, ProficiencyLevel } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowLeftRight, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  RefreshCw,
  Send,
  Eye,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AvatarVisual } from './AvatarVisual';
import { SkillThumbnail } from './SkillThumbnail';

export const ExplorePage: React.FC = () => {
  const { users, currentUser, openModal, calculateCompatibility } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [inspectedPeer, setInspectedPeer] = useState<UserProfile | null>(null);

  // Collect unique skills for filter dropdowns
  const allOfferedSkills = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.published) {
        u.skillsOffered.forEach((s) => set.add(s.name));
      }
    });
    return Array.from(set).sort();
  }, [users]);

  const allRequestedSkills = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.published) {
        u.skillsRequested.forEach((s) => set.add(s.name));
      }
    });
    return Array.from(set).sort();
  }, [users]);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!user.published) return false;
      if (currentUser && user.id === currentUser.id) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = user.displayName.toLowerCase().includes(query);
        const matchesHeadline = user.headline.toLowerCase().includes(query);
        const matchesBio = user.bio.toLowerCase().includes(query);
        const matchesOffered = user.skillsOffered.some((s) =>
          s.name.toLowerCase().includes(query)
        );
        const matchesRequested = user.skillsRequested.some((s) =>
          s.name.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesHeadline && !matchesBio && !matchesOffered && !matchesRequested) {
          return false;
        }
      }

      if (selectedOfferedSkill) {
        const hasSkill = user.skillsOffered.some(
          (s) => s.name.toLowerCase() === selectedOfferedSkill.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      if (selectedRequestedSkill) {
        const hasSkill = user.skillsRequested.some(
          (s) => s.name.toLowerCase() === selectedRequestedSkill.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      if (selectedLevel !== 'all') {
        const hasLevel = user.skillsOffered.some(
          (s) => s.level.toLowerCase() === selectedLevel.toLowerCase()
        );
        if (!hasLevel) return false;
      }

      return true;
    });
  }, [users, currentUser, searchQuery, selectedOfferedSkill, selectedRequestedSkill, selectedLevel]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedOfferedSkill('');
    setSelectedRequestedSkill('');
    setSelectedLevel('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedOfferedSkill !== '' ||
    selectedRequestedSkill !== '' ||
    selectedLevel !== 'all';

  const simulateRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const getLevelMeter = (level: ProficiencyLevel) => {
    if (level === 'Advanced') return { width: '100%', bg: 'bg-emerald-500' };
    if (level === 'Intermediate') return { width: '66%', bg: 'bg-blue-500' };
    return { width: '33%', bg: 'bg-slate-400' };
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Explore Peer Exchanges
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Barter Network
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Discover verified peers ready for direct 1-to-1 reciprocal trades. Propose skills you offer in exchange for the exact skills you want to learn.
          </p>
        </div>

        {/* Live Filter Metric */}
        <div className="flex items-center gap-3">
          <button
            onClick={simulateRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-colors"
            title="Refresh directory cache"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-slate-900' : ''}`} />
            <span>Sync</span>
          </button>
          <div className="text-xs text-slate-500 font-mono">
            <span className="font-bold text-slate-900 tabular-nums">{filteredUsers.length}</span> verified peers
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (e.g. Figma, HTML, Spanish, Writing)..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter by Offered Skill */}
          <div className="md:col-span-3">
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            >
              <option value="">Skills Offered: Any</option>
              {allOfferedSkills.map((s) => (
                <option key={s} value={s}>
                  Teaches: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Requested Skill */}
          <div className="md:col-span-2">
            <select
              value={selectedRequestedSkill}
              onChange={(e) => setSelectedRequestedSkill(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            >
              <option value="">Wants: Any</option>
              {allRequestedSkills.map((s) => (
                <option key={s} value={s}>
                  Wants: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Proficiency */}
          <div className="md:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            >
              <option value="all">Level: All</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips / Reset */}
        {hasActiveFilters && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-500">
              <span>Active filters:</span>
              {searchQuery && (
                <span className="text-slate-800 font-medium">"{searchQuery}"</span>
              )}
              {selectedOfferedSkill && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Teaches: <strong>{selectedOfferedSkill}</strong></span>
                </>
              )}
              {selectedRequestedSkill && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Wants: <strong>{selectedRequestedSkill}</strong></span>
                </>
              )}
              {selectedLevel !== 'all' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">Level: <strong>{selectedLevel}</strong></span>
                </>
              )}
            </div>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 underline underline-offset-2 transition-colors ml-auto"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-14 bg-slate-100 rounded w-full" />
              <div className="h-24 bg-slate-50 rounded w-full" />
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No matching exchange profiles found
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, clearing specific skill filters, or exploring related topics.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((peer) => {
            const comp = currentUser
              ? calculateCompatibility(currentUser, peer)
              : null;

            return (
              <div
                key={peer.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all relative"
              >
                {/* Visual Skill Thumbnail Header */}
                <div className="relative">
                  <SkillThumbnail
                    skillName={peer.skillsOffered[0]?.name || 'Skill Exchange'}
                    size="md"
                  />
                  {/* Overlapping Avatar */}
                  <div className="absolute -bottom-5 left-5 z-20 p-0.5 bg-white rounded-2xl shadow-xs">
                    <AvatarVisual
                      id={peer.id}
                      name={peer.displayName}
                      initials={peer.avatarInitials}
                      gradientClass={peer.avatarColor}
                      size="lg"
                      showStatus={true}
                    />
                  </div>
                </div>

                <div className="p-5 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top Bar: Details & Rating */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-900 leading-snug">
                            {peer.displayName}
                          </h2>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {peer.memberSince}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">
                          {peer.headline}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-mono tabular-nums text-slate-800 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            {peer.averageRating.toFixed(1)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{peer.totalCompletedSessions} completed swaps</span>
                          <span aria-hidden="true">·</span>
                          <span>{peer.timezone.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {/* Compatibility Match Indicator */}
                      {comp && comp.isReciprocalMatch && (
                        <div className="hidden sm:flex flex-col items-end shrink-0">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            Direct Match ({comp.matchPercentage}%)
                          </span>
                        </div>
                      )}
                    </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                    {peer.bio}
                  </p>

                  {/* Skills Section with visual proficiency meters */}
                  <div className="space-y-4 border-t border-slate-100 pt-4 mb-5">
                    
                    {/* Skills Offered */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Can Teach / Offers ({peer.skillsOffered.length})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Proficiency
                        </span>
                      </div>
                      <div className="space-y-2">
                        {peer.skillsOffered.map((skill) => {
                          const meter = getLevelMeter(skill.level);
                          return (
                            <div
                              key={skill.id}
                              className="p-2.5 bg-slate-50 rounded-xl space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-900">{skill.name}</span>
                                <span className="text-[11px] text-slate-500 font-mono">{skill.level}</span>
                              </div>
                              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${meter.bg}`}
                                  style={{ width: meter.width }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skills Requested */}
                    <div className="border-t border-slate-50 pt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                        Wants to Learn
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {peer.skillsRequested.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700"
                          >
                            <span>{skill.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({skill.level})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mutual Reciprocal Overlap Banner */}
                  {comp && comp.isReciprocalMatch && (
                    <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3 mb-5 text-[11px] text-emerald-950 space-y-1">
                      <p className="font-bold flex items-center gap-1 text-emerald-900">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Bilateral Barter Match:
                      </p>
                      <p>
                        You teach: <strong>{comp.userATeachesB.join(', ')}</strong>
                      </p>
                      <p>
                        {peer.displayName} teaches: <strong>{comp.userBTeachesA.join(', ')}</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setInspectedPeer(peer)}
                    className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    title="View Peer Profile Dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openModal('swap_proposal', { peer })}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Skill Swap</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Peer Profile Dossier Modal */}
      {inspectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Peer Dossier</h3>
              <button
                onClick={() => setInspectedPeer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <AvatarVisual
                  id={inspectedPeer.id}
                  name={inspectedPeer.displayName}
                  initials={inspectedPeer.avatarInitials}
                  gradientClass={inspectedPeer.avatarColor}
                  size="xl"
                  showStatus={true}
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {inspectedPeer.displayName}
                  </h2>
                  <p className="text-xs text-slate-600">{inspectedPeer.headline}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1">
                    <span>{inspectedPeer.timezone.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {inspectedPeer.averageRating.toFixed(1)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{inspectedPeer.totalCompletedSessions} completed</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  About
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {inspectedPeer.bio}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Skills Offered (Teaches)
                </span>
                <div className="space-y-1.5">
                  {inspectedPeer.skillsOffered.map((s) => (
                    <div key={s.id} className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className="font-mono text-slate-500">{s.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Skills Requested (Wants to Learn)
                </span>
                <div className="space-y-1.5">
                  {inspectedPeer.skillsRequested.map((s) => (
                    <div key={s.id} className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                      <span className="text-slate-800">{s.name}</span>
                      <span className="font-mono text-slate-400">{s.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setInspectedPeer(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const target = inspectedPeer;
                    setInspectedPeer(null);
                    openModal('swap_proposal', { peer: target });
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                >
                  Propose Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
