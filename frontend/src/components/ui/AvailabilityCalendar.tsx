import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths, parseISO, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AvailabilityCalendarProps {
  bookings?: { checkIn: string; checkOut: string }[];
  checkIn?: Date | null;
  checkOut?: Date | null;
  onSelectDate: (date: Date) => void;
}

export function AvailabilityCalendar({ bookings = [], checkIn, checkOut, onSelectDate }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = startOfMonth(currentMonth).getDay(); // 0 = Sunday
  const paddingDays = Array(firstDayOfMonth).fill(null);

  const isBlocked = (date: Date) => {
    return bookings.some(booking => 
      isWithinInterval(date, { 
        start: parseISO(booking.checkIn), 
        end: parseISO(booking.checkOut) 
      })
    );
  };

  const isSelected = (date: Date) => {
    if (checkIn && isSameDay(date, checkIn)) return true;
    if (checkOut && isSameDay(date, checkOut)) return true;
    if (checkIn && checkOut && isWithinInterval(date, { start: checkIn, end: checkOut })) return true;
    return false;
  };

  const isDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || isBlocked(date);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-30"
          disabled={isSameMonth(currentMonth, new Date())}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-ink">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
          <span key={day} className="text-xs font-bold text-gray-400">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} />
        ))}
        {daysInMonth.map(date => {
            const blocked = isDisabled(date);
            const selected = isSelected(date);
            
            return (
              <motion.button
                whileTap={!blocked ? { scale: 0.9 } : {}}
                key={date.toISOString()}
                onClick={() => !blocked && onSelectDate(date)}
                disabled={blocked}
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm relative
                  ${selected ? 'bg-primary text-white font-bold' : ''}
                  ${!selected && !blocked ? 'hover:bg-gray-100 text-ink' : ''}
                  ${blocked ? 'text-gray-300 cursor-not-allowed decoration-slice' : ''}
                `}
              >
                {format(date, 'd')}
                {blocked && !isBefore(date, startOfDay(new Date())) && (
                  <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></div>
                )}
              </motion.button>
            );
        })}
      </div>
      
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>Reservado</span>
        </div>
      </div>
    </div>
  );
}
