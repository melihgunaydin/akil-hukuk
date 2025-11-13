'use client'
import { useState, useEffect, useRef } from 'react'

interface Service {
  title: string
  description: string
  icon?: string
}

interface ServicesCarouselProps {
  services: Service[]
}

export default function ServicesCarousel({ services }: ServicesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [needsCarousel, setNeedsCarousel] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ekran boyutuna göre gösterilecek item sayısını belirle
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth
      if (width < 640) {
        setItemsPerPage(1)
      } else if (width < 1024) {
        setItemsPerPage(2)
      } else {
        setItemsPerPage(3)
      }
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  // Carousel gerekli mi kontrol et
  useEffect(() => {
    setNeedsCarousel(services.length > itemsPerPage)
  }, [services.length, itemsPerPage])

  const totalPages = Math.ceil(services.length / itemsPerPage)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToPage = (page: number) => {
    setCurrentIndex(page)
  }

  // Eğer carousel gerekli değilse, normal grid göster
  if (!needsCarousel) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div key={i} className="rounded-2xl border p-6 hover:shadow-sm transition">
            <div className="text-lg font-medium">{service.title}</div>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{service.description}</p>
            <button className="mt-4 text-sm font-medium text-[#0C2340]">Detaylı İncele →</button>
          </div>
        ))}
      </div>
    )
  }

  // Carousel modunda göster
  const startIndex = currentIndex * itemsPerPage
  const visibleServices = services.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="relative overflow-hidden">
      {/* Services Grid */}
      <div 
        ref={containerRef}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {visibleServices.map((service, i) => (
          <div key={startIndex + i} className="rounded-2xl border p-6 hover:shadow-sm transition">
            <div className="text-lg font-medium">{service.title}</div>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{service.description}</p>
            <button className="mt-4 text-sm font-medium text-[#0C2340]">Detaylı İncele →</button>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 border shadow-lg p-2 rounded-full transition-colors z-10"
        aria-label="Önceki"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 border shadow-lg p-2 rounded-full transition-colors z-10"
        aria-label="Sonraki"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-[#0C2340] w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Sayfa ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
