import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from "@/components/providers/AccessibilityProvider";

export function AccessibilitySettings({ variant = 'card' }: { variant?: 'card' | 'menu' }) {
    const { t } = useTranslation();
    const { isDyslexic, isHighContrast, isReducedMotion, toggleDyslexic, toggleHighContrast, toggleReducedMotion } = useAccessibility();

    const containerClasses = variant === 'card' 
        ? "bg-white p-6 rounded-xl shadow-sm border border-gray-100" 
        : "p-4 border-b border-gray-100";

    const titleClasses = variant === 'card'
        ? "font-bold text-ink mb-4 flex items-center gap-2"
        : "text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2";

    const spacing = variant === 'card' ? "space-y-4" : "space-y-2";

    return (
        <div className={containerClasses}>
            <h3 className={titleClasses}>
                {variant === 'card' && <span>{t('user_menu.accessibility')}</span>}
                {variant === 'menu' && <span>{t('user_menu.accessibility')}</span>}
            </h3>
            <div className={spacing}>
                <ToggleItem 
                    label={t('user_menu.dyslexic')} 
                    description={t('user_menu.dyslexic_desc')}
                    active={isDyslexic} 
                    onClick={toggleDyslexic} 
                />
                <ToggleItem 
                    label={t('user_menu.high_contrast')} 
                    description={t('user_menu.high_contrast_desc')}
                    active={isHighContrast} 
                    onClick={toggleHighContrast} 
                />
                <ToggleItem 
                    label={t('user_menu.reduced_motion')} 
                    description={t('user_menu.reduced_motion_desc')}
                    active={isReducedMotion} 
                    onClick={toggleReducedMotion} 
                />
            </div>
        </div>
    );
}

const ToggleItem = ({ label, description, active, onClick }: { label: string, description: string, active: boolean, onClick: () => void }) => (
    <div className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors" onClick={onClick}>
        <div>
            <p className={`text-sm font-medium ${active ? 'text-primary' : 'text-gray-700'}`}>{label}</p>
            <p className="text-[10px] text-gray-400">{description}</p>
        </div>
        <div className={`w-10 h-6 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'left-5' : 'left-1'}`} />
        </div>
    </div>
);
