'use client'

import * as React from 'react'
import { Building2, Quote, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'TaskFlow completely changed how our team manages projects.',
    name: 'Sarah Chen',
    role: 'Head of Product',
    company: 'Northwind Labs',
    initials: 'SC',
  },
  {
    quote: 'The AI suggestions save us hours every week.',
    name: 'Marcus Webb',
    role: 'Engineering Lead',
    company: 'Stellar Systems',
    initials: 'MW',
  },
  {
    quote: 'Finally a Kanban tool that actually feels modern.',
    name: 'Elena Ruiz',
    role: 'Design Ops',
    company: 'Atelier Collective',
    initials: 'ER',
  },
  {
    quote: 'Our roadmap reviews went from chaotic to genuinely calm—in one sprint.',
    name: 'Jordan Okonkwo',
    role: 'VP Operations',
    company: 'Helix Freight',
    initials: 'JO',
  },
  {
    quote: 'The board polish and keyboard flow rival tools we evaluated at 3× the price.',
    name: 'Amira Hassan',
    role: 'Technical PM',
    company: 'Cedar Health',
    initials: 'AH',
  },
  {
    quote: 'We onboarded eighty people without a single template complaint. That says everything.',
    name: 'Lucas Tremblay',
    role: 'IT Director',
    company: 'Vantage Retail',
    initials: 'LT',
  },
]

function FiveStars({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-0.5', className)} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-[0.875rem] fill-amber-400 text-amber-400 dark:fill-amber-400/95 dark:text-amber-400/95"
          strokeWidth={0}
          aria-hidden
        />
      ))}
    </div>
  )
}

export function HomeTestimonialsSection() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduceMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  React.useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    obs.observe(root)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-border border-t py-24 md:py-32"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[32rem] w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-transparent to-chart-4/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-15%] bottom-0 h-[24rem] w-[24rem] rounded-full bg-gradient-to-tl from-chart-2/25 via-transparent to-transparent blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[22%] left-[-10%] h-[18rem] w-[18rem] rounded-full bg-chart-4/20 blur-[88px]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_-15%,transparent_50%,color-mix(in_oklch,var(--background),transparent_25%))]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div
          className={cn(
            'mx-auto mb-14 max-w-3xl text-center md:mb-16',
            'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
          )}
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/45 px-4 py-1.5 text-muted-foreground text-xs shadow-sm backdrop-blur-md dark:border-white/12 dark:bg-white/[0.06]">
            <span className="text-amber-500 dark:text-amber-400" aria-hidden>
              ★★★★★
            </span>
            <span className="h-px w-6 bg-gradient-to-r from-transparent via-border to-transparent opacity-80 dark:via-white/20" />
            <span>Social proof</span>
          </p>
          <h2 id="testimonials-heading" className="text-balance font-semibold text-3xl tracking-tight md:text-5xl md:leading-[1.1]">
            Loved by productive teams worldwide
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed md:text-lg">
            Thousands of teams use TaskFlow to organize projects, collaborate faster, and ship better products.
          </p>
        </div>

        <div
          className={cn(
            'mx-auto mb-14 flex max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center md:mb-16',
            'transition-[opacity,transform] delay-100 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
          )}
        >
          <div className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border/80 bg-background/60 px-5 py-4 shadow-[0_12px_42px_-26px_rgb(15_23_42/0.5)] backdrop-blur-xl dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_24px_50px_-34px_rgb(0_0_0/0.7)]">
            <Star className="size-9 shrink-0 fill-amber-400 text-amber-400 drop-shadow-sm" strokeWidth={0} aria-hidden />
            <div className="text-left">
              <p className="font-semibold text-foreground text-lg tabular-nums">4.9 / 5</p>
              <p className="text-muted-foreground text-sm">average rating</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border/80 bg-background/60 px-5 py-4 shadow-[0_12px_42px_-26px_rgb(15_23_42/0.5)] backdrop-blur-xl dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_24px_50px_-34px_rgb(0_0_0/0.7)]">
            <Building2 className="size-8 shrink-0 text-primary" aria-hidden />
            <div className="text-left">
              <p className="font-semibold text-foreground text-lg tabular-nums">12,000+</p>
              <p className="text-muted-foreground text-sm">Trusted by 12,000+ teams</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <article
              key={`${t.name}-${t.company}`}
              className={cn(
                'group relative rounded-2xl border border-black/10 bg-gradient-to-br from-background/95 via-background/88 to-muted/50 p-6 shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_22px_56px_-34px_rgb(15_23_42/0.45)] backdrop-blur-xl md:p-7',
                'dark:from-white/[0.07] dark:via-white/[0.04] dark:to-white/[0.02] dark:border-white/14 dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_28px_72px_-42px_rgb(0_0_0/0.88)]',
                'transition-[transform,box-shadow,border-color,opacity] duration-500 ease-out',
                'hover:-translate-y-2 hover:border-primary/35 hover:shadow-[0_1px_0_0_rgb(255_255_255/0.1)_inset,0_28px_72px_-38px_rgb(59_130_246/0.2),0_0_0_1px_rgb(99_102_241/0.12)]',
                !visible && 'translate-y-7 opacity-0',
                visible && reduceMotion && 'translate-y-0 opacity-100',
                visible && reduceMotion && 'transition-[opacity,transform]'
              )}
              style={
                !reduceMotion && visible
                  ? ({
                      animation: `home-fade-up 0.72s cubic-bezier(0.22, 1, 0.36, 1) ${180 + index * 95}ms both`,
                    } satisfies React.CSSProperties)
                  : reduceMotion && visible
                    ? ({
                        transitionDelay: `${Math.min(index * 55, 400)}ms`,
                      } satisfies React.CSSProperties)
                    : undefined
              }
            >
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-primary/45 to-transparent"
                aria-hidden
              />

              <Quote className="mb-4 size-7 text-muted-foreground/35 transition-colors duration-300 group-hover:text-primary/55 md:size-8" aria-hidden />

              <FiveStars className="mb-4" />

              <blockquote className="mb-8 text-[0.9575rem] text-foreground/95 leading-relaxed md:text-base">
                <span className="text-primary/90">&ldquo;</span>
                {t.quote}
                <span className="text-primary/90">&rdquo;</span>
              </blockquote>

              <footer className="mt-auto flex items-center gap-3 border-border/55 border-t border-dashed pt-5 dark:border-white/12">
                <div
                  className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/22 to-chart-4/14 font-semibold text-primary text-[0.6875rem] leading-none shadow-inner ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-[1.06] dark:ring-white/10"
                  aria-hidden
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-foreground text-sm tracking-tight">{t.name}</div>
                  <div className="truncate text-muted-foreground text-xs leading-snug">
                    {t.role}
                    <span className="text-muted-foreground/80">{' · '}</span>
                    {t.company}
                  </div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
