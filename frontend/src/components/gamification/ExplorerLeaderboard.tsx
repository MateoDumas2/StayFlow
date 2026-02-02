'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const leaders = [
  { id: 1, name: "Ana P.", countries: 12, cities: 34, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { id: 2, name: "Carlos M.", countries: 8, cities: 21, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
  { id: 3, name: "Tú", countries: 5, cities: 8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo", isMe: true },
  { id: 4, name: "Sofia L.", countries: 3, cities: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia" },
];

export default function ExplorerLeaderboard() {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
        <span>🏆</span> {t('leaderboard.title')}
      </h3>
      
      <div className="space-y-4">
        {leaders.map((leader, index) => (
          <div 
            key={leader.id} 
            className={`flex items-center gap-3 p-2 rounded-lg ${leader.isMe ? 'bg-primary/5 border border-primary/20' : ''}`}
          >
            <div className={`w-6 h-6 flex items-center justify-center font-bold text-sm ${
              index === 0 ? 'text-yellow-500' : 
              index === 1 ? 'text-gray-400' : 
              index === 2 ? 'text-orange-400' : 'text-gray-300'
            }`}>
              {index + 1}
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden relative">
               <Image 
                 src={leader.avatar} 
                 alt={leader.name} 
                 fill
                 className="object-cover"
                 unoptimized
               />
            </div>
            
            <div className="flex-1">
              <p className={`text-sm font-bold ${leader.isMe ? 'text-primary' : 'text-ink'}`}>
                {leader.name} {leader.isMe && t('leaderboard.you')}
              </p>
              <p className="text-xs text-gray-400">
                {leader.countries} {t('leaderboard.countries')} • {leader.cities} {t('leaderboard.cities')}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-xs text-gray-400 hover:text-primary transition-colors">
        {t('leaderboard.view_full')}
      </button>
    </div>
  );
}
