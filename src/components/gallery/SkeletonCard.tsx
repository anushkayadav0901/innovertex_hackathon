import React from 'react'

export default function SkeletonCard() {
  const randomHeight = Math.floor(Math.random() * 200) + 300 // Random height between 300-500px

  return (
    <div 
      className="masonry-item"
      style={{ '--row-span': Math.ceil((randomHeight + 20) / 20) } as React.CSSProperties}
    >
      <div className="card p-0 overflow-hidden" style={{ height: randomHeight }}>
        {/* Image skeleton */}
        <div className="skeleton h-48 w-full" />
        
        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          {/* Title skeleton */}
          <div className="skeleton h-6 w-3/4 rounded" />
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-4/6 rounded" />
          </div>
          
          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
          
          {/* Footer skeleton */}
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
