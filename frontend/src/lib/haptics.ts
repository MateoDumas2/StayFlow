export const triggerHaptic = (pattern: number | number[] = 200) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

export const hapticPatterns = {
    success: [100, 50, 100],
    error: [50, 100, 50, 100, 50],
    click: 50,
    light: 25,
    medium: 100,
    heavy: 150
};
