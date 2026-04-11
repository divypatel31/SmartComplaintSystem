import { motion } from 'framer-motion';

const colorMap = {
  brand:   { text: 'text-blue-600',    bg: 'bg-blue-500/10',    border: 'group-hover:border-blue-200' },
  amber:   { text: 'text-amber-600',   bg: 'bg-amber-500/10',   border: 'group-hover:border-amber-200' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'group-hover:border-emerald-200' },
  blue:    { text: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'group-hover:border-blue-200' },
  violet:  { text: 'text-violet-600',  bg: 'bg-violet-500/10',  border: 'group-hover:border-violet-200' },
  gray:    { text: 'text-gray-600',    bg: 'bg-gray-500/10',    border: 'group-hover:border-gray-200' },
};

export default function StatCard({ label, value, icon, color = 'brand' }) {
  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden bg-white rounded-[2rem] p-6 border border-gray-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/[0.02] ${c.border}`}
    >
      {/* Background Accent Glow */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${c.bg}`} />

      <div className="relative z-10 flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center text-xl transition-transform duration-500 group-hover:scale-110`}>
          {icon}
        </div>
        
        <div>
          <div className="flex items-baseline gap-1">
            <h4 className={`text-3xl font-black tracking-tighter ${c.text}`}>
              {value}
            </h4>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1.5">
            {label}
          </p>
        </div>
      </div>

      {/* Decorative Progress bar line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-50 overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full w-full ${c.bg.replace('/10', '')} opacity-40`} 
        />
      </div>
    </motion.div>
  );
}