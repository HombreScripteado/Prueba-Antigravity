'use client'

import { useEffect } from 'react'

export default function LandingScripts() {
  useEffect(() => {
    // 1. Cursor Glow
    const glow = document.querySelector('.cursor-glow') as HTMLElement | null
    if (glow) {
      document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px'
        glow.style.top = e.clientY + 'px'
        glow.style.opacity = '1'
      })
      document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0'
      })
    }

    // 2. Nav Scroll State
    const nav = document.getElementById('nav') as HTMLElement | null
    if (nav) {
      window.addEventListener(
        'scroll',
        () => {
          nav.classList.toggle('is-scrolled', window.scrollY > 50)
        },
        { passive: true }
      )
    }

    // 3. Reveal Animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el))

    // 4. Showcase Tabs
    const tabs = document.querySelectorAll('.tab') as NodeListOf<HTMLElement>
    const themes = document.querySelectorAll('.theme') as NodeListOf<HTMLElement>
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active')
          t.setAttribute('aria-selected', 'false')
        })
        tab.classList.add('is-active')
        tab.setAttribute('aria-selected', 'true')
        const targetTheme = tab.getAttribute('data-theme')
        themes.forEach((theme) => {
          theme.classList.toggle('is-active', theme.getAttribute('data-theme') === targetTheme)
        })
      })
    })

    // 5. Scroll Sequence — 4 panels, smooth crossfade
    const sequenceSection = document.getElementById('proceso') as HTMLElement | null
    const panels = document.querySelectorAll('.panel') as NodeListOf<HTMLElement>
    const progSteps = document.querySelectorAll('.prog__step') as NodeListOf<HTMLElement>
    const progFill = document.querySelector('.prog__fill') as HTMLElement | null
    const progressContainer = document.querySelector('.sequence__progress') as HTMLElement | null
    const numPanels = 4

    if (sequenceSection && panels.length) {
      let rafId: number | null = null

      const updateSequence = () => {
        const rect = sequenceSection.getBoundingClientRect()
        const vh = window.innerHeight

        if (rect.top <= 0 && rect.bottom >= vh) {
          if (progressContainer) progressContainer.classList.add('is-visible')

          const scrollableDistance = rect.height - vh
          const scrolledDistance = -rect.top
          const progress = Math.max(0, Math.min(1, scrolledDistance / scrollableDistance))

          if (progFill) progFill.style.width = progress * 100 + '%'

          // Smooth crossfade between panels
          const fadeZone = 0.06 // 6% of total scroll for crossfade

          panels.forEach((panel, i) => {
            const start = i / numPanels
            const end = (i + 1) / numPanels

            let opacity
            if (i === 0) {
              // First panel: full opacity at start, fades out
              if (progress < end - fadeZone) {
                opacity = 1
              } else if (progress < end + fadeZone) {
                opacity = 1 - ((progress - (end - fadeZone)) / (fadeZone * 2))
              } else {
                opacity = 0
              }
            } else if (i === numPanels - 1) {
              // Last panel: fades in, full opacity at end
              if (progress < start - fadeZone) {
                opacity = 0
              } else if (progress < start + fadeZone) {
                opacity = (progress - (start - fadeZone)) / (fadeZone * 2)
              } else {
                opacity = 1
              }
            } else {
              // Middle panels: fade in then fade out
              if (progress < start - fadeZone) {
                opacity = 0
              } else if (progress < start + fadeZone) {
                opacity = (progress - (start - fadeZone)) / (fadeZone * 2)
              } else if (progress < end - fadeZone) {
                opacity = 1
              } else if (progress < end + fadeZone) {
                opacity = 1 - ((progress - (end - fadeZone)) / (fadeZone * 2))
              } else {
                opacity = 0
              }
            }

            opacity = Math.max(0, Math.min(1, opacity))
            const scale = 0.92 + opacity * 0.08
            const ty = (1 - opacity) * 24

            panel.style.opacity = opacity.toString()
            panel.style.transform = `scale(${scale}) translateY(${ty}px)`
            panel.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none'

            // Active class for CSS compatibility
            panel.classList.toggle('is-active', opacity > 0.4)
          })

          // Active panel index for progress steps
          const activeIndex = Math.min(numPanels - 1, Math.floor(progress * numPanels))
          progSteps.forEach((step, i) => {
            step.classList.toggle('active', i <= activeIndex)
          })
        } else {
          if (progressContainer) progressContainer.classList.remove('is-visible')
        }
      }

      window.addEventListener(
        'scroll',
        () => {
          if (rafId) cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(updateSequence)
        },
        { passive: true }
      )

      updateSequence()
    }

    // 6. Stats Counter
    const statsSection = document.querySelector('.impact__stats') as HTMLElement | null
    const statNums = document.querySelectorAll('.stat-card__num') as NodeListOf<HTMLElement>
    let hasCounted = false

    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
          hasCounted = true

          // Animate stat bars
          document.querySelectorAll('.stat-card').forEach((card) => {
            card.classList.add('is-counted')
          })

          statNums.forEach((num) => {
            const target = parseInt(num.getAttribute('data-target') || '0')
            const prefix = num.getAttribute('data-prefix') || ''
            const suffix = num.getAttribute('data-suffix') || ''
            let current = 0
            const duration = 1800
            const increment = Math.max(1, Math.ceil(target / (duration / 16)))

            const timer = setInterval(() => {
              current = Math.min(current + increment, target)
              num.textContent = prefix + current + suffix
              if (current >= target) clearInterval(timer)
            }, 16)
          })
        }
      }, { threshold: 0.4 })

      statsObserver.observe(statsSection)
    }

    // 7. Footer year
    const yearEl = document.getElementById('year') as HTMLElement | null
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString()
  }, [])

  return null
}
