import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'cyan' | 'purple' | 'blue';
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'cyan',
  delay = 0,
}) => {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500',
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-indigo-500',
  };

  const glowClass = {
    cyan: 'glow-hover-cyan',
    purple: 'glow-hover-purple',
    blue: 'glow-hover-cyan',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={`glass rounded-xl p-6 transition-all duration-300 ${glowClass[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <motion.h3
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: delay + 0.2 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.h3>
          {trend && (
            <p className="text-sm text-green-400">{trend}</p>
          )}
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="size-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};
