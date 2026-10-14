import React, { useEffect, useState } from 'react';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Film, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import { api } from '../../services/api';

const iconMap = {
  Code2,
  Smartphone,
  Palette,
  Film,
  ShoppingBag,
  Cpu,
};

export function Services({ onSelectService }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <section id="services" className="relative py-24 bg-dark-950 border-t border-slate-900 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Impact Capabilities</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Our Elite Digital Engineering & Creative Services
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            From modern full-stack web architectures to viral 3D motion graphics, we provide end-to-end solutions that elevate brands into market leaders.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code2;
            return (
              <div
                key={service.id || index}
                className="relative rounded-2xl glass-card p-8 flex flex-col justify-between group overflow-hidden border border-slate-800 hover:border-cyan-500/50"
              >
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-300" />

                {service.popular && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Popular
                  </span>
                )}

                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all duration-300 mb-6">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  {service.features && (
                    <ul className="mt-6 space-y-2.5">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start space-x-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Tech chips & Action button */}
                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  {service.technologies && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {service.technologies.map((tech, tIndex) => (
                        <span
                          key={tIndex}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-cyan-500 hover:text-dark-950 border border-slate-700/80 hover:border-cyan-400 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-glow-cyan"
                  >
                    <span>Request This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
