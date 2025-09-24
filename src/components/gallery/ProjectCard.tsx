import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Users, Award, Eye } from 'lucide-react'
import { Project } from './ProjectGallery'
import ImageCarousel from './ImageCarousel'

interface ProjectCardProps {
  project: Project
  index: number
  viewMode: 'grid' | 'list'
  onClick: () => void
}

export default function ProjectCard({ project, index, viewMode, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Calculate masonry item height for grid layout
  useEffect(() => {
    if (viewMode === 'grid' && cardRef.current) {
      const card = cardRef.current
      const height = card.offsetHeight
      const rowSpan = Math.ceil((height + 20) / 20)
      card.style.setProperty('--row-span', rowSpan.toString())
    }
  }, [viewMode, project])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="card p-6 hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.featured && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Featured
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="badge text-xs">{tag}</span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {project.teamSize} members
                </div>
                <span className="badge">{project.category}</span>
              </div>
              
              <button
                onClick={onClick}
                className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="masonry-item"
    >
      <div className="flip-card h-full">
        <div className="flip-card-inner">
          {/* Front of card */}
          <div className="flip-card-front project-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="relative">
              <ImageCarousel images={project.images} />
              
              {project.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                  <Award className="w-3 h-3" />
                  Featured
                </div>
              )}
              
              {project.prize && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  {project.prize}
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-slate-300 text-sm line-clamp-3">{project.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="badge text-xs">{tag}</span>
                ))}
                {project.tags.length > 3 && (
                  <span className="badge text-xs">+{project.tags.length - 3}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-4 h-4" />
                  {project.teamSize}
                </div>
                <span className="badge">{project.category}</span>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className="project-overlay">
              <motion.button
                onClick={onClick}
                className="btn-primary mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </motion.button>
              
              <div className="flex gap-3">
                {project.demoUrl && (
                  <motion.a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </motion.a>
                )}
                
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="w-5 h-5 text-white" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div className="flip-card-back relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md p-6">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                
                <div>
                  <h4 className="text-sm font-semibold text-brand-200 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-white/10 rounded-md text-xs text-white">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-brand-200 mb-2">Team Info</h4>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Users className="w-4 h-4" />
                    {project.teamSize} team members
                  </div>
                </div>
                
                {project.prize && (
                  <div>
                    <h4 className="text-sm font-semibold text-brand-200 mb-2">Achievement</h4>
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Award className="w-4 h-4 text-amber-400" />
                      {project.prize}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <motion.button
                  onClick={onClick}
                  className="btn-primary flex-1 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
