import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Clock, Shield, Download, Eye } from 'lucide-react';
import { Project } from './ProjectGallery';
import { hasAccess, hasPendingRequest, getUserRequestStatus, logSecurityEvent } from '../../utils/accessControl';

interface SecureProjectCardProps {
  project: Project;
  userId: string;
  onRequestAccess: (projectId: string) => void;
  onViewProject: (project: Project) => void;
}

export default function SecureProjectCard({ project, userId, onRequestAccess, onViewProject }: SecureProjectCardProps) {
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    // Check access status
    const access = hasAccess(userId, project.id);
    setCanAccess(access);

    // Check request status
    const request = getUserRequestStatus(userId, project.id);
    if (request) {
      setRequestStatus(request.status);
    } else if (hasPendingRequest(userId, project.id)) {
      setRequestStatus('pending');
    }
  }, [userId, project.id]);

  const handleRequestAccess = async () => {
    setIsProcessing(true);
    
    // Animate the button
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onRequestAccess(project.id);
    setRequestStatus('pending');
    setIsProcessing(false);

    // Log the interaction
    logSecurityEvent('request', userId, project.id, `User requested access to project: ${project.title}`);
  };

  const handleViewProject = () => {
    if (canAccess) {
      logSecurityEvent('view', userId, project.id, `User viewed project: ${project.title}`);
      onViewProject(project);
    }
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <motion.div
          className="flex items-center gap-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Shield className="w-4 h-4" />
          <span>Processing...</span>
        </motion.div>
      );
    }

    if (requestStatus === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Pending Approval</span>
        </div>
      );
    }

    if (requestStatus === 'approved' || canAccess) {
      return (
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Access Granted</span>
        </div>
      );
    }

    if (requestStatus === 'rejected') {
      return (
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Request Denied</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span>Request Access</span>
      </div>
    );
  };

  const getButtonStyle = () => {
    if (requestStatus === 'pending') {
      return 'bg-yellow-600 hover:bg-yellow-700 cursor-wait';
    }
    if (requestStatus === 'approved' || canAccess) {
      return 'bg-green-600 hover:bg-green-700';
    }
    if (requestStatus === 'rejected') {
      return 'bg-red-600 hover:bg-red-700 cursor-not-allowed';
    }
    return 'bg-brand-500 hover:bg-brand-600';
  };

  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover"
          style={{ userSelect: 'none' }}
          draggable={false}
        />
        {!canAccess && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-12 h-12 text-white/50" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-slate-300 text-sm line-clamp-2">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="badge text-xs">{tag}</span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {canAccess ? (
            <motion.button
              onClick={handleViewProject}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View Project
            </motion.button>
          ) : (
            <motion.button
              onClick={handleRequestAccess}
              disabled={requestStatus === 'pending' || requestStatus === 'rejected' || isProcessing}
              className={`flex-1 btn-primary flex items-center justify-center gap-2 ${getButtonStyle()}`}
              whileHover={requestStatus === 'none' ? { scale: 1.02 } : {}}
              whileTap={requestStatus === 'none' ? { scale: 0.98 } : {}}
            >
              {getButtonContent()}
            </motion.button>
          )}
        </div>

        {/* Status Message */}
        {requestStatus === 'pending' && (
          <p className="text-xs text-yellow-400 text-center">
            Your request is being reviewed by the project owner
          </p>
        )}
        {requestStatus === 'rejected' && (
          <p className="text-xs text-red-400 text-center">
            Your access request was denied
          </p>
        )}
      </div>
    </motion.div>
  );
}
