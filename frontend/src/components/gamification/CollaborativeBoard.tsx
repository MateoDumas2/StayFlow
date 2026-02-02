'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Users } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const initialItems = [
  { id: 1, title: "Villa en Bali", votes: 3, image: "https://images.unsplash.com/photo-1573052905904-dd9cd8124f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", status: "pending" },
  { id: 2, title: "Loft en NYC", votes: 1, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", status: "pending" },
  { id: 3, title: "Cabaña Alpes", votes: 5, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", status: "winning" },
];

export default function CollaborativeBoard() {
  const { t } = useTranslation();
  const [items, setItems] = useState(initialItems);

  const handleVote = (id: number, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, votes: item.votes + delta } : item
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
        <div>
          <h2 className="text-xl font-bold text-ink dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t('collaborative_board.title')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('collaborative_board.collaborators', { count: 3 })}</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
             <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800" />
          ))}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {items.sort((a,b) => b.votes - a.votes).map((item) => (
          <motion.div 
            layout
            key={item.id} 
            className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
              item.status === 'winning' 
                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                : 'border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
               <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-ink dark:text-white">{item.title}</h3>
              {item.status === 'winning' && (
                <span className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  {t('collaborative_board.winning')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
               <button 
                 onClick={() => handleVote(item.id, -1)}
                 className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-red-500 transition-colors"
               >
                 <ThumbsDown size={14} />
               </button>
               <span className="font-bold text-ink dark:text-white w-4 text-center">{item.votes}</span>
               <button 
                 onClick={() => handleVote(item.id, 1)}
                 className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-green-500 transition-colors"
               >
                 <ThumbsUp size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-900 text-center border-t border-gray-100 dark:border-gray-800">
        <button className="text-sm text-primary font-bold hover:underline">
          {t('collaborative_board.add_property')}
        </button>
      </div>
    </div>
  );
}
