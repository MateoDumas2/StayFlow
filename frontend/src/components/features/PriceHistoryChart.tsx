'use client';

import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

import { useTranslation } from 'react-i18next';

interface PriceHistoryChartProps {
  currentPrice: number;
}

const generateMockData = (basePrice: number, t: any) => {
  const months = [
    t('common.months.jan'), t('common.months.feb'), t('common.months.mar'), 
    t('common.months.apr'), t('common.months.may'), t('common.months.jun'), 
    t('common.months.jul'), t('common.months.aug'), t('common.months.sep'), 
    t('common.months.oct'), t('common.months.nov'), t('common.months.dec')
  ];
  return months.map((month: string, index: number) => {
    // Simulate seasonality: High in Summer (Jun-Aug) and Dec
    const isHighSeason = (index >= 5 && index <= 7) || index === 11;
    const variation = isHighSeason ? 1.4 : 0.8 + (Math.random() * 0.4);
    return {
      name: month,
      price: Math.round(basePrice * variation),
      avg: basePrice
    };
  });
};

export default function PriceHistoryChart({ currentPrice }: PriceHistoryChartProps) {
  const { t } = useTranslation();
  const data = generateMockData(currentPrice, t);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-ink">{t('listing_page.price_history_title')}</h3>
          <p className="text-sm text-gray-500">{t('listing_page.price_trend')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{t('listing_page.current_price')}</p>
          <p className="text-xl font-bold text-primary">${currentPrice}</p>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF385C" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FF385C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#717171' }}
              interval={1} // Show every other month if crowded
            />
            <YAxis 
              hide={true} 
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#FF385C', fontWeight: 'bold' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`$${value}`, t('listing_page.average_price')]}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#FF385C" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <span>💡</span>
        <p>
          <strong>{t('listing_page.ai_tip_label')}</strong> {t('listing_page.ai_tip_text')}
        </p>
      </div>
    </div>
  );
}
