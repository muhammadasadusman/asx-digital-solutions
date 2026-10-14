import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Briefcase, 
  Mail, 
  CheckCircle, 
  ExternalLink,
  Edit3
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function Team({ onOpenQuote, onToggleDashboard }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMember, setActiveMember] = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await api.getTeam();
        setTeam(data);
      } catch (err) {
        console.error('Failed to load team:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  return (
    <section id="team" className="relative py-24 bg-dark-950 border-t border-slate-900 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-800/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Core Engineering & Creative Brains</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Meet the ASX Specialists
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Vetted software engineers, artistic directors, and growth hackers dedicated to engineering your digital success.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-2">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin-Verified Profiles & Portfolios</span>
            </div>
            {hasPermission('can_manage_team') && (
              <button
                onClick={() => onToggleDashboard(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Admin: Manage Team & Upload Photos</span>
              </button>
            )}
          </div>
        </div>

        {/* Team Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl glass-card overflow-hidden border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Role Header */}
                <div className="flex items-start space-x-4 mb-5">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 group-hover:border-cyan-400 transition-colors shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {member.verified && (
                      <span className="absolute bottom-1 right-1 p-0.5 rounded-full bg-cyan-500 text-dark-950">
                        <CheckCircle className="w-3.5 h-3.5 font-bold" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/80 inline-block mb-1">
                      {member.department}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium truncate">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Core Expertise:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills && member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio items */}
                {member.portfolioItems && member.portfolioItems.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1 mb-2">
                      <Briefcase className="w-3 h-3 text-cyan-400" />
                      <span>Assigned Portfolio Deliverables:</span>
                    </span>
                    <div className="space-y-1">
                      {member.portfolioItems.map((item, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact / Hire specialist CTA */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onOpenQuote(`Consultation with ${member.name} (${member.role})`)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Consult with {member.name.split(' ')[0]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
