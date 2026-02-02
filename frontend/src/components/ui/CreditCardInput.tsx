"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';

export interface CreditCardData {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

interface CreditCardInputProps {
  onChange: (cardDetails: CreditCardData) => void;
}

export const CreditCardInput: React.FC<CreditCardInputProps> = ({ onChange }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatting logic
    let formattedValue = value;
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
        formattedValue = value.replace(/\D/g, '').substring(0, 4).replace(/(.{2})/, '$1/').trim();
        if (formattedValue.startsWith('/')) formattedValue = formattedValue.substring(1); // Fix edge case
    } else if (name === 'cvc') {
        formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    const newData = { ...cardData, [name]: formattedValue };
    setCardData(newData);
    onChange(newData);
  };

  const handleFocus = (field: string) => {
    setIsFlipped(field === 'cvc');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card Visualization */}
      <div className="perspective-1000 w-full max-w-sm h-56 relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden rounded-2xl p-6 text-white shadow-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-primary opacity-20 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-secondary opacity-20 blur-2xl"></div>
             
             <div className="flex justify-between items-start mb-8 relative z-10">
                 <CreditCard className="w-10 h-10 text-primary-light" />
                 <span className="font-mono text-xl tracking-widest italic font-bold opacity-80">StayFlow</span>
             </div>

             <div className="space-y-6 relative z-10">
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Número de Tarjeta</div>
                    <div className="font-mono text-2xl tracking-widest">
                        {cardData.number || '#### #### #### ####'}
                    </div>
                </div>
                
                <div className="flex justify-between">
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Titular</div>
                        <div className="font-medium tracking-wide uppercase truncate max-w-[200px]">
                            {cardData.name || 'NOMBRE APELLIDO'}
                        </div>
                    </div>
                    <div>
                         <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Expira</div>
                         <div className="font-mono">
                            {cardData.expiry || 'MM/YY'}
                         </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
            style={{ transform: 'rotateY(180deg)' }}
          >
             <div className="w-full h-12 bg-black mt-6 opacity-80"></div>
             <div className="p-6">
                 <div className="flex flex-col items-end">
                     <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 mr-2">CVC</div>
                     <div className="w-full bg-white h-10 rounded flex items-center justify-end px-4">
                         <span className="font-mono text-gray-800 font-bold tracking-widest">
                             {cardData.cvc || '###'}
                         </span>
                     </div>
                 </div>
                 <div className="mt-8 flex items-center justify-center opacity-30">
                     <CreditCard className="w-24 h-24" />
                 </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Form Inputs */}
      <div className="w-full max-w-sm space-y-4">
          <div className="relative">
              <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="number"
                placeholder="Número de Tarjeta"
                maxLength={19}
                value={cardData.number}
                onChange={handleInputChange}
                onFocus={() => handleFocus('number')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-mono text-sm"
              />
          </div>

          <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Nombre del Titular"
                value={cardData.name}
                onChange={handleInputChange}
                onFocus={() => handleFocus('name')}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm uppercase"
              />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('expiry')}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-mono text-sm"
                  />
              </div>
              <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    maxLength={3}
                    value={cardData.cvc}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('cvc')}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-mono text-sm"
                  />
              </div>
          </div>
      </div>
    </div>
  );
};
