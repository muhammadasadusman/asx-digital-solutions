import React, { useEffect, useState } from 'react';
import { 
  ExternalLink, 
  Layers, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Calendar, 
  User, 
  ArrowUpRight 
} from 'lucide-react';
import { api } from '../../services/api';

const categories = [
  'All',
  'Web Development',
  'App Development',
  'Shopify & E-Commerce',
  'Web & UI/UX Design',
  'Video Editing & Motion Graphics',
];

export function Portfolio({ onOpenQuote }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        const data = await api.getPortfolio(activeCategory);
        setProjects(data);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [activeCategory]);

  return (
    <section id="portfolio" className="relative py-24 bg-dark-900 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Featured Case Studies & Flagship Work
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Explore how we engineered scalable applications, viral digital campaigns, and award-winning user interfaces for forward-thinking clients.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                activeCategory === category
                  ? 'bg-asx-cyan text-dark-950 border-asx-cyan shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-2xl glass-card overflow-hidden border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-dark-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                  {project.category}
                </span>

                <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-cyan-500 text-dark-950 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-glow-cyan">
                  <ArrowUpRight className="w-4 h-4 font-bold" />
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{project.client}</span>
                    </span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {project.tags && project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
            
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 border border-slate-800 bg-slate-950">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {selectedProject.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Year: {selectedProject.year}</span>
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white">
                {selectedProject.title}
              </h3>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                {selectedProject.description}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Client / Partner:</span>
                  <span className="text-white font-medium text-sm">{selectedProject.client}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Live Deployment:</span>
                  <a
                    href={selectedProject.liveUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center space-x-1 font-medium text-sm"
                  >
                    <span>View Live Prototype</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-2 font-semibold uppercase tracking-wider text-[10px]">Technologies & Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags && selectedProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onOpenQuote(selectedProject.title);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 shadow-glow-cyan flex items-center justify-center space-x-2"
                >
                  <span>Build a Similar Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="py-3 px-6 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  Close Preview
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
