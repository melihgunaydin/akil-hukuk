'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

interface Person {
  name: string
  role: string
  slug: string
  photoUrl?: string
  bio?: any
}

interface TeamCarouselProps {
  people: Person[]
}

export default function TeamCarousel({ people }: TeamCarouselProps) {
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
    setNeedsCarousel(people.length > itemsPerPage)
  }, [people.length, itemsPerPage])

  const totalPages = Math.ceil(people.length / itemsPerPage)

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
        {people.map((person) => (
          <Link
            key={person.slug}
            href={`/calisanlar/${person.slug}`}
            className="group rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
          >
            {person.photoUrl && (
              <img src={person.photoUrl} alt={person.name} className="aspect-[4/3] w-full object-cover" />
            )}
            <div className="p-5">
              <div className="text-lg font-semibold group-hover:underline">{person.name}</div>
              <div className="text-gray-600 text-sm">{person.role}</div>
              {person.bio && (
                <div className="mt-3 text-gray-600 text-sm line-clamp-3">
                  <PortableText value={person.bio} />
                </div>
              )}
              <span className="mt-4 inline-block text-sm font-medium text-[#0C2340]">Profili Gör →</span>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  // Carousel modunda göster
  const startIndex = currentIndex * itemsPerPage
  const visiblePeople = people.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="relative overflow-hidden">
      {/* Team Grid */}
      <div 
        ref={containerRef}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {visiblePeople.map((person) => (
          <Link
            key={person.slug}
            href={`/calisanlar/${person.slug}`}
            className="group rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
          >
            {person.photoUrl && (
              <img src={person.photoUrl} alt={person.name} className="aspect-[4/3] w-full object-cover" />
            )}
            <div className="p-5">
              <div className="text-lg font-semibold group-hover:underline">{person.name}</div>
              <div className="text-gray-600 text-sm">{person.role}</div>
              {person.bio && (
                <div className="mt-3 text-gray-600 text-sm line-clamp-3">
                  <PortableText value={person.bio} />
                </div>
              )}
              <span className="mt-4 inline-block text-sm font-medium text-[#0C2340]">Profili Gör →</span>
            </div>
          </Link>
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
