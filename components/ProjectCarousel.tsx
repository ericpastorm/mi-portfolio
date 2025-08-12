// components/ProjectCarousel.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProjectType } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProjectCarousel({ projects }: { projects: ProjectType[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <div>
      {/* 👇 1. AÑADIMOS EL MARGEN NEGATIVO AQUÍ 👇 */}
      <div className="overflow-hidden -ml-4" ref={emblaRef}>
        
        {/* 👇 2. Y LO QUITAMOS DE AQUÍ 👇 */}
        <div className="flex">
          {projects.map((project, index) => (
            <div key={index} className="flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 xl:basis-[40%] pl-4">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Controles: Flechas y Puntos */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <button onClick={scrollPrev} disabled={!prevBtnEnabled} className="disabled:opacity-30">
          <ArrowLeft className="h-8 w-8 text-muted hover:text-secondary transition-colors" />
        </button>

        <div className="flex items-center gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "carousel-dot-active w-4" : "carousel-dot"
              }`}
            />
          ))}
        </div>

        <button onClick={scrollNext} disabled={!nextBtnEnabled} className="disabled:opacity-30">
          <ArrowRight className="h-8 w-8 text-muted hover:text-secondary transition-colors" />
        </button>
      </div>
    </div>
  );
}