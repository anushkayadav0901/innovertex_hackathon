import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, LineChart, ShieldCheck, Github, Figma, FileStack } from 'lucide-react'

export default function Landing() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-fuchsia-500/10 to-cyan-500/10 p-8 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Host. Build. Judge. Win.</h1>
          <p className="mt-4 max-w-2xl text-slate-300">A modern platform to organize, discover, and compete in hackathons. Streamlined registration, submissions, evaluations, and results — all in one place.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/discover" className="btn-primary">Explore Hackathons</Link>
            <Link to="/signup" className="btn-primary bg-white/10 hover:bg-white/20 text-white">Get Started</Link>
          </div>
        </div>
        <Sparkles className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-brand-400/30" />
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Hackathon Discovery</h3>
          <p className="mt-2 text-sm text-slate-300">Explore curated challenges with filters, tags, and timelines.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Easy Registration & Teams</h3>
          <p className="mt-2 text-sm text-slate-300">Create or join teams, manage roles, and track eligibility.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Secure Submissions</h3>
          <p className="mt-2 text-sm text-slate-300">Upload code, decks, and links in a centralized portal.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Judge Dashboards</h3>
          <p className="mt-2 text-sm text-slate-300">Score criteria, leave feedback, and shortlist seamlessly.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Comms Hub</h3>
          <p className="mt-2 text-sm text-slate-300">Announcements, FAQs, and Q&A spaces keep everyone aligned.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Insights & Leaderboards</h3>
          <p className="mt-2 text-sm text-slate-300">Automated results and visual analytics for organizers.</p>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="text-lg font-semibold">Integrations</h3>
        <div className="mt-4 flex flex-wrap gap-3 text-slate-300">
          <span className="badge inline-flex items-center gap-2"><Github className="h-4 w-4"/> GitHub</span>
          <span className="badge inline-flex items-center gap-2"><Figma className="h-4 w-4"/> Figma</span>
          <span className="badge inline-flex items-center gap-2"><FileStack className="h-4 w-4"/> Google Drive</span>
        </div>
      </section>
    </div>
  )
}
