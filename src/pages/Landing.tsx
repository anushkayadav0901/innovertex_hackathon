import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Github, Figma, FileStack, Sparkles, Rocket, Users, Trophy, Calendar, Clock, DollarSign, ArrowDown, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Sample hackathon data
const upcomingHackathons = [
  {
    id: 1,
    name: "AI Innovation Challenge 2024",
    description: "Build the next generation of AI-powered applications that solve real-world problems.",
    tags: ["AI", "Machine Learning", "Innovation"],
    timeLeft: "6 days left",
    prize: "$50,000",
    participants: 1250,
    difficulty: "Advanced"
  },
  {
    id: 2,
    name: "Blockchain for Good",
    description: "Create blockchain solutions that make a positive impact on society and environment.",
    tags: ["Blockchain", "Sustainability", "Social Impact"],
    timeLeft: "12 days left", 
    prize: "$25,000",
    participants: 890,
    difficulty: "Intermediate"
  },
  {
    id: 3,
    name: "FinTech Revolution",
    description: "Revolutionize financial services with cutting-edge technology and user experience.",
    tags: ["FinTech", "Banking", "UX/UI"],
    timeLeft: "18 days left",
    prize: "$75,000",
    participants: 2100,
    difficulty: "Advanced"
  },
  {
    id: 4,
    name: "HealthTech Innovations",
    description: "Develop healthcare solutions that improve patient outcomes and accessibility.",
    tags: ["HealthTech", "Medical", "Accessibility"],
    timeLeft: "3 days left",
    prize: "$40,000",
    participants: 750,
    difficulty: "Beginner"
  },
  {
    id: 5,
    name: "Climate Action Hackathon",
    description: "Build technology solutions to combat climate change and promote sustainability.",
    tags: ["Climate", "Environment", "Green Tech"],
    timeLeft: "25 days left",
    prize: "$60,000",
    participants: 1500,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    name: "EdTech Future",
    description: "Transform education through innovative technology and learning experiences.",
    tags: ["EdTech", "Learning", "Innovation"],
    timeLeft: "9 days left",
    prize: "$35,000",
    participants: 980,
    difficulty: "Beginner"
  }
];

// Live Coding Terminal Component
const LiveCodingTerminal = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const codeSnippets = [
    {
      language: 'python',
      lines: [
        '# Building AI for Climate Change 🌍',
        'import tensorflow as tf',
        'import numpy as np',
        '',
        'def predict_carbon_footprint(data):',
        '    model = tf.keras.Sequential([',
        '        tf.keras.layers.Dense(128, activation="relu"),',
        '        tf.keras.layers.Dense(64, activation="relu"),',
        '        tf.keras.layers.Dense(1)',
        '    ])',
        '    return model.predict(data)',
        '',
        'print("🏆 Hackathon project ready!")'
      ]
    },
    {
      language: 'javascript',
      lines: [
        '// Real-time Collaboration App 🤝',
        'const WebSocket = require("ws");',
        'const express = require("express");',
        '',
        'const hackathonApp = {',
        '  teams: new Map(),',
        '  projects: [],',
        '  ',
        '  createTeam(name, members) {',
        '    const team = {',
        '      id: Date.now(),',
        '      name,',
        '      members,',
        '      progress: 0',
        '    };',
        '    this.teams.set(team.id, team);',
        '    return team;',
        '  }',
        '};',
        '',
        'console.log("🚀 Innovation deployed!");'
      ]
    },
    {
      language: 'react',
      lines: [
        '// Interactive Dashboard 📊',
        'import React, { useState, useEffect } from "react";',
        'import { motion } from "framer-motion";',
        '',
        'const HackathonDashboard = () => {',
        '  const [teams, setTeams] = useState([]);',
        '  const [progress, setProgress] = useState(0);',
        '',
        '  useEffect(() => {',
        '    const interval = setInterval(() => {',
        '      setProgress(prev => prev + 1);',
        '    }, 1000);',
        '    return () => clearInterval(interval);',
        '  }, []);',
        '',
        '  return (',
        '    <motion.div animate={{ scale: [1, 1.02, 1] }}>',
        '      <h1>Building the Future! 🌟</h1>',
        '    </motion.div>',
        '  );',
        '};'
      ]
    }
  ];

  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!isTyping) return;
    
    const currentSnippet = codeSnippets[snippetIndex];
    const currentLineText = currentSnippet.lines[currentLine] || '';
    
    if (charIndex < currentLineText.length) {
      const timeout = setTimeout(() => {
        setCurrentCode(prev => prev + currentLineText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, Math.random() * 100 + 50);
      return () => clearTimeout(timeout);
    } else if (currentLine < currentSnippet.lines.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentCode(prev => prev + '\n');
        setCurrentLine(prev => prev + 1);
        setCharIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      // Finished current snippet, move to next
      setTimeout(() => {
        setCurrentCode('');
        setCurrentLine(0);
        setCharIndex(0);
        setSnippetIndex(prev => (prev + 1) % codeSnippets.length);
      }, 3000);
    }
  }, [charIndex, currentLine, snippetIndex, isTyping, codeSnippets]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-w-2xl mx-auto border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-xs">
          hackathon-project.{codeSnippets[snippetIndex].language === 'python' ? 'py' : 
                             codeSnippets[snippetIndex].language === 'react' ? 'jsx' : 'js'}
        </span>
      </div>
      <pre className="text-green-400 min-h-[300px] overflow-hidden">
        {currentCode}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="bg-green-400 w-2 h-4 inline-block ml-1"
        />
      </pre>
    </div>
  );
};

