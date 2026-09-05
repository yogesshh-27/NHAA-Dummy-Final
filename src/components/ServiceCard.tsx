import React from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  buttonText: string
  to: string
  icon: LucideIcon
  isExternal?: boolean
  externalUrl?: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  buttonText,
  to,
  icon: Icon,
  isExternal = false,
  externalUrl,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
      <div>
        {/* Large Navy Stroke Icon directly matching NHAPOA official card design */}
        <div className="mb-6 text-[#003366]">
          <Icon className="w-12 h-12 text-[#003366]" strokeWidth={1.75} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#003366] mb-3 group-hover:text-blue-800 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Action Link with Arrow matching official NHAPOA site */}
      <div className="pt-2">
        {isExternal && externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#003366] hover:text-blue-800 hover:gap-2.5 transition-all cursor-pointer"
          >
            <span>{buttonText}</span>
          </a>
        ) : (
          <Link
            to={to}
            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#003366] hover:text-blue-800 hover:gap-2.5 transition-all"
          >
            <span>{buttonText}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
