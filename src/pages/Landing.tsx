import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Github, Figma, FileStack, Sparkles, Rocket, Users, Trophy, Calendar, Clock, DollarSign, ArrowDown } from 'lucide-react'
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute top-20 left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Hackathon Animation Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Coding symbols floating animation */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['💻', '🚀', '⚡', '🔥', '💡', '🎯', '⭐', '🏆'][i]}
            </motion.div>
          ))}
          
          {/* Circuit-like lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"
              style={{
                left: `${i * 25}%`,
                top: `${20 + i * 20}%`,
                width: '200px',
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleX: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-brand-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Build. Compete. Innovate.
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Join global hackathons and shape the future with code.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                onClick={scrollToHackathons}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowDown className="w-5 h-5" />
                Explore Hackathons
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="btn-primary bg-white/10 hover:bg-white/20 text-lg px-8 py-4 inline-flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Join Community
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-400">50K+</div>
              <div className="text-slate-400">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">200+</div>
              <div className="text-slate-400">Hackathons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">$2M+</div>
              <div className="text-slate-400">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">95%</div>
              <div className="text-slate-400">Success Rate</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
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