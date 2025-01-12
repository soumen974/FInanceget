import React from 'react'

export default function ListBoxScalLoadder() {
  return (
    <div>
        <div>
           <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <span>•</span>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-2 mt-1">
              <div className="h-4  rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
