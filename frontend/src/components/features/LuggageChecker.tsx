"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LuggageChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !stream) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stream, startCamera, stopCamera]);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    
    // Simulate AR Analysis
    setTimeout(() => {
      setScanning(false);
      // Random result for demo purposes
      setResult(Math.random() > 0.3 ? 'success' : 'fail');
    }, 2000);
  };

  const closeChecker = () => {
    stopCamera();
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02]"
      >
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
        <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Scan size={24} />
            </div>
            <div>
                <h3 className="font-bold text-lg">AR Luggage Check</h3>
                <p className="text-blue-100 text-sm">Escanea tu maleta antes de ir al aeropuerto.</p>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="absolute top-4 right-4 z-20">
                <button onClick={closeChecker} className="text-white p-2 bg-black/50 rounded-full backdrop-blur-md">
                    ✕
                </button>
            </div>

            <div className="relative flex-1 bg-gray-900 overflow-hidden flex items-center justify-center">
                {stream ? (
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-white flex flex-col items-center gap-4">
                        <AlertTriangle size={48} className="text-yellow-500" />
                        <p>Iniciando cámara AR...</p>
                        <p className="text-xs text-gray-400 max-w-xs text-center">Asegúrate de permitir el acceso a la cámara.</p>
                    </div>
                )}

                {/* AR Overlay UI */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-80 border-2 border-white/50 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                        
                        {scanning && (
                             <motion.div 
                                className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                             />
                        )}
                    </div>
                </div>

                {/* Result Overlay */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute z-30 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-xs text-center mx-4"
                        >
                            {result === 'success' ? (
                                <>
                                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">¡Perfecto!</h3>
                                    <p className="text-gray-600 mb-4">Tu maleta cumple con las medidas estándar de cabina (55x40x20cm).</p>
                                    <Button onClick={closeChecker} variant="primary" className="w-full">Genial</Button>
                                </>
                            ) : (
                                <>
                                    <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Un poco grande...</h3>
                                    <p className="text-gray-600 mb-4">Parece exceder los límites de cabina. Te recomendamos documentarla.</p>
                                    <Button onClick={() => setResult(null)} variant="secondary" className="w-full">Reintentar</Button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-black/80 backdrop-blur-md p-6 pb-8 flex flex-col items-center gap-4">
                <p className="text-white/70 text-sm text-center">
                    Alinea tu maleta dentro del recuadro para verificar si cabe en cabina.
                </p>
                <Button 
                    size="lg" 
                    className={`w-full max-w-md rounded-full font-bold text-lg shadow-lg ${scanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleScan}
                    disabled={scanning || !stream}
                >
                    {scanning ? 'Analizando...' : '📷 Escanear Maleta'}
                </Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
