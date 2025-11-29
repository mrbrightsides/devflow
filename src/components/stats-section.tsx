'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: TrendingUp,
    value: '85%',
    label: 'Fix Success Rate',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Clock,
    value: '3.2s',
    label: 'Average Fix Time',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: CheckCircle2,
    value: '1,247',
    label: 'Bugs Fixed Today',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Zap,
    value: '24/7',
    label: 'Active Monitoring',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
];

export function StatsSection() {
  return (
    <section className="py-12 px-4 -mt-8 relative z-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
              >
                <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 hover:bg-slate-800 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
