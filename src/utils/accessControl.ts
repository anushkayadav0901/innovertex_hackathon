// Access Control and Security Logging System

export interface AccessRequest {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: Date;
  action: 'request' | 'approval' | 'rejection' | 'download' | 'view' | 'screenshot_attempt';
  userId: string;
  projectId: string;
  details: string;
  ipAddress?: string;
}

export interface UserAccess {
  userId: string;
  projectId: string;
  accessLevel: 'view' | 'download' | 'edit';
  grantedAt: Date;
  expiresAt?: Date;
}

// In-memory storage (replace with actual database in production)
let accessRequests: AccessRequest[] = [];
let securityLogs: SecurityLog[] = [];
let userAccesses: UserAccess[] = [];

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create access request
export function createAccessRequest(
  projectId: string,
  userId: string,
  userName: string,
  userEmail: string,
  message: string
): AccessRequest {
  const request: AccessRequest = {
    id: generateId(),
    projectId,
    userId,
    userName,
    userEmail,
    message,
    status: 'pending',
    requestedAt: new Date(),
  };

  accessRequests.push(request);
  
  // Log the request
  logSecurityEvent('request', userId, projectId, `Access request created: ${message}`);
  
  return request;
}

// Check if user has access
export function hasAccess(userId: string, projectId: string, requiredLevel: 'view' | 'download' | 'edit' = 'view'): boolean {
  const access = userAccesses.find(
    a => a.userId === userId && a.projectId === projectId
  );

  if (!access) return false;

  // Check if access has expired
  if (access.expiresAt && access.expiresAt < new Date()) {
    return false;
  }

  // Check access level hierarchy: edit > download > view
  const levels = { view: 1, download: 2, edit: 3 };
  return levels[access.accessLevel] >= levels[requiredLevel];
}

// Grant access to user
export function grantAccess(
  userId: string,
  projectId: string,
  accessLevel: 'view' | 'download' | 'edit',
  adminId: string
): void {
  const access: UserAccess = {
    userId,
    projectId,
    accessLevel,
    grantedAt: new Date(),
  };

  userAccesses.push(access);
  
  // Update request status
  const request = accessRequests.find(
    r => r.userId === userId && r.projectId === projectId && r.status === 'pending'
  );
  
  if (request) {
    request.status = 'approved';
    request.reviewedAt = new Date();
    request.reviewedBy = adminId;
  }

  logSecurityEvent('approval', adminId, projectId, `Access granted to user ${userId} with level ${accessLevel}`);
}

// Reject access request
export function rejectAccessRequest(requestId: string, adminId: string, reason: string): void {
  const request = accessRequests.find(r => r.id === requestId);
  
  if (request) {
    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.reviewedBy = adminId;
    
    logSecurityEvent('rejection', adminId, request.projectId, `Access rejected: ${reason}`);
  }
}

// Log security event
export function logSecurityEvent(
  action: SecurityLog['action'],
  userId: string,
  projectId: string,
  details: string,
  ipAddress?: string
): void {
  const log: SecurityLog = {
    id: generateId(),
    timestamp: new Date(),
    action,
    userId,
    projectId,
    details,
    ipAddress,
  };

  securityLogs.push(log);
  console.log(`[SECURITY LOG] ${action.toUpperCase()}: ${details}`, log);
}

// Get pending requests for a project
export function getPendingRequests(projectId: string): AccessRequest[] {
  return accessRequests.filter(r => r.projectId === projectId && r.status === 'pending');
}

// Get all requests for a project
export function getAllRequests(projectId: string): AccessRequest[] {
  return accessRequests.filter(r => r.projectId === projectId);
}

// Get security logs for a project
export function getSecurityLogs(projectId: string): SecurityLog[] {
  return securityLogs.filter(l => l.projectId === projectId);
}

// Get user's request status for a project
export function getUserRequestStatus(userId: string, projectId: string): AccessRequest | null {
  return accessRequests.find(
    r => r.userId === userId && r.projectId === projectId
  ) || null;
}

// Check if user has pending request
export function hasPendingRequest(userId: string, projectId: string): boolean {
  return accessRequests.some(
    r => r.userId === userId && r.projectId === projectId && r.status === 'pending'
  );
}

// Export data for admin dashboard
export function getAccessControlStats() {
  return {
    totalRequests: accessRequests.length,
    pendingRequests: accessRequests.filter(r => r.status === 'pending').length,
    approvedRequests: accessRequests.filter(r => r.status === 'approved').length,
    rejectedRequests: accessRequests.filter(r => r.status === 'rejected').length,
    totalLogs: securityLogs.length,
    activeAccesses: userAccesses.length,
  };
}
