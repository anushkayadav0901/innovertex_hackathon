import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Users, Award, ChevronLeft, ChevronRight, Download, MessageSquare } from 'lucide-react'
import { Project } from './ProjectGallery'

interface ZoomModalProps {
  project: Project | null
  onClose: () => void
  onRequestChange: (projectId: string) => void
}

export default function ZoomModal({ project, onClose, onRequestChange }: ZoomModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const [lastViewer, setLastViewer] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0)
      document.body.style.overflow = 'hidden'
      // Show most recent viewer (from localStorage fallback)
      try {
        const key = `gallery:lastViewer:${project.id}`
        const prev = localStorage.getItem(key)
        setLastViewer(prev)
        // Persist current visit (you can replace 'You' with actual user name when auth exists)
        const stamp = new Date().toLocaleString()
        localStorage.setItem(key, `You • ${stamp}`)
      } catch {}
      
      // Disable screenshot functionality
      const preventScreenshot = (e: KeyboardEvent) => {
        // Prevent PrintScreen
        if (e.key === 'PrintScreen') {
          e.preventDefault()
          alert('Screenshots are disabled for this content')
        }
        // Prevent Ctrl+Shift+S (Firefox screenshot)
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
          e.preventDefault()
          alert('Screenshots are disabled for this content')
        }
      }
      
      // Prevent right-click context menu
      const preventContextMenu = (e: MouseEvent) => {
        e.preventDefault()
        return false
      }
      
      window.addEventListener('keyup', preventScreenshot)
      window.addEventListener('keydown', preventScreenshot)
      document.addEventListener('contextmenu', preventContextMenu)
      
      return () => {
        window.removeEventListener('keyup', preventScreenshot)
        window.removeEventListener('keydown', preventScreenshot)
        document.removeEventListener('contextmenu', preventContextMenu)
      }
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [project])

  const nextImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  useEffect(() => {
    if (project) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project])

  const downloadImageWithWatermark = async () => {
    if (!project || !imageRef.current) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = project.images[currentImageIndex]

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Draw the image
        ctx.drawImage(img, 0, 0)

        // Add full-image tiled watermark
        const watermarkText = '© Innovortex'
        const baseSize = Math.max(18, Math.floor(img.width / 40))
        ctx.font = `bold ${baseSize}px Arial`
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.rotate(-Math.PI / 6)
        const stepX = Math.floor(baseSize * 12)
        const stepY = Math.floor(baseSize * 8)
        for (let y = -img.height; y < img.width + img.height; y += stepY) {
          for (let x = -img.width; x < img.width + img.height; x += stepX) {
            ctx.fillText(watermarkText, x, y)
          }
        }
        ctx.setTransform(1,0,0,1,0,0)

        // Download the image
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${project.title.replace(/\s+/g, '-')}-innovortex.png`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Failed to download image. Please try again.')
    }
  }

  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        className="zoom-modal active fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="zoom-modal-content bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">{project.title}</h2>
              {project.prize && (
                <div className="bg-gradient-to-r from-brand-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {project.prize}
                </div>
              )}
            </div>
            {lastViewer && (
              <div className="text-xs text-white/70 blur-[1px]">
                Last viewed by {lastViewer}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* Image Gallery */}
            <div className="lg:w-2/3 relative">
              <div className="relative aspect-video bg-black/20 select-none">
                <AnimatePresence mode="wait">
                  <motion.img
                    ref={imageRef}
                    key={currentImageIndex}
                    src={project.images[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover select-none"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                    draggable={false}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </AnimatePresence>
                {/* Live tiled watermark overlay across entire image */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml;utf8,\
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"200\" viewBox=\"0 0 300 200\">\
  <defs>\
    <style>\
      .wm{fill:rgba(255,255,255,0.12);font-size:22px;font-weight:bold;font-family:Arial,sans-serif;}\
    </style>\
  </defs>\
  <g transform=\"rotate(-20 150 100)\">\
    <text x=\"20\" y=\"100\" class=\"wm\">© Innovortex</text>\
  </g>\
</svg>')",
                    backgroundRepeat: 'repeat',
                    backgroundSize: '300px 200px',
                  }}
                />

                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {project.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-brand-400' : 'border-white/20'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="lg:w-1/3 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-slate-300 leading-relaxed">{project.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-brand-500/20 text-brand-200 rounded-full text-sm border border-brand-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-brand-200 mb-1">Category</h4>
                  <p className="text-white">{project.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-200 mb-1">Team Size</h4>
                  <div className="flex items-center gap-1 text-white">
                    <Users className="w-4 h-4" />
                    {project.teamSize} members
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <motion.button
                  onClick={downloadImageWithWatermark}
                  className="btn-primary w-full justify-center bg-green-600 hover:bg-green-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download with Watermark
                </motion.button>

                <motion.button
                  onClick={() => onRequestChange(project.id)}
                  className="btn-primary w-full justify-center bg-purple-600 hover:bg-purple-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request Changes
                </motion.button>

                {project.demoUrl && (
                  <motion.a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Demo
                  </motion.a>
                )}
                
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary bg-white/10 hover:bg-white/20 w-full justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source Code
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