// Interactive Code Block Component
const InteractiveCodeBlock = ({ 
  title, 
  code, 
  language, 
  demo, 
  position 
}: { 
  title: string; 
  code: string; 
  language: string; 
  demo: string;
  position: { x: number; y: number };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      whileDrag={{ scale: 1.05, zIndex: 20 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 w-64 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-xs text-slate-400">{language}</span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
        <pre className="text-xs text-green-400 overflow-hidden h-16">
          {code}
        </pre>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-2 bg-slate-700 rounded text-xs text-yellow-400"
          >
            {demo}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Magical Code-to-Reality Animation
const MagicalCodePortal = () => {
  const [portalPhase, setPortalPhase] = useState(0);
  const [floatingCodes, setFloatingCodes] = useState<Array<{id: number, code: string, x: number, y: number}>>([]);
  
  const portalDimensions = [
    { name: 'AI Universe', color: '#8b5cf6', icon: '🤖', particles: '✨' },
    { name: 'Web Cosmos', color: '#06b6d4', icon: '🌐', particles: '💫' },
    { name: 'Mobile Galaxy', color: '#10b981', icon: '📱', particles: '⭐' },
    { name: 'Blockchain Realm', color: '#f59e0b', icon: '⛓️', particles: '🔮' }
  ];

  const techOrbs = [
    { name: 'React', x: 20, y: 30, color: '#61dafb', size: 40 },
    { name: 'Python', x: 70, y: 20, color: '#3776ab', size: 35 },
    { name: 'AI/ML', x: 80, y: 60, color: '#ff6b6b', size: 45 },
    { name: 'Node.js', x: 30, y: 70, color: '#339933', size: 38 },
    { name: 'Web3', x: 60, y: 50, color: '#f7931e', size: 42 },
    { name: 'Flutter', x: 15, y: 60, color: '#02569b', size: 36 }
  ];

  useEffect(() => {
    // Portal phase cycling
    const portalInterval = setInterval(() => {
      setPortalPhase(prev => (prev + 1) % portalDimensions.length);
    }, 4000);

    // Floating code generation
    const codeInterval = setInterval(() => {
      const newCode = {
        id: Date.now(),
        code: ['<div>', 'function()', 'import', 'const', 'async'][Math.floor(Math.random() * 5)],
        x: Math.random() * 80 + 10,
        y: 100
      };
      setFloatingCodes(prev => [...prev.slice(-5), newCode]);
    }, 2000);

    return () => {
      clearInterval(portalInterval);
      clearInterval(codeInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Mystical Portal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-64 h-64 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Portal Rings */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 opacity-30"
              style={{
                borderColor: portalDimensions[portalPhase].color,
                transform: `scale(${1 + i * 0.2})`,
              }}
              animate={{
                rotate: [0, -360],
                opacity: [0.1, 0.6, 0.1]
              }}
              transition={{
                rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity, delay: i * 0.5 }
              }}
            />
          ))}
          
          {/* Portal Center */}
          <motion.div
            className="absolute inset-4 rounded-full flex items-center justify-center text-6xl"
            style={{
              background: `radial-gradient(circle, ${portalDimensions[portalPhase].color}20, transparent 70%)`,
              boxShadow: `0 0 50px ${portalDimensions[portalPhase].color}40`
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              key={portalPhase}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              {portalDimensions[portalPhase].icon}
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Tech Orbs */}
      {techOrbs.map((orb, index) => (
        <motion.div
          key={orb.name}
          className="absolute rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            backgroundColor: orb.color,
            boxShadow: `0 0 20px ${orb.color}60`
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            y: { duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 10 + index * 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, delay: index * 0.3 }
          }}
          whileHover={{ scale: 1.3, zIndex: 10 }}
        >
          {orb.name}
        </motion.div>
      ))}

      {/* Energy Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {techOrbs.map((orb, i) => 
          techOrbs.slice(i + 1).map((targetOrb, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${orb.x}%`}
              y1={`${orb.y}%`}
              x2={`${targetOrb.x}%`}
              y2={`${targetOrb.y}%`}
              stroke="url(#energyGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
              transition={{
                duration: 4,
                delay: (i + j) * 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))
        )}
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Code Particles */}
      {floatingCodes.map((code) => (
        <motion.div
          key={code.id}
          className="absolute font-mono text-green-400 text-sm pointer-events-none"
          style={{ left: `${code.x}%` }}
          initial={{ y: code.y, opacity: 0 }}
          animate={{ 
            y: -50, 
            opacity: [0, 1, 0],
            scale: [1, 1.2, 0.8],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, ease: "easeOut" }}
          onAnimationComplete={() => {
            setFloatingCodes(prev => prev.filter(c => c.id !== code.id));
          }}
        >
          {code.code}
        </motion.div>
      ))}

      {/* Magical Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          >
            {portalDimensions[portalPhase].particles}
          </motion.div>
        ))}
      </div>

      {/* Holographic Scanning Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)'
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Portal Dimension Label */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
        key={portalPhase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="text-lg font-bold mb-1"
          style={{ color: portalDimensions[portalPhase].color }}
        >
          {portalDimensions[portalPhase].name}
        </div>
        <div className="text-xs text-slate-400">
          Where code becomes reality
        </div>
      </motion.div>
    </div>
  );
};

export default function Landing() {
  const hackathonGridRef = useRef<HTMLElement>(null);

  const scrollToHackathons = () => {
    hackathonGridRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="space-y-0">
      {/* Revolutionary Interactive Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
        {/* Dynamic Code Rain Background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute font-mono text-green-500/20 text-xs"
              style={{
                left: `${i * 5}%`,
                top: '-10%',
              }}
              animate={{
                y: ['0vh', '110vh'],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j} className="mb-1">
                  {Math.random().toString(36).substring(2, 8)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Main Interactive Layout */}
        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-start justify-center gap-8 p-8 pt-24">
          
          {/* Left Side - Live Coding Terminal */}
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-6 text-center lg:text-left">
              <motion.h1 
                className="text-4xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Code. Create. Compete.
              </motion.h1>
              <motion.p 
                className="text-lg text-slate-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Watch real hackathon projects come to life in our live coding environment
              </motion.p>
            </div>
            
            <LiveCodingTerminal />
            
            {/* Interactive CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <motion.button
                onClick={scrollToHackathons}
                className="group relative bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Start Hacking
                </span>
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/signup" 
                  className="group border-2 border-gray-600 hover:border-green-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-all duration-300 hover:bg-green-500/10"
                >
                  <span className="text-xl">👨‍💻</span>
                  Join Developers
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Web Cosmos Animation */}
          <motion.div 
            className="flex-1 max-w-2xl relative flex items-start justify-center pt-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Web Cosmos Orbital Animation */}
            <MagicalCodePortal />
          </motion.div>
        </div>

        {/* Animated Network Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 20}%`}
              y1={`${30 + i * 10}%`}
              x2={`${40 + i * 15}%`}
              y2={`${50 + i * 5}%`}
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </svg>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToHackathons}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 group cursor-pointer z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <div className="w-12 h-12 border-2 border-slate-600 group-hover:border-green-400 rounded-full flex items-center justify-center transition-colors">
              <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-green-400 transition-colors" />
            </div>
          </motion.div>
        </motion.button>
      </section>

      {/* Upcoming Hackathons Section */}
      <section ref={hackathonGridRef} className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Upcoming Hackathons
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of developers in these exciting challenges
            </motion.p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingHackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon.id}
                className="card p-6 group hover:scale-105 transition-all duration-300 border border-slate-700/50 hover:border-brand-500/50"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {hackathon.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <Clock className="w-4 h-4" />
                      <span className={`font-medium ${
                        hackathon.timeLeft.includes('3 days') ? 'text-red-400' :
                        hackathon.timeLeft.includes('6 days') ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        {hackathon.timeLeft}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    hackathon.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    hackathon.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {hackathon.difficulty}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {hackathon.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hackathon.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-brand-500/20 text-brand-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{hackathon.prize}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  className="w-full btn-primary py-3 text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/discover"
              className="btn-primary bg-white/10 hover:bg-white/20 text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View All Hackathons
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A comprehensive platform designed for organizers, participants, and judges
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              className="card p-8 group hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/30 transition-colors">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hackathon Discovery</h3>
              <p className="text-slate-300">Explore curated challenges with advanced filters, tags, and interactive timelines.</p>
            </motion.div>
            
            <motion.div 
              className="card p-8 group hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Formation</h3>
              <p className="text-slate-300">Create or join teams seamlessly with role management and eligibility tracking.</p>
            </motion.div>
            
            <motion.div 
              className="card p-8 group hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Submissions</h3>
              <p className="text-slate-300">Upload code, presentations, and demos in a centralized, secure portal.</p>
            </motion.div>
            
            <motion.div 
              className="card p-8 group hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Judge Dashboards</h3>
              <p className="text-slate-300">Comprehensive scoring system with criteria-based evaluation and feedback.</p>
            </motion.div>
            
            <motion.div 
              className="card p-8 group hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Communication Hub</h3>
              <p className="text-slate-300">Announcements, FAQs, and Q&A spaces to keep everyone connected.</p>
            </motion.div>
            
            <motion.div 
              className="card p-8 group hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-500/30 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
              <p className="text-slate-300">Real-time leaderboards and comprehensive analytics for organizers.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Seamless Integrations</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <motion.div 
              className="badge text-lg py-3 px-6 inline-flex items-center gap-3"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <Github className="h-6 w-6"/> GitHub
            </motion.div>
            <motion.div 
              className="badge text-lg py-3 px-6 inline-flex items-center gap-3"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <Figma className="h-6 w-6"/> Figma
            </motion.div>
            <motion.div 
              className="badge text-lg py-3 px-6 inline-flex items-center gap-3"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <FileStack className="h-6 w-6"/> Google Drive
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers, designers, and innovators in the ultimate hackathon experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/discover" 
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Explore Hackathons
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signup" 
                className="btn-primary bg-white/10 hover:bg-white/20 text-white text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}