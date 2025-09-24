import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Figma, FileStack, Sparkles, Rocket, Users, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Landing() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute top-20 left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 border border-white/20 rotate-45"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                rotate: [45, 405],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
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
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-brand-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              BUILD THE FUTURE
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Join the most innovative hackathon platform where creativity meets technology. 
              Build, compete, and shape the future together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/discover" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Building
                </Link>
              </motion.div>
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