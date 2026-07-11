import {
  Bot,
  Brush,
  CloudCog,
  Code2,
  Globe,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Brush,
  CloudCog,
  Code2,
  Globe,
  LayoutDashboard,
}

export function resolveServiceIcon(iconName?: string): LucideIcon {
  if (!iconName) return Globe
  return iconMap[iconName] ?? Globe
}

export const serviceIconOptions = Object.keys(iconMap)
