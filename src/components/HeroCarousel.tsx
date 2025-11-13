'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HomepageSection } from '@/lib/queries'

interface HeroCarouselProps {
  heroes: HomepageSection[]
}

export default function HeroCarousel({ heroes }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || heroes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length)
    }, 5000) // 5 saniyede bir değişir

    return () => clearInterval(interval)
  }, [isAutoPlaying, heroes.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false) // Manuel tıklamada auto-play'i durdur
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroes.length)
    setIsAutoPlaying(false)
  }

  if (heroes.length === 0) {
    return (
      <section className="bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Güvenilir, deneyimli ve çözüm odaklı hukuk danışmanlığı
            </h1>
            <p className="mt-4 text-white/80">
              Aile, iş ve ticaret hukukunda uzman ekibimizle yanınızdayız.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const currentHero = heroes[currentIndex]

  return (
    <section className="bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] text-white relative overflow-hidden">
      {/* Hero Slides */}
      <div className="relative">
        {heroes.map((hero, index) => {
          const subtitle = hero.subtitle?.trim()
          const imageAlt = hero.imageAlt?.trim() || hero.title?.trim() || 'Hero görseli'

          return (
            <div
              key={index}
              className={`transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? 'translate-x-0 opacity-100'
                  : index < currentIndex
                    ? '-translate-x-full opacity-0 absolute inset-0'
                    : 'translate-x-full opacity-0 absolute inset-0'
              }`}
            >
              <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    {hero.title || 'Güvenilir, deneyimli ve çözüm odaklı hukuk danışmanlığı'}
                  </h1>
                  {subtitle && <p className="mt-4 text-white/80">{subtitle}</p>}
                  {hero.buttons && hero.buttons.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {hero.buttons.map((button, btnIndex) => (
                        <Link
                          key={btnIndex}
                          href={button.link}
                          className={`px-5 py-3 rounded-md font-medium transition-colors ${
                            button.style === 'primary'
                              ? 'bg-white text-[#0C2340] hover:bg-white/90'
                              : 'border border-white/30 text-white hover:bg-white/10'
                          }`}
                        >
                          {button.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-white/10">
                  {hero.imageUrl ? (
                    <Image
                      src={hero.imageUrl}
                      alt={imageAlt}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 90vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0" aria-hidden="true" />
                  )}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-black/10" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows - Sadece 1'den fazla hero varsa göster */}
      {heroes.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-colors z-10"
            aria-label="Önceki"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-colors z-10"
            aria-label="Sonraki"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation - Sadece 1'den fazla hero varsa göster */}
      {heroes.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
