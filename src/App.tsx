/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Wind, 
  Layout, 
  MessageCircle, 
  BookOpen, 
  Activity, 
  ChevronRight, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Bell,
  Clock,
  Trash2,
  Plus,
  ArrowRight,
  Info,
  Settings,
  Zap,
  Volume2,
  Loader2,
  Square,
  RefreshCw,
  Mic,
  MicOff
} from 'lucide-react';
import { REGULATION_CARDS, ASSESSMENT_QUESTIONS, RESET_QUESTIONS, LOADING_MESSAGES, RegulationCard, STATE_OPTIONS, MOOD_OPTIONS, SLEEP_OPTIONS, INNER_WORK_PROMPTS, GUIDE_MYTHS, GUIDE_TRIGGERS, VAGUS_EXERCISES, JournalEntry, SOMATIC_EXERCISES, SOMATIC_WISDOMS } from './constants';
import { getGeminiResponse, generateSpeech } from './services/geminiService';
import Markdown from 'react-markdown';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, size = 'md', rounded = 'full' }: any) => {
  const sizes: any = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };
  const roundness: any = {
    full: "rounded-full",
    '2xl': "rounded-2xl",
    '3xl': "rounded-[32px]"
  };
  const base = `${sizes[size]} ${roundness[rounded]} font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50`;
  const variants: any = {
    primary: "bg-soft-taupe text-white hover:bg-opacity-90 shadow-md",
    secondary: "bg-white text-taupe border border-taupe/20 hover:bg-champagne",
    ghost: "bg-transparent text-taupe hover:bg-black/5",
    ventral: "bg-sage text-taupe hover:bg-opacity-80 shadow-sm",
    sympathetic: "bg-peach text-taupe hover:bg-opacity-80 shadow-sm",
    dorsal: "bg-sky text-taupe hover:bg-opacity-80 shadow-sm"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ card, isSelected, onClick }: { card: RegulationCard; isSelected: boolean; onClick: () => void }) => {
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border border-black/5 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'fixed inset-4 z-50 flex flex-col justify-center' : 'w-full'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-taupe">{card.category}</span>
        <span className="text-xs text-taupe/50">{card.duration}</span>
      </div>
      
      {!isSelected && (
        <div className="h-24 bg-taupe/5 rounded-xl mb-4 overflow-hidden">
          <ExerciseIllustration type={card.category} id={card.id} />
        </div>
      )}

      <h3 className="text-xl mb-2">{card.title}</h3>
      <p className="text-sm text-taupe/70 italic mb-4">{card.situation}</p>
      
      {isSelected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
          <div>
            <h4 className="font-bold text-xs uppercase mb-1">Oefening</h4>
            <p className="text-base leading-relaxed">{card.exercise}</p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase mb-1">Effect</h4>
            <p className="text-sm text-taupe/80">{card.effect}</p>
          </div>
          <Button onClick={(e: any) => { e.stopPropagation(); onClick(); }} className="w-full mt-6">Sluiten</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

const ExerciseIllustration = ({ type, id }: { type: string; id?: string }) => {
  const baseClasses = "w-full h-full flex items-center justify-center bg-taupe/5 overflow-hidden relative";
  
  // Determine specific illustration based on ID or Type
  let illustrationType = type;
  if (id === '13') illustrationType = 'box-breath';
  if (id === '1' || id === '25') illustrationType = 'water';
  if (id === '17') illustrationType = 'shake';
  if (id === '22') illustrationType = 'horizon';
  if (id === '7' || id === '24') illustrationType = 'feet';
  if (id === '6') illustrationType = 'ears';
  if (id === '5' || id === '15' || id === '32') illustrationType = 'heart';
  if (id === '12' || id === '4' || id === '33') illustrationType = 'breath-exhale';

  const renderIllustration = () => {
    switch (illustrationType) {
      case 'box-breath':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* The Box Path */}
            <rect x="50" y="50" width="100" height="100" rx="4" strokeOpacity="0.2" />
            
            {/* 4 Moving Points - one for each side */}
            {[0, 4, 8, 12].map((delay) => (
              <motion.circle
                key={delay}
                r="3"
                fill="currentColor"
                animate={{
                  cx: [50, 50, 150, 150, 50],
                  cy: [150, 50, 50, 150, 150],
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay,
                }}
              />
            ))}

            {/* Phase Labels with matching opacity */}
            <g className="text-[9px] font-bold uppercase tracking-[0.2em] fill-taupe/60">
              <motion.text 
                x="35" y="100" textAnchor="middle" 
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                animate={{ opacity: [1, 0.2, 0.2, 0.2, 1] }}
                transition={{ duration: 16, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
              >Inademing</motion.text>
              <motion.text 
                x="100" y="35" textAnchor="middle"
                animate={{ opacity: [0.2, 1, 0.2, 0.2, 0.2] }}
                transition={{ duration: 16, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
              >Vast</motion.text>
              <motion.text 
                x="165" y="100" textAnchor="middle" 
                style={{ writingMode: 'vertical-rl' }}
                animate={{ opacity: [0.2, 0.2, 1, 0.2, 0.2] }}
                transition={{ duration: 16, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
              >Uitademing</motion.text>
              <motion.text 
                x="100" y="170" textAnchor="middle"
                animate={{ opacity: [0.2, 0.2, 0.2, 1, 0.2] }}
                transition={{ duration: 16, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
              >Vast</motion.text>
            </g>

            {/* Arrows around the box */}
            <g strokeOpacity="0.3">
              <path d="M 40 130 L 40 70" markerEnd="url(#arrowhead)" />
              <path d="M 70 40 L 130 40" markerEnd="url(#arrowhead)" />
              <path d="M 160 70 L 160 130" markerEnd="url(#arrowhead)" />
              <path d="M 130 160 L 70 160" markerEnd="url(#arrowhead)" />
            </g>
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" opacity="0.3" />
              </marker>
            </defs>
          </svg>
        );
      case 'water':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path
              d="M40 100 Q100 80 160 100 T280 100"
              animate={{ x: [0, -120] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              strokeOpacity="0.3"
            />
            <motion.path
              d="M40 120 Q100 100 160 120 T280 120"
              animate={{ x: [0, -120] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: -2 }}
              strokeOpacity="0.2"
            />
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={70 + i * 30}
                cy="40"
                r="3"
                fill="currentColor"
                animate={{ cy: [40, 120], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
              />
            ))}
            <text x="100" y="190" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Koud Water</text>
          </svg>
        );
      case 'breath-exhale':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.circle
              cx="100" cy="100"
              animate={{ r: [30, 60, 30], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 12, times: [0, 0.33, 1], repeat: Infinity, ease: "easeInOut" }}
              fill="currentColor"
            />
            <motion.path
              d="M 60 100 Q 100 100 140 100"
              strokeDasharray="4 8"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <text x="100" y="185" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Lange Uitademing</text>
          </svg>
        );
      case 'shake':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.g
              animate={{ x: [-1, 1, -1], y: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 0.15, repeat: Infinity }}
            >
              <circle cx="100" cy="60" r="10" />
              <path d="M100 70 L100 130" />
              <path d="M100 85 L75 110" />
              <path d="M100 85 L125 110" />
            </motion.g>
            {[0, 1, 2].map(i => (
              <motion.path
                key={i}
                d={`M${70-i*10} 100 Q${60-i*10} 110 ${70-i*10} 120`}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
            <text x="100" y="195" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Schud los</text>
          </svg>
        );
      case 'horizon':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="20" y1="100" x2="180" y2="100" strokeOpacity="0.2" />
            <motion.path
              d="M50 100 Q100 60 150 100 Q100 140 50 100"
              strokeOpacity="0.3"
            />
            <motion.circle
              r="8"
              fill="currentColor"
              animate={{ cx: [70, 130, 70] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              cy="100"
            />
            <text x="100" y="170" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Horizon Scan</text>
          </svg>
        );
      case 'feet':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="30" y1="160" x2="170" y2="160" strokeWidth="2" strokeOpacity="0.5" />
            <motion.g
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M70 150 Q70 120 90 120 Q105 120 105 150" />
              <path d="M115 150 Q115 120 135 120 Q155 120 155 150" />
            </motion.g>
            <motion.circle
              cx="100" cy="160" r="40"
              animate={{ r: [20, 60], opacity: [0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <text x="100" y="195" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Gronden</text>
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path
              d="M100 140 C100 140 40 100 40 65 C40 45 55 35 70 35 C85 35 100 50 100 50 C100 50 115 35 130 35 C145 35 160 45 160 65 C160 100 100 140 100 140 Z"
              animate={{ scale: [1, 1.05, 1], fillOpacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              fill="currentColor"
            />
            <motion.circle
              cx="100" cy="80" r="50"
              animate={{ r: [30, 70], opacity: [0.2, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <text x="100" y="180" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Hart Verbinding</text>
          </svg>
        );
      case 'ears':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M80 60 Q50 60 50 100 Q50 140 80 140 Q110 140 110 100 Q110 60 80 60" strokeOpacity="0.4" />
            <motion.circle
              r="4"
              fill="currentColor"
              animate={{ cy: [80, 120, 80] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              cx="110"
            />
            <motion.circle
              r="4"
              fill="currentColor"
              animate={{ cy: [80, 120, 80] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              cx="50"
            />
            <text x="100" y="180" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Oor Massage</text>
          </svg>
        );
      case 'breath':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.circle
              cx="100" cy="100"
              animate={{ r: [30, 70, 30], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              fill="currentColor"
            />
            <motion.circle
              cx="100" cy="100"
              animate={{ r: [20, 60, 20] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <text x="100" y="190" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Ademhaling</text>
          </svg>
        );
      case 'focus':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.circle
              cx="100" cy="100"
              animate={{ r: [60, 5, 60], opacity: [0.05, 0.4, 0.05] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="100" cy="100" r="2"
              fill="currentColor"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="100" y="195" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Focus</text>
          </svg>
        );
      case 'creative':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <motion.path
              d="M100 100 C120 80 140 120 100 140 C60 160 40 100 100 60 C160 20 200 100 100 180"
              strokeDasharray="4 4"
              animate={{ strokeDashoffset: [40, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="100" cy="100" r="10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              fill="currentColor"
            />
            <text x="100" y="195" textAnchor="middle" className="text-[10px] font-bold fill-taupe/40 uppercase tracking-widest">Creativiteit</text>
          </svg>
        );
      default:
        return <Activity className="text-taupe/40" size={40} />;
    }
  };

  return (
    <div className={baseClasses}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        {renderIllustration()}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-taupe/5 pointer-events-none" />
    </div>
  );
};

const stripMarkdown = (text: string) => {
  return text
    .replace(/[#*`_~]/g, '') // Remove basic markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .trim();
};

const VoiceInputButton = ({ onTranscript, className = "" }: { onTranscript: (text: string) => void, className?: string }) => {
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Online status is unreliable in iframes, defaulting to true
    return () => {};
  }, []);

  const startListening = () => {
    if (!isOnline) {
      alert("Spraakherkenning vereist een internetverbinding.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Spraakherkenning wordt niet ondersteund in deze browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        alert("Microfoon toegang is geweigerd. Controleer je browserinstellingen en sta microfoongebruik toe voor deze site.");
      } else if (event.error === 'no-speech') {
        // Just stop listening silently if no speech was detected
      } else {
        alert(`Er ging iets mis met de spraakherkenning: ${event.error}`);
      }
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-2 rounded-full transition-all flex items-center justify-center z-10 ${!isOnline ? 'opacity-50' : ''} ${isListening ? 'bg-peach text-taupe animate-pulse' : 'bg-taupe/10 text-taupe hover:bg-taupe/20'} ${className}`}
      title={!isOnline ? "Mogelijk offline: Spraakherkenning kan beperkt zijn" : (isListening ? "Stop met luisteren" : "Spreek tekst in")}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
};

const VoiceExerciseButton = ({ text, className = "" }: { text: string; className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const createWavUrl = (base64Data: string) => {
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Add WAV header for 16-bit PCM, Mono, 24000Hz
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + bytes.length, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
    view.setUint16(32, numChannels * (bitsPerSample / 8), true);
    view.setUint16(34, bitsPerSample, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, bytes.length, true);

    const blob = new Blob([header, bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Ensure we have an audio element and "unlock" it immediately on user gesture
      // This is CRITICAL for mobile browsers (iOS/Safari)
      if (audioRef.current) {
        // Play a silent buffer and keep it looping to keep the audio session alive
        // while we wait for the network request to complete.
        audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
        audioRef.current.loop = true;
        try {
          await audioRef.current.play();
        } catch (e) {
          console.warn("Initial audio unlock failed:", e);
        }
      }

      const base64Audio = await generateSpeech(stripMarkdown(text));
      
      if (base64Audio) {
        // Revoke previous URL if exists
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }

        const audioUrl = createWavUrl(base64Audio);
        objectUrlRef.current = audioUrl;

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.loop = false;
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          
          audioRef.current.onended = () => setIsPlaying(false);
          audioRef.current.onerror = (e) => {
            console.error("Audio element error:", e);
            setIsPlaying(false);
          };

          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } else {
        console.error("No audio data received from TTS service");
      }
    } catch (error) {
      console.error("Error playing voice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <audio 
        ref={audioRef} 
        className="hidden" 
        playsInline 
        webkit-playsinline="true"
      />
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handlePlay();
        }}
        disabled={isLoading || !isOnline}
        className={`flex items-center gap-2 p-3 px-4 rounded-full hover:bg-taupe/10 transition-colors ${!isOnline ? 'opacity-20 cursor-not-allowed' : ''} ${isPlaying ? 'text-taupe bg-soft-taupe/10' : 'text-taupe'} ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
        title={!isOnline ? "Offline: Voorlezen niet beschikbaar" : (isPlaying ? "Stop met voorlezen" : "Lees voor")}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Laden...</span>
          </>
        ) : (
          <>
            {isPlaying ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
            {isPlaying && <span className="text-[10px] font-bold uppercase tracking-widest">Stop</span>}
          </>
        )}
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('regulated_journal_entries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('regulated_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const saveJournalEntry = (title: string, content: string, promptId?: string, type: 'glimmer' | 'trigger' | 'reflection' = 'reflection') => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title,
      content,
      promptId,
      mood: trackerMood || undefined,
      tags: [type]
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setInnerWorkResponse("");
    setSelectedInnerWorkPrompt(null);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const deleteJournalEntry = (id: string) => {
    if (confirm('Weet je zeker dat je dit dagboekfragment wilt verwijderen?')) {
      setJournalEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const [view, setView] = useState<'home' | 'assessment' | 'cards' | 'audio' | 'coach' | 'guide' | 'tracker' | 'reset' | 'profile' | 'card-state-selection' | 'reset-results' | 'reminders' | 'inner-work' | 'assessment-result' | 'journal' | 'somatic' | 'manual'>('home');
  const [innerWorkDetail, setInnerWorkDetail] = useState<'journal' | 'shadow' | 'compassion' | null>(null);
  const [innerWorkResponse, setInnerWorkResponse] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalType, setJournalType] = useState<'glimmer' | 'trigger' | 'reflection'>('glimmer');
  const [showJournalInfo, setShowJournalInfo] = useState(false);
  const [selectedInnerWorkPrompt, setSelectedInnerWorkPrompt] = useState<string | null>(null);
  const [activeSomaticId, setActiveSomaticId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const switchInnerWorkDetail = (detail: 'journal' | 'shadow' | 'compassion' | null) => {
    setInnerWorkDetail(detail);
    setInnerWorkResponse("");
    setSelectedInnerWorkPrompt(null);
  };
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentResults, setAssessmentResults] = useState<Record<string, string>>({});
  const [resetStep, setResetStep] = useState(0);
  const [resetResults, setResetResults] = useState<Record<string, string>>({});
  const [resetAdvice, setResetAdvice] = useState<RegulationCard[]>([]);
  const [resetProfile, setResetProfile] = useState<{ who: string, why: string, what: string } | null>(null);
  const [trackerStress, setTrackerStress] = useState<number | null>(null);
  const [trackerSleep, setTrackerSleep] = useState<string | null>(null);
  const [trackerMood, setTrackerMood] = useState<string | null>(null);
  const [trackerAdvice, setTrackerAdvice] = useState<{ title: string, content: string, exercises?: string[] } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentCardSelection, setCurrentCardSelection] = useState<RegulationCard[]>([]);
  const [chosenCards, setChosenCards] = useState<string[]>([]);
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);

  const getCurrentSomaticState = () => {
    if (userProfile?.style) return userProfile.style;
    if (trackerMood === 'frustrated') return 'fight';
    if (trackerMood === 'anxious') return 'flight';
    if (trackerMood === 'tired' || trackerMood === 'sad') return 'freeze';
    return 'all';
  };

  const currentSomaticState = getCurrentSomaticState();
  const somaticWisdom = SOMATIC_WISDOMS[currentSomaticState] || SOMATIC_WISDOMS.all;

  const filteredSomaticExercises = [...SOMATIC_EXERCISES].sort((a, b) => {
    if (a.state === currentSomaticState && b.state !== currentSomaticState) return -1;
    if (a.state !== currentSomaticState && b.state === currentSomaticState) return 1;
    if (a.state === 'all' && b.state !== 'all') return 1;
    if (a.state !== 'all' && b.state === 'all') return -1;
    return 0;
  });

  // Safety timeout for loading states
  useEffect(() => {
    let timeout: any;
    if (coachLoading) {
      timeout = setTimeout(() => {
        setCoachLoading(false);
      }, 30000); // 30 seconds safety net
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [coachLoading]);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [activeGuideState, setActiveGuideState] = useState<string | null>(null);
  const [revealedMyths, setRevealedMyths] = useState<number[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>(() => {
    const saved = localStorage.getItem('regulated_coach_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [userInput, setUserInput] = useState("");
  const [dailyInsight, setDailyInsight] = useState<{ text: string, date: string } | null>(() => {
    const saved = localStorage.getItem('regulated_daily_insight');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // Online status is unreliable in iframes, defaulting to true
    return () => {};
  }, []);

  useEffect(() => {
    const generateDailyInsight = async () => {
      const today = new Date().toLocaleDateString();
      if (dailyInsight && dailyInsight.date === today) return;

      if (!isOnline) {
        setDailyInsight({ 
          text: "Je bent momenteel offline. Focus op je ademhaling en voel de grond onder je voeten.", 
          date: today 
        });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        setDailyInsight({ 
          text: "Vandaag is een nieuwe kans om te luisteren naar wat je lichaam je vertelt.", 
          date: today 
        });
        return;
      }

      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Genereer een kort, krachtig en inspirerend "Inzicht van de dag" voor een app over zenuwstelselregulatie en persoonlijke groei. 
        Focus op thema's als: veiligheid in het lichaam, de kracht van pauzes, zelfcompassie, of het herkennen van overlevingsmechanismen.
        Houd het onder de 30 woorden. Taal: Nederlands.
        Format: Alleen de tekst van het inzicht, geen inleiding of aanhalingstekens.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        const newInsight = { text: response.text || "Vandaag is een nieuwe kans om te luisteren naar wat je lichaam je vertelt.", date: today };
        setDailyInsight(newInsight);
        localStorage.setItem('regulated_daily_insight', JSON.stringify(newInsight));
      } catch (error) {
        console.error("Error generating daily insight:", error);
      }
    };

    generateDailyInsight();
  }, [dailyInsight]);

  useEffect(() => {
    localStorage.setItem('regulated_coach_history', JSON.stringify(chatHistory));
    if (view === 'coach') {
      scrollToBottom();
    }
  }, [chatHistory, coachLoading, view]);

  const [showSavedToast, setShowSavedToast] = useState(false);
  const [reminders, setReminders] = useState<{id: string, time: string, label: string, days: string[], isActive: boolean}[]>(() => {
    const saved = localStorage.getItem('regulated_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '09:00', label: 'Ochtend Check-in', days: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'], isActive: true },
      { id: '2', time: '15:00', label: 'Middag Reset', days: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'], isActive: true }
    ];
  });
  const [reminderNotification, setReminderNotification] = useState<{label: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('regulated_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const days = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
      const currentDay = days[now.getDay()];

      reminders.forEach(reminder => {
        if (reminder.isActive && reminder.time === currentTime && reminder.days.includes(currentDay)) {
          setReminderNotification({ label: reminder.label });
          setTimeout(() => setReminderNotification(null), 10000);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('regulated_identity_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      // Backfill description if missing from older versions
      if (!profile.description || !profile.manifestation) {
        if (profile.style === 'fight') {
          profile.description = "Je systeem reageert op onveiligheid door in de aanval te gaan. Je wilt de controle behouden om jezelf en anderen te beschermen.";
          profile.manifestation = "Dit uit zich vaak in irritatie, kritiek of een sterke drang om alles te regelen.";
          profile.why = "Je systeem detecteert een dreiging en mobiliseert energie om terug te vechten of de controle te herstellen.";
        }
        else if (profile.style === 'flight') {
          profile.description = "Je systeem probeert veiligheid te vinden door afstand te creëren of constant in beweging te blijven.";
          profile.manifestation = "Dit merk je aan piekeren, constante drukte of de neiging om taken te ontwijken.";
          profile.why = "Je systeem voelt zich onveilig en probeert afstand te creëren door fysiek of mentaal weg te gaan.";
        }
        else if (profile.style === 'freeze') {
          profile.description = "Je systeem schakelt uit wanneer de dreiging te groot voelt. Je trekt je terug in jezelf om de overweldiging te overleven.";
          profile.manifestation = "Je voelt je verdoofd, afwezig of emotioneel vlak om jezelf te beschermen.";
          profile.why = "De dreiging voelt te groot om te vechten of vluchten, waardoor je systeem 'op slot' gaat.";
        }
        else {
          profile.description = "Je hebt geleerd dat veiligheid ligt in de verbinding met anderen, vaak ten koste van je eigen grenzen.";
          profile.manifestation = "Je negeert je eigen grenzen om de verbinding met anderen te behouden.";
          profile.why = "Je hebt geleerd dat aanpassing en pleasen de veiligste weg is om conflict te vermijden.";
        }
      }
      setUserProfile(profile);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 3000);
      setLoadingMsg(LOADING_MESSAGES[0]);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const startAssessment = () => {
    setView('assessment');
    setAssessmentStep(0);
    setAssessmentResults({});
  };

  const calculateProfile = (results: Record<string, string>) => {
    const style = results.style;
    const stress = results.stress;
    const sensitivity = results.sensitivity;
    const recovery = results.recovery;

    let advice: string[] = [];
    let who = "";
    let why = "";
    let manifestation = "";
    let what = "";
    let traits: string[] = [];
    let description = "";

    if (style === 'fight') {
      who = "De Beschermer";
      description = "Je systeem reageert op onveiligheid door in de aanval te gaan. Je wilt de controle behouden om jezelf en anderen te beschermen.";
      traits = ["Daadkrachtig", "Controlerend", "Beschermend", "Snel geïrriteerd"];
      why = "Je systeem detecteert een dreiging en mobiliseert energie om terug te vechten of de controle te herstellen.";
      manifestation = "Dit uit zich vaak in irritatie, kritiek of een sterke drang om alles te regelen.";
      what = "Het is belangrijk om de opgebouwde energie fysiek te ontladen en daarna bewust te vertragen om je systeem te laten weten dat de strijd voorbij is.";
      advice = [
        "Zet je handen tegen een muur en duw zo hard als je kunt voor 10 seconden. Laat dan los en zucht diep uit.",
        "Maak een korte, stevige wandeling of stamp even flink met je voeten op de grond om de adrenaline te kanaliseren.",
        "Zoek een rustige plek op en focus 2 minuten lang op een uitademing die twee keer zo lang is als je inademing."
      ];
    } else if (style === 'flight') {
      who = "De Zoeker";
      description = "Je systeem probeert veiligheid te vinden door afstand te creëren of constant in beweging te blijven.";
      traits = ["Actief", "Vooruitziend", "Onrustig", "Neiging tot piekeren"];
      why = "Je systeem voelt zich onveilig en probeert afstand te creëren door fysiek of mentaal weg te gaan.";
      manifestation = "Dit merk je aan piekeren, constante drukte of de neiging om taken te ontwijken.";
      what = "Je moet landen in het hier en nu. Gebruik je zintuigen om je brein te laten zien dat je omgeving op dit moment veilig is.";
      advice = [
        "Benoem hardop 5 dingen die je ziet, 4 die je hoort en 3 die je kunt aanraken om je brein terug naar het nu te halen.",
        "Spat koud water in je gezicht of houd een ijsblokje vast om je zenuwstelsel een milde 'reset' te geven.",
        "Leg een zwaar kussen op je schoot en voel het gewicht. Dit geeft je systeem een signaal van begrenzing en veiligheid."
      ];
    } else if (style === 'freeze') {
      who = "De Waarnemer";
      description = "Je systeem schakelt uit wanneer de dreiging te groot voelt. Je trekt je terug in jezelf om de overweldiging te overleven.";
      traits = ["Rustig (uiterlijk)", "Analytisch", "Soms afwezig", "Zwaar gevoel"];
      why = "De dreiging voelt te groot om te vechten of vluchten, waardoor je systeem 'op slot' gaat.";
      manifestation = "Je voelt je verdoofd, afwezig of emotioneel vlak om jezelf te beschermen.";
      what = "Zachtheid is de sleutel. Kom heel langzaam weer in beweging en maak voorzichtig contact met je omgeving zonder jezelf te forceren.";
      advice = [
        "Begin met kleine bewegingen: wiebel met je tenen, draai cirkeltjes met je polsen en rek je heel langzaam uit.",
        "Wrijf zachtjes over je bovenarmen of gezicht om weer contact te maken met je fysieke grenzen.",
        "Neem een warme douche of wikkel jezelf in een deken. Focus op de sensatie van warmte op je huid."
      ];
    } else {
      who = "De Harmonisator";
      description = "Je hebt geleerd dat veiligheid ligt in de verbinding met anderen, vaak ten koste van je eigen grenzen.";
      traits = ["Empathisch", "Aanpassingsvermogen", "Conflictvermijdend", "Zorgzaam"];
      why = "Je hebt geleerd dat aanpassing en pleasen de veiligste weg is om conflict te vermijden.";
      manifestation = "Je negeert je eigen grenzen om de verbinding met anderen te behouden.";
      what = "De focus moet terug naar binnen. Leer je eigen fysieke grenzen weer voelen en oefen met het innemen van je eigen ruimte.";
      advice = [
        "Leg een hand op je hart en een hand op je buik. Adem 1 minuut lang naar je handen toe en voel JOUW aanwezigheid.",
        "Oefen met 'nee' zeggen tegen iets kleins vandaag, puur om te voelen hoe het is om je eigen ruimte in te nemen.",
        "Visualiseer een cirkel om je heen die jouw persoonlijke ruimte markeert. Niemand mag daar zonder jouw toestemming in."
      ];
    }

    const profile = {
      style,
      who,
      description,
      manifestation,
      traits,
      why,
      what,
      stress,
      sensitivity,
      recovery,
      advice,
      suggestedCardIds: style === 'fight' ? ['3', '12', '17'] : 
                        style === 'flight' ? ['2', '1', '8'] : 
                        style === 'freeze' ? ['21', '32', '7'] : ['15', '24', '26'],
      date: new Date().toLocaleDateString('nl-NL')
    };

    setUserProfile(profile);
    localStorage.setItem('regulated_identity_profile', JSON.stringify(profile));
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
    setView('assessment-result');
  };

  const analyzeJournalWithCoach = () => {
    const glimmers = journalEntries.filter(e => e.tags?.includes('glimmer'));
    const triggers = journalEntries.filter(e => e.tags?.includes('trigger'));
    
    let analysisPrompt = "Ik heb de afgelopen tijd mijn Glimmers en Triggers bijgehouden. Kun je me helpen patronen te ontdekken in mijn zenuwstelsel?\n\n";
    
    if (glimmers.length > 0) {
      analysisPrompt += "Mijn Glimmers:\n" + glimmers.map(g => `- ${g.title}: ${g.content}`).join('\n') + "\n\n";
    }
    
    if (triggers.length > 0) {
      analysisPrompt += "Mijn Triggers:\n" + triggers.map(t => `- ${t.title}: ${t.content}`).join('\n') + "\n\n";
    }
    
    analysisPrompt += "Wat valt je op aan deze lijst? Welke strategieën of oefeningen raad je me aan op basis van deze specifieke inzichten?";
    
    setUserInput(analysisPrompt);
    setView('coach');
  };

  const startReset = () => {
    setView('reset');
    setResetStep(0);
    setResetResults({});
  };

  const calculateResetAdvice = (results: Record<string, string>) => {
    const feeling = results.feeling;
    const time = results.time;
    const location = results.location;

    let cardIds: string[] = [];
    let who = "";
    let why = "";
    let what = "";

    if (feeling === 'tense') {
      who = "De Strijder";
      why = "Er zit veel actieve spanning in je spieren en zenuwstelsel. Je bent in een staat van paraatheid.";
      what = "Je moet deze energie fysiek ontladen of via je ademhaling kalmeren.";
      cardIds = ['12', '17', '1'];
    } else if (feeling === 'tired') {
      who = "De Uitgeputte";
      why = "Je reserves zijn laag. Je systeem probeert energie te besparen maar voelt zich nog niet veilig genoeg om echt te rusten.";
      what = "Focus op zachte activering en diepe rust zonder prikkels.";
      cardIds = ['13', '24', '22'];
    } else if (feeling === 'numb') {
      who = "De Afwezige";
      why = "Je bent uit contact met je lichaam gegaan om jezelf te beschermen tegen overweldiging.";
      what = "Gebruik zintuiglijke prikkels om heel voorzichtig weer terug te keren in het hier en nu.";
      cardIds = ['1', '7', '34'];
    } else {
      who = "De Onrustige";
      why = "Je gedachten schieten alle kanten op en je kunt je draai niet vinden. Je systeem zoekt naar veiligheid.";
      what = "Breng focus aan en begrens je aandacht naar één ding in je omgeving.";
      cardIds = ['15', '4', '6'];
    }

    if (time === '5min' && !cardIds.includes('22')) {
      cardIds.push('22');
    } else if (time === '15min') {
      cardIds.push('19');
    }

    if (location === 'public') {
      cardIds = cardIds.map(id => id === '17' ? '16' : id);
    }

    const cards = cardIds
      .map(id => REGULATION_CARDS.find(c => c.id === id))
      .filter((c): c is RegulationCard => !!c);

    setResetAdvice(cards);
    setResetProfile({ who, why, what });
    setView('reset-results');
  };

  const calculateTrackerAdvice = () => {
    if (trackerStress === null || !trackerSleep || !trackerMood) return;

    let title = "";
    let content = "";
    let exercises: string[] = [];

    if (trackerStress > 7) {
      title = "Focus op Veiligheid";
      content = "Je stressniveau is hoog. Vandaag is niet de dag voor grote uitdagingen. Focus op micro-regulatie: ademhaling, zachte beweging en zintuiglijke begrenzing. Zeg vaker 'nee' tegen prikkels.";
      exercises = ['12', '20', '7']; // Verlengde Uitademing, Vlinderknuffel (actually 5), Voeten op de Grond
    } else if (trackerMood === 'anxious' || trackerMood === 'frustrated') {
      title = "Ontlaad de Energie";
      content = "Er zit veel actieve energie in je systeem. Gebruik 'Shake it Out' of 'Muur Duwen' om deze spanning fysiek te ontladen voordat je probeert te ontspannen.";
      exercises = ['17', '3']; // Shake it Out, Muur Duwen
    } else if (trackerSleep === 'bad' || trackerSleep === 'restless') {
      title = "Zachte Landing";
      content = "Je hebt weinig reserve door een slechte nacht. Wees extra mild voor jezelf. Vermijd cafeïne na 14:00 en plan vanavond een vroege, schermvrije 'wind-down' routine.";
      exercises = ['8', '11', '32']; // Gewicht op Schoot, Zachte Blik, Zachte Aanraking
    } else if (trackerMood === 'calm' && trackerStress < 4) {
      title = "Veranker de Rust";
      content = "Je bent in een goede staat! Gebruik dit moment om je 'Window of Tolerance' te verankeren. Doe een korte focus-oefening om deze helderheid mee te nemen in je dag.";
      exercises = ['22', '24', '26']; // Horizon Scan, Rechtstaan als een Boom, Power Pose
    } else {
      title = "Blijf in Verbinding";
      content = "Check gedurende de dag regelmatig in bij je lichaam. Een hand op je hart of even bewust je voeten voelen helpt je om in je window te blijven.";
      exercises = ['15', '7', '6']; // Hand op Buik, Voeten op de Grond, Oor Massage
    }

    // Save to history (mock for now, but feels real)
    const entry = {
      date: new Date().toISOString(),
      stress: trackerStress,
      sleep: trackerSleep,
      mood: trackerMood
    };
    const history = JSON.parse(localStorage.getItem('regulated_tracker_history') || '[]');
    history.push(entry);
    localStorage.setItem('regulated_tracker_history', JSON.stringify(history));

    setTrackerAdvice({ title, content, exercises });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleResetAnswer = (state: string) => {
    const currentQuestion = RESET_QUESTIONS[resetStep];
    const newResults = { ...resetResults, [currentQuestion.id]: state };
    
    if (resetStep < RESET_QUESTIONS.length - 1) {
      setResetResults(newResults);
      setResetStep(resetStep + 1);
    } else {
      calculateResetAdvice(newResults);
    }
  };

  const handleAssessmentAnswer = (state: string) => {
    const currentQuestion = ASSESSMENT_QUESTIONS[assessmentStep];
    const newResults = { ...assessmentResults, [currentQuestion.id]: state };
    
    if (assessmentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setAssessmentResults(newResults);
      setAssessmentStep(assessmentStep + 1);
    } else {
      calculateProfile(newResults);
    }
  };

  const shareWithCoach = async (prompt: string, answer: string) => {
    if (!answer.trim()) return;
    
    const fullMessage = `Ik heb gewerkt aan de Inner Work oefening: "${prompt}".\n\nMijn antwoord was:\n"${answer}"\n\nKun je me helpen dit verder te verkennen?`;
    
    const userMessage = { role: 'user' as const, parts: [{ text: fullMessage }] };
    const modelPlaceholder = { role: 'model' as const, parts: [{ text: "" }] };
    const updatedHistory = [...chatHistory, userMessage];
    const historyWithPlaceholder = [...updatedHistory, modelPlaceholder];
    
    setChatHistory(historyWithPlaceholder);
    setView('coach');
    setInnerWorkResponse("");
    setSelectedInnerWorkPrompt(null);
    setCoachLoading(true);
    
    try {
      // Check if API key is available, otherwise use fallback
      if (process.env.GEMINI_API_KEY) {
        await getCoachResponseStream(
          updatedHistory, 
          fullMessage, 
          userProfile, 
          (text) => {
            setChatHistory(prev => {
              const newHistory = [...prev];
              if (newHistory.length > 0) {
                newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text }] };
              }
              return newHistory;
            });
          }
        );
      } else {
        // Fallback response when no API key is present
        setTimeout(() => {
          const fallbackText = "Ik ben momenteel in 'offline modus' omdat er geen API-sleutel is geconfigureerd. Ik kan je nog steeds helpen met de oefeningen in de app, maar voor diepgaande gesprekken is een verbinding nodig. Wat kan ik voor je doen met de beschikbare tools?";
          setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: fallbackText }] };
            return newHistory;
          });
          setCoachLoading(false);
        }, 1000);
        return;
      }
    } catch (error) {
      console.error("Coach Error (shareWithCoach):", error);
      const errorMessage = error instanceof Error ? error.message : "Onbekende fout";
      setChatHistory(prev => {
        const newHistory = [...prev];
        // Remove the placeholder and the failed user message to keep history clean
        if (newHistory.length >= 2) {
          return newHistory.slice(0, -2);
        }
        return newHistory;
      });
      alert(`Excuses, er ging iets mis bij het ophalen van een reactie: ${errorMessage}. Probeer het nog eens.`);
    } finally {
      setCoachLoading(false);
    }
  };

  const shareTrackerWithCoach = async () => {
    if (!isOnline) {
      alert("De AI Coach is niet beschikbaar in offline modus.");
      return;
    }

    if (trackerStress === null || !trackerMood || !trackerSleep || !trackerAdvice) {
      console.warn("Missing tracker data for sharing:", { trackerStress, trackerMood, trackerSleep, trackerAdvice });
      return;
    }
       
const handleSendMessage = async () => {
    if (!userInput.trim() || coachLoading) return;
     
    const userMsg = userInput.trim();
    setUserInput("");
    
    const newHistory: any = [...chatHistory, { role: 'user', parts: [{ text: userMsg }] }];
    setChatHistory(newHistory);
    setCoachLoading(true);

    try {
      // Directe verbinding met de nieuwe service
      const response = await getGeminiResponse(chatHistory, userMsg);
      
      const updatedHistory: any = [...newHistory, { role: 'model', parts: [{ text: response }] }];
      setChatHistory(updatedHistory);
      
      localStorage.setItem('regulated_coach_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Coach error:", error);
    } finally {
      setCoachLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };
  const handleStateSelection = (stateId: string) => {
    setCurrentState(stateId);
    const state = STATE_OPTIONS.find(s => s.id === stateId);
    if (state) {
      const filtered = REGULATION_CARDS.filter(card => state.categories.includes(card.category));
      // Pick 5 random cards
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setCurrentCardSelection(shuffled.slice(0, 5));
      setChosenCards([]);
      setView('cards');
    }
  };

  const toggleCardChoice = (cardId: string) => {
    if (chosenCards.includes(cardId)) {
      setChosenCards(chosenCards.filter(id => id !== cardId));
    } else {
      if (chosenCards.length < 2) {
        setChosenCards([...chosenCards, cardId]);
      } else {
        // Replace the first one if we already have two to make it "always work"
        setChosenCards([chosenCards[1], cardId]);
      }
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-champagne relative overflow-hidden flex flex-col">
      {/* Background Visuals */}
      <motion.div 
        animate={{ 
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="bg-blob bg-blob-1" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0],
          y: [0, 30, -40, 0],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="bg-blob bg-blob-2" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.1, 0.2, 0.15, 0.1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="bg-blob bg-blob-3" 
      />

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        {view === 'home' ? (
          <button 
            onClick={() => setView('manual')} 
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-taupe"
            title="Handleiding"
          >
            <Info size={24} />
          </button>
        ) : (
          <button 
            onClick={() => {
              if (view === 'inner-work' && innerWorkDetail) {
                switchInnerWorkDetail(null);
              } else if (view === 'assessment' && assessmentStep > 0) {
                setAssessmentStep(assessmentStep - 1);
              } else if (view === 'reset' && resetStep > 0) {
                setResetStep(resetStep - 1);
              } else {
                setView('home');
              }
            }} 
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-serif tracking-tight">The Regulated Identity Code™</h1>
        <button 
          onClick={() => setView('profile')} 
          className={`p-3 hover:bg-black/5 rounded-full transition-colors ${view === 'profile' ? 'text-soft-taupe' : 'text-taupe'}`}
          title="Instellingen & Profiel"
        >
          <Settings size={24} />
        </button>
        {!isOnline && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-peach/90 text-taupe text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-50">
            <Activity size={10} className="animate-pulse" />
            <span>Offline Modus</span>
          </div>
        )}
        {view === 'coach' && chatHistory.length > 0 ? (
          <button 
            onClick={() => {
              if (confirm('Weet je zeker dat je de chatgeschiedenis wilt wissen?')) {
                setChatHistory([]);
              }
            }}
            className="p-2 text-taupe/40 hover:text-taupe transition-colors"
            title="Wis geschiedenis"
          >
            <Trash2 size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-4"
            >
              <section className="text-center space-y-6">
                <div className="relative w-full h-56 rounded-[48px] overflow-hidden shadow-2xl">
                  {/* ... existing image ... */}
                  <motion.img 
                    animate={{ scale: [1.1, 1.15, 1.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80" 
                    alt="Rustgevende natuur" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-champagne via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full mb-4 flex items-center justify-center shadow-xl border border-white/20">
                      <Sparkles className="text-taupe" size={24} />
                    </div>
                    <div className="max-w-[90%] space-y-1">
                      <h2 className="text-4xl font-serif leading-tight text-taupe drop-shadow-sm">Welkom thuis in je lijf.</h2>
                      <p className="text-taupe/80 italic text-base drop-shadow-sm">Vind rust in de chaos van alledag.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setView('manual')}
                  className="w-full bg-white/70 backdrop-blur-sm border border-taupe/20 py-4 px-6 rounded-[32px] flex items-center justify-between group hover:bg-white/90 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-soft-taupe text-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Info size={20} />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-taupe uppercase tracking-widest">Handleiding</span>
                      <span className="block text-sm text-taupe italic">Hoe gebruik ik deze app?</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-taupe/40 group-hover:translate-x-1 transition-transform" />
                </button>

                {userProfile ? (
                  <div className="bg-white/40 backdrop-blur-sm p-6 rounded-[32px] border border-taupe/10 space-y-4 shadow-sm">
                    <div className="space-y-1 text-center">
                      <div className="flex items-center justify-center gap-3 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-xs font-bold text-taupe/80 uppercase tracking-[0.2em]">Huidige Staat</p>
                      </div>
                      <h3 className="text-2xl font-serif text-taupe uppercase tracking-widest">{userProfile.who}</h3>
                      <p className="text-xs font-bold text-soft-taupe uppercase tracking-[0.15em]">({userProfile.style})</p>
                    </div>
                    
                    <div className="space-y-3 px-2">
                      <p className="text-sm text-taupe/90 leading-relaxed text-center font-medium">
                        {userProfile.description}
                      </p>
                      <div className="bg-taupe/5 p-4 rounded-2xl space-y-2">
                        <p className="text-xs text-taupe/80 leading-relaxed text-center italic">
                          {userProfile.manifestation}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[9px] text-taupe/70 text-center uppercase tracking-widest">Voel je je anders? Vernieuw je staat.</p>
                      <div className="flex gap-3 justify-center">
                        <Button 
                          onClick={() => setView('profile')} 
                          variant="ventral" 
                          size="sm" 
                          rounded="2xl" 
                          className="flex-1 font-bold uppercase tracking-widest"
                        >
                          Mijn Advies
                        </Button>
                        <Button 
                          onClick={startAssessment} 
                          variant="dorsal" 
                          size="sm" 
                          rounded="2xl" 
                          className="flex-1 font-bold uppercase tracking-widest"
                        >
                          <RefreshCw size={10} />
                          Update Huidige Staat
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[40px] border border-taupe/10 space-y-6 shadow-sm">
                    <p className="text-taupe/70 text-sm leading-relaxed">Begin met de zenuwstelsel-check om jouw persoonlijke regulatie-code te kraken.</p>
                    <Button onClick={startAssessment} variant="ventral" className="w-full py-4 text-lg shadow-xl shadow-sage/20">
                      Start de Intake
                    </Button>
                  </div>
                )}
              </section>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[12px] font-bold text-taupe/80 uppercase tracking-[0.3em] pl-2">Directe Hulp</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setView('card-state-selection')} className="bg-white p-5 rounded-[32px] shadow-sm border border-black/5 flex flex-col gap-3 text-left hover:shadow-md transition-all group active:scale-[0.98]">
                      <div className="flex justify-between items-start w-full">
                        <div className="w-10 h-10 bg-sage/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-sage group-hover:text-taupe transition-all">
                          <Layout size={20} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Bekijk</span>
                          <ChevronRight size={14} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-taupe">Regulatie Kaarten</h3>
                        <p className="text-xs text-taupe/80 leading-tight">35 tools voor nu</p>
                      </div>
                    </button>

                    <button onClick={() => setView('somatic')} className="bg-white p-5 rounded-[32px] shadow-sm border border-black/5 flex flex-col gap-3 text-left hover:shadow-md transition-all group active:scale-[0.98]">
                      <div className="flex justify-between items-start w-full">
                        <div className="w-10 h-10 bg-peach/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-peach group-hover:text-taupe transition-all">
                          <Sparkles size={20} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Toolbox</span>
                          <ChevronRight size={14} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-taupe">Somatic Toolbox</h3>
                        <p className="text-xs text-taupe/80 leading-tight">Bottom-up regulatie</p>
                      </div>
                    </button>

                    <button onClick={() => setView('coach')} className="bg-white p-5 rounded-[32px] shadow-sm border border-black/5 flex flex-col gap-3 text-left hover:shadow-md transition-all group active:scale-[0.98]">
                      <div className="flex justify-between items-start w-full">
                        <div className="w-10 h-10 bg-sky/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-sky group-hover:text-taupe transition-all">
                          <MessageCircle size={20} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Chat</span>
                          <ChevronRight size={14} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-taupe">Coach</h3>
                        <p className="text-xs text-taupe/80 leading-tight">Samen reguleren</p>
                      </div>
                    </button>

                    <button onClick={() => setView('tracker')} className="bg-white p-5 rounded-[32px] shadow-sm border border-black/5 flex flex-col gap-3 text-left hover:shadow-md transition-all group active:scale-[0.98]">
                      <div className="flex justify-between items-start w-full">
                        <div className="w-10 h-10 bg-sage/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-sage group-hover:text-taupe transition-all">
                          <Activity size={20} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Log</span>
                          <ChevronRight size={14} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-taupe">Dagelijkse Tracker</h3>
                        <p className="text-xs text-taupe/80 leading-tight">Check-in & Voortgang</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[12px] font-bold text-taupe/80 uppercase tracking-[0.3em] pl-2">Verdieping & Kennis</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => setView('guide')} className="bg-white p-5 rounded-[32px] shadow-sm border border-soft-taupe/20 flex items-center gap-4 text-left hover:shadow-md transition-all group ring-1 ring-soft-taupe/5 active:scale-[0.98]">
                      <div className="w-12 h-12 bg-sage/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-sage transition-all">
                        <Activity size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-taupe">Zenuwstelsel Guide</h3>
                        <p className="text-xs text-taupe/80 italic">Ontdek hoe jouw lichaam werkt</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Bekijk</span>
                        <ChevronRight size={16} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                      </div>
                    </button>

                    <button onClick={() => { setView('inner-work'); switchInnerWorkDetail(null); }} className="bg-white p-5 rounded-[32px] shadow-sm border border-black/5 flex items-center gap-4 text-left hover:shadow-md transition-all group active:scale-[0.98]">
                      <div className="w-12 h-12 bg-peach/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-peach transition-all">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-taupe">Inner Work</h3>
                          <div className="flex gap-1">
                            <span className="text-[8px] bg-taupe/10 text-taupe px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">Nieuw</span>
                          </div>
                        </div>
                        <p className="text-xs text-taupe/80">Zelfontdekking & Groei</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Start</span>
                        <ChevronRight size={16} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                      </div>
                    </button>

                    <button onClick={startReset} className="bg-white p-5 rounded-[32px] shadow-sm border border-black/5 flex items-center gap-4 text-left hover:shadow-md transition-all group active:scale-[0.98]">
                      <div className="w-12 h-12 bg-sky/30 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-sky transition-all">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-taupe">Self-Care Reset</h3>
                        <p className="text-xs text-taupe/80">Plan voor vandaag</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Start</span>
                        <ChevronRight size={16} className="text-taupe/40 group-hover:text-taupe transition-colors" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="relative w-full h-32 rounded-3xl overflow-hidden mb-4">
                <motion.img 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  src="https://picsum.photos/seed/calm/600/200" 
                  alt="Calm" 
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-champagne" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-xs font-bold text-taupe uppercase tracking-widest">Stap {assessmentStep + 1} van {ASSESSMENT_QUESTIONS.length}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl">{ASSESSMENT_QUESTIONS[assessmentStep].question}</h2>
              </div>
              <div className="space-y-4">
                {ASSESSMENT_QUESTIONS[assessmentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAssessmentAnswer(opt.state)}
                    className="w-full p-6 bg-white rounded-2xl border border-black/5 text-left hover:border-taupe/50 transition-all shadow-sm flex justify-between items-center group active:scale-[0.99]"
                  >
                    <span className="font-medium">{opt.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Kies</span>
                      <ChevronRight className="text-taupe/40 group-hover:text-taupe transition-colors" size={18} />
                    </div>
                  </button>
                ))}
              </div>

              {assessmentStep > 0 && (
                <button
                  onClick={() => setAssessmentStep(assessmentStep - 1)}
                  className="w-full py-3 text-taupe/60 text-xs font-bold uppercase tracking-widest hover:text-taupe transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} />
                  Vorige stap
                </button>
              )}
            </motion.div>
          )}

          {view === 'assessment-result' && userProfile && (
            <motion.div
              key="assessment-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8 pt-8 pb-32"
            >
              <div className="text-center space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-24 h-24 bg-sage rounded-full mx-auto flex items-center justify-center text-taupe shadow-2xl border-4 border-white/20"
                >
                  <Sparkles size={48} />
                </motion.div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-taupe/60">Jouw Archetype is</span>
                  <div className="flex items-center justify-center gap-4">
                    <h2 className="text-5xl font-serif text-taupe">{userProfile.who}</h2>
                    <VoiceExerciseButton text={`Jouw Archetype is ${userProfile.who}. ${userProfile.description}`} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Activity size={120} />
                </div>
                
                <div className="space-y-4 relative z-10">
                  <p className="text-lg leading-relaxed text-taupe italic">
                    "{userProfile.description}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {(userProfile.traits || []).map((trait: string) => (
                      <span key={trait} className="px-4 py-1.5 bg-peach/20 rounded-full text-xs font-bold text-taupe/60 uppercase tracking-widest">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 space-y-4 relative z-10">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-taupe/40 mb-2">De Kern</h4>
                    <p className="text-sm text-taupe/80 leading-relaxed">{userProfile.why}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-taupe/40 mb-2">Jouw Pad naar Rust</h4>
                    <p className="text-sm text-taupe/80 leading-relaxed">{userProfile.what}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button onClick={() => setView('profile')} variant="ventral" className="w-full py-4 text-lg">
                  Bekijk mijn volledig advies
                </Button>
                <button 
                  onClick={() => setView('home')}
                  className="w-full py-3 text-taupe/60 text-xs font-bold uppercase tracking-widest hover:text-taupe transition-colors"
                >
                  Naar het dashboard
                </button>
              </div>
            </motion.div>
          )}

          {view === 'card-state-selection' && (
            <motion.div
              key="card-state-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl">Hoe voel je je nu?</h2>
                <p className="text-taupe/70 text-sm">Selecteer je huidige staat voor een selectie op maat.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {STATE_OPTIONS.map((opt) => {
                  const getStateColor = (id: string) => {
                    if (['overwhelmed', 'anxious', 'angry'].includes(id)) return 'bg-peach/30';
                    if (['frozen', 'blocked', 'tired'].includes(id)) return 'bg-sky/30';
                    return 'bg-sage/30';
                  };
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleStateSelection(opt.id)}
                      className="w-full p-5 bg-white rounded-2xl border border-black/5 text-left hover:border-taupe/50 transition-all shadow-sm flex justify-between items-center group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStateColor(opt.id)}`} />
                        <span className="font-medium">{opt.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Kies</span>
                        <ChevronRight className="text-taupe/40 group-hover:text-taupe transition-colors" size={20} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4 space-y-8 pb-32"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl">Jouw Selectie</h2>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-taupe/70 uppercase tracking-widest font-bold">Kies 1 of 2 kaarten om te doen</p>
                  <div className="flex gap-2 mt-2">
                    {[1, 2].map(num => (
                      <div 
                        key={num} 
                        className={`w-3 h-3 rounded-full border ${chosenCards.length >= num ? 'bg-soft-taupe border-soft-taupe' : 'border-taupe/20'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentCardSelection.length > 0 ? (
                  currentCardSelection.map((card) => {
                    const isChosen = chosenCards.includes(card.id);
                    const isExpanded = selectedCard === card.id;
                    
                    return (
                      <motion.div
                        key={card.id}
                        layout
                        className={`bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden ${isChosen ? 'border-taupe ring-4 ring-taupe/5 shadow-md' : 'border-black/5 shadow-sm'}`}
                      >
                        <div className="h-32 bg-taupe/5">
                          <ExerciseIllustration type={card.category} id={card.id} />
                        </div>
                        <div 
                          onClick={() => toggleCardChoice(card.id)}
                          className="p-5 cursor-pointer flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {(() => {
                                const getCategoryColor = (cat: string) => {
                                  switch (cat) {
                                    case 'reset': return 'bg-peach/40 text-taupe';
                                    case 'sensory': return 'bg-sage/40 text-taupe';
                                    case 'breath': return 'bg-sage/40 text-taupe';
                                    case 'release': return 'bg-peach/40 text-taupe';
                                    case 'focus': return 'bg-sky/40 text-sky-800';
                                    case 'creative': return 'bg-sky/40 text-sky-800';
                                    default: return 'bg-taupe/10 text-taupe';
                                  }
                                };
                                return (
                                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${getCategoryColor(card.category)}`}>
                                    {card.category}
                                  </span>
                                );
                              })()}
                              <span className="text-[10px] text-taupe/30">•</span>
                              <span className="text-[10px] text-taupe/40 font-bold uppercase tracking-widest">{card.duration}</span>
                            </div>
                            <h3 className="text-lg font-serif leading-tight">{card.title}</h3>
                            <p className="text-xs text-taupe/60 italic mt-1 line-clamp-1">{card.situation}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCard(isExpanded ? null : card.id);
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isExpanded ? 'bg-taupe text-white' : 'bg-taupe/5 text-taupe/60 hover:bg-taupe/10'}`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider">{isExpanded ? 'Minder' : 'Bekijk'}</span>
                              {isExpanded ? <X size={14} /> : <BookOpen size={14} />}
                            </button>
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isChosen ? 'bg-soft-taupe border-soft-taupe text-white shadow-lg scale-110' : 'border-taupe/20 text-transparent hover:border-taupe/40'}`}>
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-5 pb-5 border-t border-black/5 pt-4 space-y-4 bg-black/[0.02]"
                            >
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="text-[10px] font-bold uppercase text-taupe/40">Stap voor stap</h4>
                                  <VoiceExerciseButton text={`${card.title}. ${card.exercise}`} />
                                </div>
                                <div className="space-y-2">
                                  {card.exercise.split('\n').map((step, i) => (
                                    <p key={i} className="text-sm leading-relaxed text-taupe/90">
                                      {step}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-bold uppercase text-taupe/40 mb-1">Effect</h4>
                                <p className="text-xs text-taupe/70 italic">{card.effect}</p>
                              </div>
                              <Button 
                                variant={isChosen ? 'secondary' : 'primary'}
                                onClick={() => {
                                  toggleCardChoice(card.id);
                                  setSelectedCard(null);
                                }}
                                className="w-full py-2 text-sm"
                              >
                                {isChosen ? 'Deselecteer' : 'Selecteer deze kaart'}
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-taupe/50 italic">Geen selectie gevonden.</p>
                    <Button onClick={() => setView('card-state-selection')}>Kies een categorie</Button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {chosenCards.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 left-6 right-6 z-30"
                  >
                    <Button onClick={() => setView('home')} className="w-full py-4 shadow-xl shadow-soft-taupe/20">
                      Ik ben klaar met mijn oefening(en)
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}


          {view === 'inner-work' && (
            <motion.div
              key="inner-work"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-4 pb-32"
            >
              {!innerWorkDetail ? (
                <>
                  <div className="text-center space-y-6">
                    <div className="relative w-full h-40 rounded-[40px] overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/growth/600/300" 
                        alt="Growth" 
                        className="w-full h-full object-cover opacity-50"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-champagne to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-taupe shadow-sm">
                          <Sparkles size={32} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="text-4xl">Inner Work</h2>
                        {userProfile && (
                          <div className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            Gepersonaliseerd
                          </div>
                        )}
                      </div>
                      <p className="text-taupe/80 italic">Tools en oefeningen voor zelfontdekking en groei.</p>
                      {userProfile && (
                        <div className="flex flex-col items-center gap-2 mt-4">
                          <p className="text-[10px] text-taupe/60 font-bold uppercase tracking-[0.2em]">
                            Gepersonaliseerd voor
                          </p>
                          <div className="bg-soft-taupe/5 px-4 py-2 rounded-2xl border border-soft-taupe/10">
                            <span className="text-lg font-serif text-taupe">{userProfile.who || 'De Ontdekker'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-soft-taupe text-white p-8 rounded-[40px] shadow-lg shadow-soft-taupe/20 space-y-4 relative overflow-hidden group cursor-pointer" onClick={() => setView('guide')}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <BookOpen size={24} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif">Zenuwstelsel 101</h3>
                        <p className="text-white/80 text-sm leading-relaxed">Begrijp de taal van je lichaam. Wat is het zenuwstelsel, wat doet het en hoe reguleer je het?</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest pt-2">
                        <span>Lees de gids</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-black/5 space-y-4 relative overflow-hidden group cursor-pointer" onClick={() => setView('journal')}>
                      <div className="w-12 h-12 bg-taupe/10 rounded-2xl flex items-center justify-center text-taupe group-hover:bg-taupe group-hover:text-white transition-all">
                        <Sparkles size={24} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif">Glimmers & Triggers</h3>
                        <p className="text-taupe/90 text-sm leading-relaxed">Breng je zenuwstelsel in kaart. Wat geeft je veiligheid (Glimmers) en wat activeert je (Triggers)?</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest pt-2 text-soft-taupe">
                        <span>Open overzicht</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>

                    {!userProfile && (
                      <div className="bg-taupe/5 p-6 rounded-3xl border border-taupe/10 flex flex-col items-center text-center space-y-3">
                        <p className="text-xs text-taupe/60 italic">
                          Wil je oefeningen die specifiek zijn afgestemd op jouw zenuwstelsel?
                        </p>
                        <button 
                          onClick={() => setView('assessment')}
                          className="text-xs font-bold text-taupe underline underline-offset-4 hover:text-taupe/80 transition-colors"
                        >
                          Doe de Intake Assessment
                        </button>
                      </div>
                    )}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-black/5 space-y-4">
                      <div className="w-12 h-12 bg-taupe/10 rounded-2xl flex items-center justify-center text-taupe">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-2xl">Journaling Prompts</h3>
                      <p className="text-taupe/90 text-sm leading-relaxed">Verken je innerlijke wereld door middel van gerichte vragen die je helpen dieper te graven.</p>
                      <Button onClick={() => switchInnerWorkDetail('journal')} variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <span>Start Journaling</span>
                        <ChevronRight size={16} />
                      </Button>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-black/5 space-y-4">
                      <div className="w-12 h-12 bg-taupe/10 rounded-2xl flex items-center justify-center text-taupe">
                        <Activity size={24} />
                      </div>
                      <h3 className="text-2xl">Shadow Work</h3>
                      <p className="text-taupe/90 text-sm leading-relaxed">Onderzoek de verborgen delen van jezelf om meer heelheid en zelfacceptatie te vinden.</p>
                      <Button onClick={() => switchInnerWorkDetail('shadow')} variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <span>Ontdek Shadow Work</span>
                        <ChevronRight size={16} />
                      </Button>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-black/5 space-y-4">
                      <div className="w-12 h-12 bg-taupe/10 rounded-2xl flex items-center justify-center text-taupe">
                        <Heart size={24} />
                      </div>
                      <h3 className="text-2xl">Self-Compassion</h3>
                      <p className="text-taupe/90 text-sm leading-relaxed">Oefeningen om je innerlijke criticus te verzachten en meer liefde voor jezelf te cultiveren.</p>
                      <Button onClick={() => switchInnerWorkDetail('compassion')} variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <span>Beoefen Zelfliefde</span>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  <button 
                    onClick={() => switchInnerWorkDetail(null)}
                    className="flex items-center gap-2 text-taupe/60 hover:text-taupe transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Terug naar overzicht</span>
                  </button>

                  {innerWorkDetail === 'journal' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl">Journaling Prompts</h2>
                        <p className="text-taupe/60">Kies een vraag en schrijf je gedachten op.</p>
                      </div>
                      <div className="space-y-4">
                        {(INNER_WORK_PROMPTS.journal[userProfile?.style] || INNER_WORK_PROMPTS.journal.default).map((prompt: string, i: number) => (
                          <div key={i} className="space-y-4">
                            <button 
                              onClick={() => {
                                if (selectedInnerWorkPrompt === prompt) {
                                  setSelectedInnerWorkPrompt(null);
                                  setInnerWorkResponse("");
                                } else {
                                  setSelectedInnerWorkPrompt(prompt);
                                  setInnerWorkResponse("");
                                }
                              }}
                              className={`w-full text-left p-6 rounded-3xl border transition-all flex justify-between items-center gap-4 group active:scale-[0.99] ${selectedInnerWorkPrompt === prompt ? 'bg-soft-taupe/10 border-soft-taupe shadow-inner' : 'bg-white border-black/5 shadow-sm hover:border-soft-taupe/30'}`}
                            >
                              <p className={`italic flex-1 ${selectedInnerWorkPrompt === prompt ? 'text-taupe font-medium' : 'text-taupe/80'}`}>"{prompt}"</p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${selectedInnerWorkPrompt === prompt ? 'text-soft-taupe' : 'text-taupe/70 group-hover:text-taupe'}`}>
                                  {selectedInnerWorkPrompt === prompt ? 'Gekozen' : 'Schrijf'}
                                </span>
                                <ChevronRight size={14} className={`transition-all ${selectedInnerWorkPrompt === prompt ? 'text-soft-taupe rotate-90' : 'text-taupe/40 group-hover:text-taupe'}`} />
                              </div>
                            </button>

                            {selectedInnerWorkPrompt === prompt && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                className="space-y-4 overflow-hidden"
                              >
                                <div className="relative">
                                  <textarea
                                    value={innerWorkResponse}
                                    onChange={(e) => setInnerWorkResponse(e.target.value)}
                                    placeholder="Schrijf hier je antwoord..."
                                    className="w-full h-40 p-6 bg-white rounded-[32px] border border-black/5 shadow-sm focus:ring-2 focus:ring-taupe/20 focus:border-taupe outline-none resize-none text-taupe pr-12"
                                  />
                                  <VoiceInputButton 
                                    onTranscript={(text) => setInnerWorkResponse(prev => prev + (prev ? ' ' : '') + text)} 
                                    className="absolute right-4 top-4"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <Button 
                                    onClick={() => shareWithCoach(selectedInnerWorkPrompt, innerWorkResponse)} 
                                    variant="secondary"
                                    className="flex-1 py-4"
                                    disabled={!innerWorkResponse.trim()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <MessageCircle size={20} />
                                      <span>Deel met Coach</span>
                                    </div>
                                  </Button>
                                  <Button 
                                    onClick={() => saveJournalEntry(selectedInnerWorkPrompt, innerWorkResponse, selectedInnerWorkPrompt)} 
                                    className="flex-1 py-4"
                                    disabled={!innerWorkResponse.trim()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <BookOpen size={20} />
                                      <span>Sla op</span>
                                    </div>
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {innerWorkDetail === 'shadow' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl">Shadow Work</h2>
                        <p className="text-taupe/60">Verken de delen die je liever verborgen houdt.</p>
                      </div>
                      {(() => {
                        const shadowEx = INNER_WORK_PROMPTS.shadow[userProfile?.style] || INNER_WORK_PROMPTS.shadow.default;
                        return (
                          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-6">
                            <div className="space-y-4">
                              <h4 className="font-bold text-taupe uppercase tracking-widest text-xs">Oefening: {shadowEx.title}</h4>
                              <p className="text-taupe/80 leading-relaxed">
                                {shadowEx.exercise}
                              </p>
                            </div>
                            <div className="p-4 bg-taupe/5 rounded-2xl italic text-sm text-taupe/70">
                              {shadowEx.insight}
                            </div>
                            {shadowEx.variations && (
                              <div className="space-y-3 pt-4 border-t border-black/5">
                                <p className="text-xs font-bold text-taupe/40 uppercase tracking-widest">Extra Reflecties:</p>
                                <ul className="space-y-2">
                                  {shadowEx.variations.map((v: string, i: number) => (
                                    <li key={i} className="text-sm text-taupe/60 flex gap-2">
                                      <span className="text-taupe/30">•</span>
                                      {v}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <textarea
                            value={innerWorkResponse}
                            onChange={(e) => setInnerWorkResponse(e.target.value)}
                            placeholder="Wat ontdek je over jezelf?"
                            className="w-full h-40 p-6 bg-white rounded-[32px] border border-black/5 shadow-sm focus:ring-2 focus:ring-taupe/20 focus:border-taupe outline-none resize-none text-taupe pr-12"
                          />
                          <VoiceInputButton 
                            onTranscript={(text) => setInnerWorkResponse(prev => prev + (prev ? ' ' : '') + text)} 
                            className="absolute right-4 top-4"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => shareWithCoach(`Shadow Work: ${(INNER_WORK_PROMPTS.shadow[userProfile?.style] || INNER_WORK_PROMPTS.shadow.default).title}`, innerWorkResponse)} 
                            variant="secondary"
                            className="flex-1 py-4"
                            disabled={!innerWorkResponse.trim()}
                          >
                            <div className="flex items-center gap-2">
                              <MessageCircle size={20} />
                              <span>Deel met Coach</span>
                            </div>
                          </Button>
                          <Button 
                            onClick={() => saveJournalEntry(`Shadow Work: ${(INNER_WORK_PROMPTS.shadow[userProfile?.style] || INNER_WORK_PROMPTS.shadow.default).title}`, innerWorkResponse)} 
                            className="flex-1 py-4"
                            disabled={!innerWorkResponse.trim()}
                          >
                            <div className="flex items-center gap-2">
                              <BookOpen size={20} />
                              <span>Sla op</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {innerWorkDetail === 'compassion' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl">Self-Compassion</h2>
                        <p className="text-taupe/60">Wees je eigen beste vriend.</p>
                      </div>
                      {(() => {
                        const compEx = INNER_WORK_PROMPTS.compassion[userProfile?.style] || INNER_WORK_PROMPTS.compassion.default;
                        return (
                          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-6">
                            <div className="space-y-4">
                              <h4 className="font-bold text-taupe uppercase tracking-widest text-xs">Oefening: {compEx.title}</h4>
                              <p className="text-taupe/80 leading-relaxed">
                                {compEx.exercise}
                              </p>
                            </div>
                            <div className="flex justify-center">
                              <span className="text-4xl animate-pulse">{compEx.icon}</span>
                            </div>
                            {compEx.variations && (
                              <div className="space-y-3 pt-4 border-t border-black/5">
                                <p className="text-xs font-bold text-taupe/40 uppercase tracking-widest">Extra Oefeningen:</p>
                                <ul className="space-y-2">
                                  {compEx.variations.map((v: string, i: number) => (
                                    <li key={i} className="text-sm text-taupe/60 flex gap-2">
                                      <span className="text-taupe/30">•</span>
                                      {v}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      <div className="space-y-4">
                        <div className="relative">
                          <textarea
                            value={innerWorkResponse}
                            onChange={(e) => setInnerWorkResponse(e.target.value)}
                            placeholder="Schrijf hier je reflectie..."
                            className="w-full h-40 p-6 bg-white rounded-[32px] border border-black/5 shadow-sm focus:ring-2 focus:ring-taupe/20 focus:border-taupe outline-none resize-none text-taupe pr-12"
                          />
                          <VoiceInputButton 
                            onTranscript={(text) => setInnerWorkResponse(prev => prev + (prev ? ' ' : '') + text)} 
                            className="absolute right-4 top-4"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => shareWithCoach(`Self-Compassion: ${(INNER_WORK_PROMPTS.compassion[userProfile?.style] || INNER_WORK_PROMPTS.compassion.default).title}`, innerWorkResponse)} 
                            variant="secondary"
                            className="flex-1 py-4"
                            disabled={!innerWorkResponse.trim()}
                          >
                            <div className="flex items-center gap-2">
                              <MessageCircle size={20} />
                              <span>Deel met Coach</span>
                            </div>
                          </Button>
                          <Button 
                            onClick={() => saveJournalEntry(`Self-Compassion: ${(INNER_WORK_PROMPTS.compassion[userProfile?.style] || INNER_WORK_PROMPTS.compassion.default).title}`, innerWorkResponse)} 
                            className="flex-1 py-4"
                            disabled={!innerWorkResponse.trim()}
                          >
                            <div className="flex items-center gap-2">
                              <BookOpen size={20} />
                              <span>Sla op</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === 'coach' && (
            <motion.div
              key="coach"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <div className="flex-1 space-y-4 pb-20 overflow-y-auto pt-4">
                {chatHistory.length === 0 && (
                  <div className="text-center py-12 space-y-6">
                    <div className="relative w-32 h-32 mx-auto">
                      <motion.img 
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        src="https://picsum.photos/seed/river/300/300" 
                        alt="River" 
                        className="w-full h-full object-cover rounded-full opacity-40"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-taupe shadow-sm"
                        >
                          <MessageCircle size={32} />
                        </motion.div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl">Coach Mode</h2>
                      <p className="text-taupe/80 text-sm max-w-[240px] mx-auto">Deel wat er nu speelt. Ik help je reguleren en je volgende stap te bepalen.</p>
                    </div>
                  </div>
                )}
                {chatHistory.map((msg, i) => {
                  const text = msg.parts?.[0]?.text || (msg as any).text || "";
                  if (!text && msg.role === 'user') return null;
                  
                  return (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-soft-taupe text-white rounded-tr-none' : 'bg-white text-taupe border border-black/5 rounded-tl-none shadow-sm'}`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm leading-relaxed">{text}</p>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-sm leading-relaxed markdown-body max-w-none">
                              <Markdown>{text}</Markdown>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-black/5">
                              <VoiceExerciseButton text={text} className="scale-75 origin-right opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {coachLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-black/5 shadow-sm animate-pulse">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-taupe/40 rounded-full" />
                        <div className="w-2 h-2 bg-taupe/40 rounded-full" />
                        <div className="w-2 h-2 bg-taupe/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="fixed bottom-24 left-6 right-6 flex gap-2 items-center">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isOnline ? "Wat ervaar je nu?" : "AI Coach is offline..."}
                    disabled={!isOnline}
                    className={`w-full bg-white border border-black/5 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:border-taupe/50 pr-12 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <VoiceInputButton 
                    onTranscript={(text) => setUserInput(prev => prev + (prev ? ' ' : '') + text)} 
                    className="absolute right-4"
                  />
                </div>
                  <button 
                  onClick={handleSendMessage}
                  disabled={coachLoading || !userInput.trim() || !isOnline}
                  className="bg-soft-taupe text-white p-3 rounded-full shadow-md disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4 pb-32"
            >
              <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={() => setView('inner-work')} className="p-2 -ml-2 text-taupe/60 hover:text-taupe transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-soft-taupe" />
                  <span className="text-xs font-bold uppercase tracking-widest text-taupe/60">Glimmers & Triggers</span>
                </div>
                <button 
                  onClick={() => setShowJournalInfo(!showJournalInfo)}
                  className={`p-2 rounded-full transition-colors ${showJournalInfo ? 'bg-taupe text-white' : 'text-taupe/40 hover:bg-taupe/5'}`}
                >
                  <Info size={20} />
                </button>
              </div>

              <AnimatePresence>
                {showJournalInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-taupe/5 border border-taupe/10 rounded-[32px] p-6 mb-6 space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-serif text-lg text-taupe flex items-center gap-2">
                          <Sparkles size={18} className="text-emerald-500" />
                          Wat zijn Glimmers?
                        </h4>
                        <p className="text-sm text-taupe/70 leading-relaxed">
                          Glimmers zijn de tegenhanger van triggers. Het zijn kleine momenten, signalen of ervaringen die je zenuwstelsel vertellen dat je **veilig** bent. Denk aan de zon op je gezicht, een glimlach van een vreemde, of de geur van verse koffie.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-serif text-lg text-taupe flex items-center gap-2">
                          <Zap size={18} className="text-amber-500" />
                          Wat zijn Triggers?
                        </h4>
                        <p className="text-sm text-taupe/70 leading-relaxed">
                          Triggers zijn signalen die je zenuwstelsel in een staat van **overleving** (vecht/vlucht/freeze) brengen. Het zijn vaak onbewuste herinneringen aan onveiligheid. Door ze te herkennen, kun je er met meer compassie naar kijken.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-black/5 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif">Nieuwe Inzichten</h3>
                    <p className="text-taupe/60 text-sm">Leg vast wat je zenuwstelsel kalmeert of juist activeert.</p>
                  </div>

                  <div className="flex p-1 bg-taupe/5 rounded-2xl">
                    <button 
                      onClick={() => setJournalType('glimmer')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${journalType === 'glimmer' ? 'bg-white text-taupe shadow-sm' : 'text-taupe/40'}`}
                    >
                      Glimmer ✨
                    </button>
                    <button 
                      onClick={() => setJournalType('trigger')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${journalType === 'trigger' ? 'bg-white text-taupe shadow-sm' : 'text-taupe/40'}`}
                    >
                      Trigger ⚡
                    </button>
                    <button 
                      onClick={() => setJournalType('reflection')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${journalType === 'reflection' ? 'bg-white text-taupe shadow-sm' : 'text-taupe/40'}`}
                    >
                      Reflectie 📝
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative flex items-center">
                      <input 
                        type="text"
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        placeholder={journalType === 'glimmer' ? "Wat was je glimmer?" : journalType === 'trigger' ? "Wat was je trigger?" : "Titel van je reflectie..."}
                        className="w-full px-6 py-3 bg-taupe/5 rounded-2xl border border-black/5 focus:outline-none focus:border-taupe/30 text-taupe font-serif pr-12"
                      />
                      <VoiceInputButton 
                        onTranscript={(text) => setJournalTitle(prev => prev + (prev ? ' ' : '') + text)} 
                        className="absolute right-4"
                      />
                    </div>
                    <div className="relative">
                      <textarea 
                        value={journalContent}
                        onChange={(e) => setJournalContent(e.target.value)}
                        placeholder={journalType === 'glimmer' ? "Hoe voelde dit in je lichaam? Waarom gaf het je veiligheid?" : journalType === 'trigger' ? "Wat gebeurde er? Hoe reageerde je lichaam?" : "Wat houdt je bezig?"}
                        className="w-full h-40 p-6 bg-taupe/5 rounded-[32px] border border-black/5 focus:outline-none focus:border-taupe/30 text-taupe resize-none pr-12"
                      />
                      <VoiceInputButton 
                        onTranscript={(text) => setJournalContent(prev => prev + (prev ? ' ' : '') + text)} 
                        className="absolute right-4 top-4"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        if (journalContent.trim() || journalTitle.trim()) {
                          saveJournalEntry(journalTitle || (journalType === 'glimmer' ? 'Glimmer' : journalType === 'trigger' ? 'Trigger' : 'Reflectie'), journalContent, undefined, journalType);
                          setJournalTitle('');
                          setJournalContent('');
                        }
                      }}
                      className="w-full py-4"
                    >
                      Sla op
                    </Button>
                    <p className="text-[10px] text-center text-taupe/40 italic">
                      {journalEntries.length < 3 
                        ? `Nog ${3 - journalEntries.length} inzichten te gaan om je kaart te laten analyseren door de coach.`
                        : "Je inzichten worden toegevoegd aan je persoonlijke kaart hieronder."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pl-2">
                    <h4 className="text-[10px] font-bold text-taupe/60 uppercase tracking-[0.3em]">Jouw Zenuwstelsel Kaart</h4>
                  </div>

                  {journalEntries.length >= 3 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-soft-taupe text-white p-6 rounded-[32px] shadow-lg shadow-soft-taupe/20 space-y-4 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                          <MessageCircle size={20} />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-serif text-lg">Ontdek je patronen</h5>
                          <p className="text-white/80 text-xs leading-relaxed">
                            Je hebt nu {journalEntries.length} inzichten verzameld. Stuur ze door naar de AI Coach om patronen te ontdekken en persoonlijk advies te krijgen.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={analyzeJournalWithCoach}
                        className="w-full bg-white text-soft-taupe py-4 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-colors shadow-md active:scale-[0.98]"
                      >
                        Bespreek met Coach
                      </button>
                    </motion.div>
                  )}

                  {journalEntries.length === 0 ? (
                    <div className="bg-white/40 border border-dashed border-taupe/20 p-12 rounded-[40px] text-center space-y-3">
                      <div className="w-12 h-12 bg-taupe/5 rounded-full flex items-center justify-center mx-auto text-taupe/30">
                        <Sparkles size={24} />
                      </div>
                      <p className="text-taupe/40 text-sm italic">Nog geen inzichten vastgelegd.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {journalEntries.map(entry => (
                        <motion.div 
                          key={entry.id}
                          layout
                          className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4 group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${entry.tags?.includes('glimmer') ? 'bg-emerald-400' : entry.tags?.includes('trigger') ? 'bg-amber-400' : 'bg-taupe/30'}`} />
                                <span className="text-[10px] font-bold text-soft-taupe uppercase tracking-widest">
                                  {entry.tags?.includes('glimmer') ? 'Glimmer' : entry.tags?.includes('trigger') ? 'Trigger' : 'Reflectie'} • {new Date(entry.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                                </span>
                                {entry.mood && (
                                  <span className="text-xs opacity-60">
                                    • {MOOD_OPTIONS.find(m => m.id === entry.mood)?.icon}
                                  </span>
                                )}
                              </div>
                              <h5 className="font-serif text-xl text-taupe">{entry.title}</h5>
                            </div>
                            <button 
                              onClick={() => deleteJournalEntry(entry.id)}
                              className="p-2 text-taupe/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-taupe/80 leading-relaxed whitespace-pre-wrap">
                            {entry.content}
                          </p>
                          <div className="flex justify-end pt-2">
                            <VoiceExerciseButton text={entry.content} className="scale-75 origin-right opacity-70 hover:opacity-100 transition-opacity" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-8 pb-32"
            >
              <div className="text-center space-y-6">
                <div className="relative w-full h-32 rounded-[40px] overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/path/600/200" 
                    alt="Path" 
                    className="w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-champagne to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-taupe shadow-sm">
                      <Activity size={32} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl">Dagelijkse Tracker</h2>
                  <p className="text-taupe/90 text-sm">Hoe staat je zenuwstelsel er vandaag voor?</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-8">
                {/* Stress Level */}
                <div className="space-y-4">
                  <h4 className="font-medium flex justify-between items-center">
                    Stressniveau
                    <span className="text-taupe font-bold">{trackerStress !== null ? trackerStress : '-'}</span>
                  </h4>
                  <div className="flex justify-between gap-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                      const getStressColor = (val: number) => {
                        if (val <= 3) return 'bg-sage border-sage text-taupe';
                        if (val <= 7) return 'bg-peach border-peach text-taupe';
                        return 'bg-sky border-sky text-taupe';
                      };
                      return (
                        <button 
                          key={n} 
                          onClick={() => setTrackerStress(n)}
                          className={`flex-1 h-10 rounded-lg border transition-all text-xs font-bold ${trackerStress === n ? getStressColor(n) + ' shadow-md' : 'border-black/5 text-taupe/40 hover:bg-taupe/5'}`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mood Selection */}
                <div className="space-y-4">
                  <h4 className="font-medium">Hoe voel je je?</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {MOOD_OPTIONS.map(opt => {
                      const getMoodColor = (id: string) => {
                        if (['happy', 'calm', 'inspired'].includes(id)) return 'bg-sage/20 border-sage text-taupe';
                        if (['overwhelmed', 'anxious', 'angry'].includes(id)) return 'bg-peach/20 border-peach text-taupe';
                        if (['tired', 'sad', 'bored'].includes(id)) return 'bg-sky/20 border-sky text-taupe';
                        return 'bg-soft-taupe/10 border-soft-taupe text-soft-taupe';
                      };
                      return (
                        <button 
                          key={opt.id} 
                          onClick={() => setTrackerMood(opt.id)}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 relative group ${trackerMood === opt.id ? getMoodColor(opt.id) : 'border-black/5 text-taupe/60 hover:bg-black/[0.02]'}`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                          {trackerMood !== opt.id && (
                            <span className="absolute top-1 right-2 text-[6px] font-bold uppercase tracking-tighter text-taupe/70 opacity-0 group-hover:opacity-100 transition-opacity">Kies</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sleep Quality */}
                <div className="space-y-4">
                  <h4 className="font-medium">Hoe heb je geslapen?</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {SLEEP_OPTIONS.map(opt => {
                      const getSleepColor = (id: string) => {
                        if (id === 'good') return 'bg-sage/20 border-sage text-taupe';
                        if (id === 'fair') return 'bg-peach/20 border-peach text-taupe';
                        if (id === 'poor') return 'bg-sky/20 border-sky text-taupe';
                        return 'bg-soft-taupe/10 border-soft-taupe text-soft-taupe';
                      };
                      return (
                        <button 
                          key={opt.id} 
                          onClick={() => setTrackerSleep(opt.id)}
                          className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${trackerSleep === opt.id ? getSleepColor(opt.id) : 'border-black/5 text-taupe/60 hover:bg-black/[0.02]'}`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <span className="text-sm font-medium">{opt.label}</span>
                          {trackerSleep === opt.id && <CheckCircle2 size={16} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button 
                  disabled={trackerStress === null || !trackerSleep || !trackerMood}
                  onClick={calculateTrackerAdvice} 
                  variant="ventral"
                  className="w-full py-4"
                >
                  Opslaan & Advies Ontvangen
                </Button>
              </div>
              
              <AnimatePresence>
                {trackerAdvice && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-sage text-taupe rounded-[40px] shadow-xl shadow-sage/20 space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-20 rotate-12">
                      <Sparkles size={100} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Jouw Advies</div>
                        <VoiceExerciseButton text={`${trackerAdvice.title}. ${trackerAdvice.content}`} className="scale-75 origin-right opacity-80 hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="font-serif text-2xl mb-3">{trackerAdvice.title}</h4>
                      <p className="text-sm leading-relaxed text-taupe/90 mb-6">{trackerAdvice.content}</p>
                      
                      {trackerAdvice.exercises && trackerAdvice.exercises.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Aanbevolen oefeningen:</p>
                          <div className="grid grid-cols-1 gap-3">
                            {trackerAdvice.exercises.map(id => {
                              const card = REGULATION_CARDS.find(c => c.id === id);
                              if (!card) return null;
                              return (
                                <div 
                                  key={id}
                                  className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/20 transition-colors"
                                  onClick={() => {
                                    const card = REGULATION_CARDS.find(c => c.id === id);
                                    if (card && !currentCardSelection.find(c => c.id === id)) {
                                      setCurrentCardSelection([card, ...currentCardSelection.slice(0, 4)]);
                                    }
                                    setSelectedCard(id);
                                    setView('cards');
                                  }}
                                >
                                  <div>
                                    <h5 className="font-medium text-sm">{card.title}</h5>
                                    <p className="text-[10px] opacity-60">{card.duration}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <VoiceExerciseButton 
                                      text={`${card.title}. ${card.exercise}`} 
                                      className="bg-white/10 text-white hover:bg-white/20" 
                                    />
                                    <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-white/10">
                        <Button 
                          onClick={shareTrackerWithCoach}
                          className="w-full bg-taupe text-white shadow-lg border-none hover:bg-deep-taupe"
                        >
                          <MessageCircle size={18} />
                          <span className="font-bold">Deel met Coach voor advies</span>
                        </Button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setTrackerAdvice(null)}
                      className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!trackerAdvice && (
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(74,68,63,0)", "0 0 20px rgba(74,68,63,0.05)", "0 0 0px rgba(74,68,63,0)"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="p-6 bg-taupe/5 rounded-3xl border border-taupe/10 relative group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-lg">Inzicht van vandaag</h4>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('regulated_daily_insight');
                        setDailyInsight(null);
                      }}
                      className="p-1 text-taupe/30 hover:text-taupe/60 transition-colors opacity-0 group-hover:opacity-100"
                      title="Nieuw inzicht genereren"
                    >
                      <Sparkles size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-taupe/70 italic">
                    {dailyInsight ? `"${dailyInsight.text}"` : '"Vandaag is een nieuwe kans om te luisteren naar wat je lichaam je vertelt."'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-4 pb-32"
            >
              {userProfile ? (
                <>
                  <div className="text-center space-y-6">
                    <div className="relative w-full h-48 rounded-[40px] overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/profile/800/400" 
                        alt="Profile" 
                        className="w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-champagne via-champagne/20 to-transparent" />
                      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-taupe shadow-xl mb-3">
                          <Activity size={40} />
                        </div>
                        <div className="bg-white/80 backdrop-blur-md px-4 py-1 rounded-full border border-white/40 shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe">Jouw Archetype</span>
                        </div>
                        <h2 className="text-4xl font-serif mt-2">{userProfile.who || 'De Ontdekker'}</h2>
                      </div>
                    </div>
                    <p className="text-taupe/50 text-xs">Gemaakt op {userProfile.date}</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-8 pt-12">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-taupe shadow-xl mx-auto mb-6">
                    <Activity size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif">Instellingen</h2>
                    <p className="text-taupe/60">Je hebt nog geen profiel aangemaakt.</p>
                  </div>
                  <Button onClick={startAssessment} className="w-full py-4">
                    Start de Systeem Check
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-taupe/40 px-2">Systeem Check</h3>
                <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-soft-taupe/10 rounded-xl flex items-center justify-center text-soft-taupe">
                        <Volume2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Geluid Test</p>
                        <p className="text-[10px] text-taupe/40 uppercase tracking-widest font-bold">Test of voorlezen werkt</p>
                      </div>
                    </div>
                    <VoiceExerciseButton text="Dit is een test van het geluidssysteem. Als je dit hoort, werkt het voorlezen correct." className="scale-90" />
                  </div>
                </div>
              </div>

              {userProfile && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-taupe/40 px-2">Aanbevolen Oefeningen</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {(userProfile.suggestedCardIds || []).map((id: string) => {
                        const card = REGULATION_CARDS.find(c => c.id === id);
                        if (!card) return null;
                        return (
                          <div 
                            key={id}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (!currentCardSelection.find(c => c.id === id)) {
                                  setCurrentCardSelection([card, ...currentCardSelection.slice(0, 4)]);
                                }
                                setSelectedCard(id);
                                setView('cards');
                              }
                            }}
                            onClick={() => {
                              if (!currentCardSelection.find(c => c.id === id)) {
                                setCurrentCardSelection([card, ...currentCardSelection.slice(0, 4)]);
                              }
                              setSelectedCard(id);
                              setView('cards');
                            }}
                            className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4 text-left hover:border-taupe/50 transition-all group cursor-pointer"
                          >
                            <div className="w-12 h-12 bg-soft-taupe/5 rounded-xl flex items-center justify-center text-soft-taupe group-hover:bg-soft-taupe/10 transition-colors">
                              <Activity size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{card.title}</h4>
                              <p className="text-[10px] text-taupe/40 uppercase tracking-widest font-bold">{card.duration} • {card.category}</p>
                            </div>
                            <ChevronRight size={16} className="text-taupe/20 group-hover:text-taupe transition-colors" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles size={80} />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <h3 className="text-xl flex items-center gap-2">
                        <Sparkles className="text-taupe" size={20} />
                        Start Hier Advies
                      </h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                      {userProfile.advice.map((step: string, i: number) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-8 h-8 bg-soft-taupe/10 text-soft-taupe rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                          <p className="text-sm leading-relaxed text-taupe/90">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-taupe/40 px-2">Instellingen</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setView('reminders')}
                    className="w-full p-5 bg-white rounded-2xl border border-black/5 text-left hover:border-taupe/50 transition-all shadow-sm flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-soft-taupe/10 rounded-full flex items-center justify-center text-soft-taupe">
                        <Bell size={20} />
                      </div>
                      <div>
                        <span className="font-medium block">Herinneringen</span>
                        <span className="text-xs text-taupe/40">Beheer je dagelijkse check-ins</span>
                      </div>
                    </div>
                    <ChevronRight className="text-taupe/20 group-hover:text-taupe transition-colors" size={20} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showSavedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-charcoal text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl z-50 flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    Gegevens opgeslagen
                  </motion.div>
                )}

                {reminderNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    className="fixed top-6 left-6 right-6 bg-soft-taupe text-white p-6 rounded-[32px] shadow-2xl z-[100] flex items-center gap-4 border border-white/20"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell size={24} className="animate-bounce" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Herinnering</div>
                      <h4 className="font-serif text-lg leading-tight">{reminderNotification.label}</h4>
                      <p className="text-xs opacity-80 mt-1">Tijd voor een kort moment van regulatie.</p>
                    </div>
                    <button onClick={() => setReminderNotification(null)} className="p-2 hover:bg-white/10 rounded-full">
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-12 space-y-6">
                <div className="flex flex-col gap-3">
                  <Button onClick={() => setView('home')} className="w-full py-4">
                    Terug naar Dashboard
                  </Button>
                  
                  {userProfile && (
                    <button 
                      onClick={startAssessment}
                      className="w-full py-4 bg-white border border-black/5 rounded-2xl text-xs font-bold text-taupe uppercase tracking-widest hover:bg-taupe/5 transition-colors shadow-sm"
                    >
                      De Systeem Check Opnieuw Doen
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-black/5">
                  <button 
                    onClick={() => {
                      if (confirm('Weet je zeker dat je alle gegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }} 
                    className="w-full py-3 text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Reset alle gegevens & Wis profiel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pt-4"
            >
              <div className="relative w-full h-32 rounded-3xl overflow-hidden mb-4">
                <motion.img 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  src="https://picsum.photos/seed/reset/600/200" 
                  alt="Reset" 
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-champagne" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-xs font-bold text-taupe uppercase tracking-widest">Stap {resetStep + 1} van {RESET_QUESTIONS.length}</span>
                </div>
              </div>
              
              <div className="space-y-2 flex items-center justify-between">
                <h2 className="text-2xl">{RESET_QUESTIONS[resetStep].question}</h2>
                <VoiceExerciseButton text={RESET_QUESTIONS[resetStep].question} />
              </div>
              <div className="space-y-4">
                {RESET_QUESTIONS[resetStep].options.map((opt: any, i) => (
                  <button
                    key={i}
                    onClick={() => handleResetAnswer(opt.state)}
                    className="w-full p-6 bg-white rounded-2xl border border-black/5 text-left hover:border-taupe/50 transition-all shadow-sm flex items-center gap-4 group active:scale-[0.99]"
                  >
                    <div className="w-12 h-12 bg-taupe/5 rounded-xl flex items-center justify-center text-2xl group-hover:bg-taupe/10 transition-colors">
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-lg block">{opt.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/70 group-hover:text-taupe transition-colors">Kies</span>
                      <ChevronRight className="text-taupe/40 group-hover:text-taupe transition-colors" size={20} />
                    </div>
                  </button>
                ))}
              </div>

              {resetStep > 0 && (
                <button
                  onClick={() => setResetStep(resetStep - 1)}
                  className="w-full py-3 text-taupe/60 text-xs font-bold uppercase tracking-widest hover:text-taupe transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} />
                  Vorige stap
                </button>
              )}
            </motion.div>
          )}

          {view === 'reset-results' && (
            <motion.div
              key="reset-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 pt-8 pb-32"
            >
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-deep-taupe/10 rounded-full mx-auto flex items-center justify-center text-deep-taupe">
                  <CheckCircle2 size={32} />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl">Jouw Reset Plan</h2>
                  <VoiceExerciseButton text="Jouw Reset Plan. Dit is wat je nu kunt doen om te reguleren." />
                </div>
                <p className="text-taupe/50 text-sm">Dit is wat je nu kunt doen om te reguleren.</p>
              </div>

              {resetProfile && (
                <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-taupe/10 rounded-full flex items-center justify-center text-taupe">
                        <Activity size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/40 block">Je bent nu</span>
                        <h3 className="font-serif text-xl">{resetProfile.who}</h3>
                      </div>
                    </div>
                    <VoiceExerciseButton text={`Je bent nu ${resetProfile.who}. Waarom gebeurt dit? ${resetProfile.why}. Wat moet er gebeuren? ${resetProfile.what}`} />
                  </div>
                  <div className="pt-4 border-t border-black/5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-taupe/40 mb-2">Waarom gebeurt dit?</h3>
                    <p className="text-sm leading-relaxed text-taupe/80">{resetProfile.why}</p>
                  </div>
                  <div className="pt-4 border-t border-black/5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-taupe/40 mb-2">Wat moet er gebeuren?</h3>
                    <p className="text-sm leading-relaxed text-taupe/80">{resetProfile.what}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {resetAdvice.map((card, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden group"
                  >
                    <div className="h-48 overflow-hidden">
                      <ExerciseIllustration type={card.category} id={card.id} />
                    </div>
                    <div className="p-8 relative">
                      <div className="absolute -top-5 left-6">
                        <div className="w-10 h-10 bg-white text-deep-taupe rounded-full flex items-center justify-center text-lg font-bold shadow-lg border border-deep-taupe/10">
                          {i + 1}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-serif text-taupe/90">{card.title}</h3>
                            <VoiceExerciseButton text={`${card.title}. ${card.exercise}`} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/40">{card.duration}</span>
                        </div>
                        
                        <div>
                          <h4 className="text-[10px] font-bold uppercase text-taupe/40 mb-2 tracking-widest">Stap voor stap</h4>
                          <div className="space-y-2">
                            {card.exercise.split('\n').map((step, idx) => (
                              <p key={idx} className="text-sm leading-relaxed text-taupe/80">
                                {step}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-black/5">
                          <h4 className="text-[10px] font-bold uppercase text-taupe/40 mb-1 tracking-widest">Waarom dit werkt</h4>
                          <p className="text-xs text-taupe/60 italic leading-relaxed">{card.effect}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onClick={() => setView('home')} className="w-full mt-8">Klaar voor nu</Button>
            </motion.div>
          )}

          {view === 'reminders' && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-4 pb-32"
            >
              <div className="text-center space-y-6">
                <div className="relative w-full h-32 rounded-[40px] overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/bell/600/200" 
                    alt="Bell" 
                    className="w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-champagne to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-taupe shadow-sm">
                      <Bell size={32} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl">Herinneringen</h2>
                  <p className="text-taupe/50 text-sm">Stel momenten in voor je innerlijk werk.</p>
                </div>
              </div>

              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${reminder.isActive ? 'bg-soft-taupe/10 text-soft-taupe' : 'bg-black/5 text-taupe/20'}`}>
                        <Clock size={24} />
                      </div>
                      <div>
                        <div className="relative flex items-center">
                          <input 
                            type="text"
                            value={reminder.label}
                            onChange={(e) => {
                              setReminders(reminders.map(r => r.id === reminder.id ? { ...r, label: e.target.value } : r));
                            }}
                            className={`font-medium bg-transparent border-none focus:ring-0 p-0 w-full pr-8 ${!reminder.isActive && 'text-taupe/40'}`}
                          />
                          <VoiceInputButton 
                            onTranscript={(text) => {
                              setReminders(reminders.map(r => r.id === reminder.id ? { ...r, label: r.label + (r.label ? ' ' : '') + text } : r));
                            }} 
                            className="absolute right-0 scale-75"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="time"
                            value={reminder.time}
                            onChange={(e) => {
                              setReminders(reminders.map(r => r.id === reminder.id ? { ...r, time: e.target.value } : r));
                            }}
                            className={`text-lg font-serif bg-transparent border-none focus:ring-0 p-0 ${!reminder.isActive && 'text-taupe/40'}`}
                          />
                          <span className="text-[10px] text-taupe/30 uppercase tracking-widest font-bold">
                            {reminder.days.length === 7 ? 'Dagelijks' : reminder.days.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setReminders(reminders.map(r => r.id === reminder.id ? { ...r, isActive: !r.isActive } : r));
                        }}
                        className={`w-12 h-6 rounded-full relative transition-colors ${reminder.isActive ? 'bg-soft-taupe' : 'bg-taupe/20'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${reminder.isActive ? 'right-1' : 'left-1'}`} />
                      </button>
                      <button 
                        onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}
                        className="p-2 text-taupe/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => {
                    const newId = Math.random().toString(36).substr(2, 9);
                    setReminders([...reminders, { id: newId, time: '12:00', label: 'Nieuwe Herinnering', days: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'], isActive: true }]);
                  }}
                  className="w-full p-6 border-2 border-dashed border-soft-taupe/20 rounded-[32px] flex items-center justify-center gap-2 text-soft-taupe hover:bg-soft-taupe/5 transition-colors"
                >
                  <Plus size={20} />
                  <span className="font-medium">Voeg herinnering toe</span>
                </button>
              </div>
            </motion.div>
          )}

          {view === 'somatic' && (
            <motion.div
              key="somatic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-8 pb-32"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setView('home')} className="p-2 -ml-2 text-taupe/60 hover:text-taupe transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-serif">Somatic Toolbox</h2>
                <div className="w-10" />
              </div>

              <div className="bg-taupe/5 p-6 rounded-[32px] border border-taupe/10 space-y-3">
                <div className="flex items-center gap-3 text-taupe">
                  <Sparkles size={20} />
                  <h3 className="font-bold">Bottom-Up Regulatie</h3>
                </div>
                <p className="text-sm text-taupe/70 leading-relaxed">
                  Wanneer je brein te druk is om te kalmeren, gebruik je je lichaam. Deze oefeningen sturen een direct signaal van veiligheid naar je zenuwstelsel.
                </p>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${(() => {
                  switch (currentSomaticState) {
                    case 'fight':
                    case 'flight': return 'bg-peach/20 border-peach/30';
                    case 'freeze':
                    case 'fawn': return 'bg-sky/20 border-sky/30';
                    case 'all': return 'bg-sage/20 border-sage/30';
                    default: return 'bg-soft-taupe/10 border-soft-taupe/20';
                  }
                })()} p-6 rounded-[32px] border space-y-2 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Info size={48} />
                </div>
                <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${(() => {
                  switch (currentSomaticState) {
                    case 'fight':
                    case 'flight': return 'text-orange-900';
                    case 'freeze':
                    case 'fawn': return 'text-sky-900';
                    case 'all': return 'text-emerald-900';
                    default: return 'text-soft-taupe';
                  }
                })()}`}>{somaticWisdom.title}</h4>
                <p className="text-sm text-taupe/80 leading-relaxed italic">
                  {somaticWisdom.text}
                </p>
              </motion.div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-taupe/40">Oefeningen voor jou</h3>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-soft-taupe bg-soft-taupe/10 px-2 py-1 rounded-full">
                    Focus: {currentSomaticState.toUpperCase()}
                  </span>
                </div>
                {filteredSomaticExercises.map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    layout
                    className={`bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden transition-all ${activeSomaticId === exercise.id ? 'ring-2 ring-soft-taupe/20' : ''}`}
                  >
                    <div 
                      onClick={() => setActiveSomaticId(activeSomaticId === exercise.id ? null : exercise.id)}
                      className="p-6 flex items-center gap-4 cursor-pointer"
                    >
                      <div className={`w-12 h-12 ${(() => {
                        switch (exercise.state) {
                          case 'fight':
                          case 'flight': return 'bg-peach/40';
                          case 'freeze':
                          case 'fawn': return 'bg-sky/40';
                          case 'all': return 'bg-sage/40';
                          default: return 'bg-taupe/5';
                        }
                      })()} rounded-2xl flex items-center justify-center text-2xl`}>
                        {exercise.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-taupe">{exercise.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/40 flex items-center gap-1">
                            <Clock size={10} />
                            {exercise.duration}
                          </span>
                          <span className={`text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-full ${
                            exercise.state === 'fight' ? 'bg-amber-100 text-amber-800' :
                            exercise.state === 'flight' ? 'bg-orange-100 text-orange-800' :
                            exercise.state === 'freeze' ? 'bg-blue-100 text-blue-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {exercise.state === 'all' ? 'Alle staten' : exercise.state.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight 
                        size={20} 
                        className={`text-taupe/20 transition-transform duration-300 ${activeSomaticId === exercise.id ? 'rotate-90' : ''}`} 
                      />
                    </div>

                    <AnimatePresence>
                      {activeSomaticId === exercise.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 space-y-6 border-t border-black/5 pt-6 bg-black/[0.01]"
                        >
                          <div className="space-y-2">
                            <p className="text-sm text-taupe/80 leading-relaxed italic">
                              "{exercise.description}"
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/40">Instructies</h5>
                              <VoiceExerciseButton text={`${exercise.title}. ${exercise.description}. ${exercise.instructions.join('. ')}`} />
                            </div>
                            <div className="space-y-3">
                              {exercise.instructions.map((step, i) => (
                                <div key={i} className="flex gap-3">
                                  <span className="w-5 h-5 bg-taupe/10 rounded-full flex items-center justify-center text-[10px] font-bold text-taupe shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <p className="text-sm text-taupe/90 leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 bg-soft-taupe/5 rounded-2xl border border-soft-taupe/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-soft-taupe mb-1">Waarom dit werkt</p>
                            <p className="text-xs text-taupe/70">{exercise.benefit}</p>
                          </div>

                          <Button 
                            onClick={() => setActiveSomaticId(null)}
                            className="w-full py-3 text-sm"
                            variant="secondary"
                          >
                            Oefening voltooid
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 text-center">
                <p className="text-xs text-taupe/40 italic">
                  Luister naar je lichaam. Als een oefening onveilig voelt, stop dan en kies een andere.
                </p>
              </div>
            </motion.div>
          )}

          {view === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10 pt-8 pb-32"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-soft-taupe text-white rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <Info size={32} />
                </div>
                <h2 className="text-3xl font-serif">App Handleiding</h2>
                <p className="text-taupe/70 italic">Haal het maximale uit de Regulated Identity Code™</p>
              </div>

              <div className="space-y-6">
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4">
                  <div className="flex items-center gap-3 text-taupe">
                    <div className="p-2 bg-sage/20 rounded-xl"><Activity size={20} /></div>
                    <h3 className="font-bold">Stap 1: De Intake</h3>
                  </div>
                  <p className="text-sm text-taupe/80 leading-relaxed">
                    Begin altijd met de <strong>Zenuwstelsel-check</strong> op de voorpagina. Dit helpt de app te begrijpen of je momenteel in een 'Vecht', 'Vlucht', 'Bevries' of 'Fawn' staat bent. Op basis hiervan krijg je gepersonaliseerd advies.
                  </p>
                </section>

                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4">
                  <div className="flex items-center gap-3 text-taupe">
                    <div className="p-2 bg-peach/20 rounded-xl"><Layout size={20} /></div>
                    <h3 className="font-bold">Stap 2: Directe Regulatie</h3>
                  </div>
                  <p className="text-sm text-taupe/80 leading-relaxed">
                    Heb je nu hulp nodig? Gebruik de <strong>Regulatie Kaarten</strong> voor snelle oefeningen (30-120 sec) of de <strong>Somatic Toolbox</strong> voor diepere fysieke ontspanning. Kies de categorie die past bij hoe je je voelt.
                  </p>
                </section>

                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4">
                  <div className="flex items-center gap-3 text-taupe">
                    <div className="p-2 bg-sky/20 rounded-xl"><MessageCircle size={20} /></div>
                    <h3 className="font-bold">Stap 3: De AI Coach</h3>
                  </div>
                  <p className="text-sm text-taupe/80 leading-relaxed">
                    De <strong>AI Coach</strong> is er voor reflectie. Je kunt chatten over je gevoelens, of je voortgang uit de tracker en oefeningen delen voor diepere inzichten. De coach begrijpt jouw zenuwstelsel-profiel.
                  </p>
                </section>

                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4">
                  <div className="flex items-center gap-3 text-taupe">
                    <div className="p-2 bg-sage/20 rounded-xl"><BookOpen size={20} /></div>
                    <h3 className="font-bold">Stap 4: Inner Work</h3>
                  </div>
                  <p className="text-sm text-taupe/80 leading-relaxed">
                    Voor langdurige groei gebruik je <strong>Inner Work</strong>. Hier vind je journal-prompts, schaduwwerk en compassie-oefeningen die specifiek zijn afgestemd op jouw overlevingsmechanismen.
                  </p>
                </section>

                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4">
                  <div className="flex items-center gap-3 text-taupe">
                    <div className="p-2 bg-taupe/10 rounded-xl"><Clock size={20} /></div>
                    <h3 className="font-bold">Dagelijkse Routine</h3>
                  </div>
                  <p className="text-sm text-taupe/80 leading-relaxed">
                    Gebruik de <strong>Dagelijkse Tracker</strong> om je patronen te herkennen. Stel <strong>Reminders</strong> in voor korte check-ins gedurende de dag om te voorkomen dat je ongemerkt in een overlevingsstand schiet.
                  </p>
                </section>
              </div>

              <Button onClick={() => setView('home')} className="w-full">Begrepen, aan de slag</Button>
            </motion.div>
          )}

          {view === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 pt-8 pb-32"
            >
              <div className="text-center space-y-6">
                <div className="relative w-full h-40 rounded-[40px] overflow-hidden">
                  <motion.img 
                    animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    src="https://picsum.photos/seed/mountain/600/300" 
                    alt="Mountain" 
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-champagne to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-taupe shadow-sm"
                    >
                      <BookOpen size={32} />
                    </motion.div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl">Zenuwstelsel Guide</h2>
                  <p className="text-taupe/80 italic">Jouw handleiding voor innerlijke veiligheid.</p>
                </div>
              </div>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl">Wat is het zenuwstelsel?</h3>
                  <div className="h-1 w-12 bg-taupe rounded-full" />
                </div>
                <p className="text-taupe/80 leading-relaxed">
                  Het zenuwstelsel is de "commandocentrale" van je lichaam. Het is een complex netwerk dat constant informatie verwerkt uit je omgeving en je lichaam. Het bepaalt hoe je reageert op stress, hoe je je voelt en hoe je de wereld ervaart.
                </p>
                <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-taupe/10 rounded-lg text-taupe"><Activity size={20} /></div>
                    <div>
                      <h4 className="font-bold">Wat het doet</h4>
                      <p className="text-sm text-taupe/70">Het reguleert je hartslag, ademhaling, spijsvertering en je emotionele reacties, vaak zonder dat je het doorhebt.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-taupe/10 rounded-lg text-taupe"><Heart size={20} /></div>
                    <div>
                      <h4 className="font-bold">Waarom het belangrijk is</h4>
                      <p className="text-sm text-taupe/70">Een gereguleerd zenuwstelsel betekent dat je veerkrachtig bent. Je kunt stress aan zonder "vast te lopen" in angst of verdoving.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl">Wat zijn somatische oefeningen?</h3>
                  <div className="h-1 w-12 bg-taupe rounded-full" />
                </div>
                <div className="space-y-4">
                  <p className="text-taupe/80 leading-relaxed">
                    Somatische oefeningen zijn fysieke technieken die je helpen om direct contact te maken met je zenuwstelsel. In plaats van te <em>denken</em> over rust, gebruik je je lichaam om rust te <em>creëren</em>.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 bg-white rounded-3xl border border-black/5 shadow-sm space-y-2">
                      <div className="flex items-center gap-2 text-soft-taupe mb-1">
                        <ArrowRight size={16} className="rotate-[-45deg]" />
                        <h4 className="font-bold text-xs uppercase tracking-widest">Top-Down</h4>
                      </div>
                      <p className="text-xs text-taupe/70">Traditionele methoden (zoals praten of affirmaties) werken vanuit je gedachten naar je lichaam. Dit noemen we 'Top-Down'.</p>
                    </div>
                    <div className="p-5 bg-white rounded-3xl border border-black/5 shadow-sm space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <ArrowRight size={16} className="rotate-[45deg]" />
                        <h4 className="font-bold text-xs uppercase tracking-widest">Bottom-Up</h4>
                      </div>
                      <p className="text-xs text-taupe/70">Somatische oefeningen zijn 'Bottom-Up': je gebruikt fysieke sensaties om je brein te vertellen dat je veilig bent. Dit is vaak sneller en effectiever bij acute stress of overweldiging.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl">De Drie Hoofdstaten</h3>
                  <p className="text-sm text-taupe/50 uppercase tracking-widest font-bold">Polyvagaal Theorie in het kort</p>
                </div>
                
                <div className="space-y-4">
                  {GUIDE_TRIGGERS.map((stateInfo) => (
                    <motion.div
                      key={stateInfo.state}
                      layout
                      onClick={() => setActiveGuideState(activeGuideState === stateInfo.state ? null : stateInfo.state)}
                      className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                        stateInfo.state === 'safe' ? 'bg-emerald-50 border-emerald-100' :
                        stateInfo.state === 'fight' ? 'bg-amber-50 border-amber-100' :
                        'bg-blue-50 border-blue-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className={`font-bold ${
                          stateInfo.state === 'safe' ? 'text-emerald-800' :
                          stateInfo.state === 'fight' ? 'text-amber-800' :
                          'text-blue-800'
                        }`}>{stateInfo.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold uppercase tracking-widest ${
                            stateInfo.state === 'safe' ? 'text-emerald-800/80' :
                            stateInfo.state === 'fight' ? 'text-amber-800/80' :
                            'text-blue-800/80'
                          }`}>
                            {activeGuideState === stateInfo.state ? 'Minder' : 'Meer info'}
                          </span>
                          <ChevronRight 
                            size={14} 
                            className={`transition-transform duration-300 ${activeGuideState === stateInfo.state ? 'rotate-90' : ''} ${
                              stateInfo.state === 'safe' ? 'text-emerald-600/40' :
                              stateInfo.state === 'fight' ? 'text-amber-600/40' :
                              'text-blue-600/40'
                            }`} 
                          />
                        </div>
                      </div>
                      <p className={`text-sm mt-2 ${
                        stateInfo.state === 'safe' ? 'text-emerald-700/80' :
                        stateInfo.state === 'fight' ? 'text-amber-700/80' :
                        'text-blue-700/80'
                      }`}>{stateInfo.description}</p>
                      
                      <AnimatePresence>
                        {activeGuideState === stateInfo.state && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-black/5 space-y-4">
                              <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Triggers</p>
                                <div className="flex flex-wrap gap-2">
                                  {stateInfo.triggers.map((t, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/50 rounded-lg text-xs">{t}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Antigif</p>
                                <p className="text-sm font-medium">{stateInfo.antidote}</p>
                              </div>
                              <div className="p-4 bg-white/40 rounded-2xl border border-white/60 flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Probeer dit:</p>
                                  <p className="text-sm italic">{stateInfo.exercise}</p>
                                </div>
                                <VoiceExerciseButton text={stateInfo.exercise} className="ml-4" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl">Feit of Fabel?</h3>
                  <div className="h-1 w-12 bg-taupe rounded-full" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {GUIDE_MYTHS.map((myth, i) => (
                    <motion.div
                      key={i}
                      onClick={() => setRevealedMyths(prev => prev.includes(i) ? prev.filter(id => id !== i) : [...prev, i])}
                      className="relative h-40 cursor-pointer perspective-1000"
                    >
                      <motion.div
                        animate={{ rotateY: revealedMyths.includes(i) ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        className="w-full h-full relative preserve-3d"
                      >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                          <span className="text-2xl">{myth.icon}</span>
                          <p className="font-medium text-taupe">{myth.myth}</p>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-taupe/40">Tik om te onthullen</span>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden bg-taupe p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-2 rotate-y-180">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50">De Feiten</p>
                          <p className="text-sm text-white leading-relaxed">{myth.fact}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl">Window of Tolerance</h3>
                  <div className="h-1 w-12 bg-taupe rounded-full" />
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-6 text-center group hover:border-taupe/30 transition-all">
                  <div className="relative h-32 bg-gradient-to-b from-amber-100 via-emerald-100 to-blue-100 rounded-2xl overflow-hidden">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-white/40 border-y border-white/60 flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Jouw Window</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-taupe/70 leading-relaxed">
                      De 'Window of Tolerance' is de zone waarin je stress kunt hanteren zonder overweldigd te raken. Binnen deze window kun je helder denken en voelen.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-taupe/30 group-hover:text-taupe/60 transition-colors">
                      <Info size={12} />
                      <span>The Regulated Identity Code™</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl">De Nervus Vagus</h3>
                  <div className="h-1 w-12 bg-taupe rounded-full" />
                </div>
                <div className="space-y-4">
                  <p className="text-taupe/80 leading-relaxed">
                    De Nervus Vagus is de "snelweg" van informatie tussen je hersenen en je organen. Het is de belangrijkste speler in je parasympathische zenuwstelsel (de 'rust en herstel' modus).
                  </p>
                  <div className="p-4 bg-taupe/5 rounded-2xl border border-black/5 flex items-center gap-3 group hover:bg-taupe/10 transition-all cursor-help">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-taupe shadow-sm">
                      <Info size={16} />
                    </div>
                    <p className="text-xs text-taupe/60 italic">Je kunt de Nervus Vagus trainen als een spier voor meer veerkracht.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {VAGUS_EXERCISES.map((ex, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-3 group hover:border-taupe/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-taupe/30">Oefening</span>
                          <h4 className="font-bold text-taupe">{ex.title}</h4>
                        </div>
                        <span className="text-[10px] bg-taupe/10 text-taupe px-2 py-1 rounded-full font-bold">{ex.duration}</span>
                      </div>
                      <p className="text-sm text-taupe/70 leading-relaxed">{ex.description}</p>
                      <div className="flex justify-end pt-2">
                        <VoiceExerciseButton text={`${ex.title}. ${ex.description}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-8">
                <Button onClick={() => setView('home')} className="w-full py-4">Ik begrijp het</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-black/5 px-6 py-4 flex justify-between items-center z-20">
        <button onClick={() => setView('home')} className={`p-2 rounded-xl transition-colors ${view === 'home' ? 'text-soft-taupe bg-soft-taupe/10' : 'text-taupe/40'}`}>
          <Heart size={24} />
        </button>
        <button onClick={() => setView('cards')} className={`p-2 rounded-xl transition-colors ${view === 'cards' ? 'text-soft-taupe bg-soft-taupe/10' : 'text-taupe/40'}`}>
          <Layout size={24} />
        </button>
        <button onClick={() => { setView('inner-work'); switchInnerWorkDetail(null); }} className={`p-2 rounded-xl transition-colors ${view === 'inner-work' ? 'text-soft-taupe bg-soft-taupe/10' : 'text-taupe/40'}`}>
          <BookOpen size={24} />
        </button>
        <button onClick={() => setView('coach')} className={`p-2 rounded-xl transition-colors ${view === 'coach' ? 'text-soft-taupe bg-soft-taupe/10' : 'text-taupe/40'}`}>
          <MessageCircle size={24} />
        </button>
        <button onClick={() => setView('tracker')} className={`p-2 rounded-xl transition-colors ${view === 'tracker' ? 'text-soft-taupe bg-soft-taupe/10' : 'text-taupe/40'}`}>
          <Activity size={24} />
        </button>
        <div className="absolute -bottom-4 left-0 right-0 text-center">
          <span className="text-[8px] text-taupe/20 uppercase tracking-widest">v1.1</span>
        </div>
      </nav>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-champagne/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-12 text-center space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 bg-taupe/20 rounded-full blur-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-taupe/20 border-t-taupe rounded-full animate-spin" />
              </div>
            </div>
            <motion.p
              key={loadingMsg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-serif italic text-taupe/80"
            >
              {loadingMsg}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
