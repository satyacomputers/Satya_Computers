'use client';

import { motion } from 'framer-motion';
import { User, Shield, Briefcase, Award } from 'lucide-react';

interface TeamMember {
  username: string;
  role: string;
}

interface AdminTeamProps {
  team: TeamMember[];
}

export default function AdminTeam({ team }: AdminTeamProps) {
  if (!team || team.length === 0) return null;

  return (
    <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6"
            >
              <Shield className="text-blue-600" size={14} />
              <span className="text-blue-600 font-heading text-[10px] tracking-widest uppercase font-bold">The Core Team</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-[#0A1628] uppercase leading-none">
               TECHNICAL <span className="text-blue-600">LEADERSHIP</span>
            </h2>
          </div>
          
          <p className="max-w-sm text-gray-400 font-body text-lg border-l-2 border-blue-600 pl-6 text-left">
             Our certified systems engineers and management team ensuring 24/7 operational continuity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-[#FAFAFA] border border-gray-100 rounded-3xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <User size={120} />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-6 border border-gray-50 group-hover:bg-blue-600 transition-colors duration-500">
                    <User className="text-gray-400 group-hover:text-white transition-colors duration-500" size={40} />
                 </div>
                 
                 <h3 className="text-2xl font-heading font-bold text-[#0A1628] mb-1 uppercase tracking-tighter text-center">
                   {member.username}
                 </h3>
                 <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-6">
                    {member.role || 'System Admin'}
                 </p>
                 
                 <div className="w-full flex justify-between pt-6 border-t border-gray-100">
                    <div className="flex flex-col items-center">
                       <Award size={14} className="text-gray-300 mb-1" />
                       <span className="text-[9px] font-bold text-gray-400 uppercase">Certified</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <Briefcase size={14} className="text-gray-300 mb-1" />
                       <span className="text-[9px] font-bold text-gray-400 uppercase">Solutions</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
