import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const glassCardVariants = cva(
  'rounded-2xl glass-card',
  {
    variants: {
      variant: {
        default: '',
        interactive: 'glass-card-interactive cursor-pointer',
        glow: 'glow-border glass-card-interactive cursor-pointer',
        elevated: 'shadow-2xl',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: { variant: 'default', padding: 'md' },
  }
)

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof glassCardVariants> {}

export function GlassCard({ className, variant, padding, ...props }: GlassCardProps) {
  return <div className={cn(glassCardVariants({ variant, padding }), className)} {...props} />
}

export function GlassCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between mb-4', className)} {...props} />
}

export function GlassCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-medium text-white/70 tracking-wide uppercase', className)} {...props} />
}

export function GlassCardValue({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-3xl font-semibold tracking-tight tabular-nums', className)} {...props} />
}
