// components/HomePageClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { skillsData } from '@/data/skills';
import { NavigationMenu } from "@/components/NavigationMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SpotlightCard } from "@/components/SpotlightCard";
import { SkillCard } from '@/components/SkillCard';
import { ProjectCarousel } from "@/components/ProjectCarousel";
import type { Dictionary } from "@/types";

// Sparkles de lens-flare sobre el campo (posiciones deterministas)
const fieldSparkles = [
  { char: "✦", className: "top-[14%] left-[8%] text-2xl", delay: 0, duration: 3.6 },
  { char: "✧", className: "top-[22%] right-[10%] text-xl", delay: 0.9, duration: 4.2 },
  { char: "✦", className: "bottom-[20%] left-[14%] text-lg", delay: 1.6, duration: 3.9 },
  { char: "✧", className: "bottom-[14%] right-[8%] text-2xl", delay: 0.4, duration: 4.6 },
];

const softSpring = { type: "spring", stiffness: 90, damping: 16 } as const;

export function HomePageClient({ dict }: { dict: Dictionary }) {
  const [activeSection, setActiveSection] = useState("#home");
  const options = { threshold: 0.3 };
  const { ref: homeRef, inView: homeInView } = useInView(options);
  const { ref: aboutRef, inView: aboutInView } = useInView(options);
  const { ref: projectsRef, inView: projectsInView } = useInView(options);
  const { ref: contactRef, inView: contactInView } = useInView(options);

  useEffect(() => {
    if (homeInView) setActiveSection("#home");
    if (aboutInView) setActiveSection("#about");
    if (projectsInView) setActiveSection("#projects");
    if (contactInView) setActiveSection("#contact");
  }, [homeInView, aboutInView, projectsInView, contactInView]);

  const iconContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.6 },
    },
  };

  const iconVariants: Variants = {
    hidden: { y: 24, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 18 },
    },
  };

  const renderWithAccent = (text: string) => {
    return text.split(/(<accent>.*?<\/accent>)/).map((part, index) => {
      if (part.startsWith('<accent>') && part.endsWith('</accent>')) {
        const content = part.replace(/<\/?accent>/g, '');
        return (
          <span key={index} className="chrome-accent">
            {content}
          </span>
        );
      }
      return part;
    });
  };

  const projectsArray = Object.values(dict.projects.items).map((project) => ({
    ...project,
    tags: project.tags ?? [],
    demoUrl: project.demoUrl ?? undefined,
    codeUrl: project.codeUrl ?? undefined,
  }));
  const projectLabels = {
    liveDemo: dict.projects.liveDemo,
    viewCode: dict.projects.viewCode,
  };

  const totalSkills = skillsData.reduce((n, c) => n + c.skills.length, 0);

  return (
    <>
      <main className="flex flex-col items-center justify-start py-16">
        {/* ============ HERO: ventana de software sobre el campo Bliss ============ */}
        <div ref={homeRef} id="home" className="relative flex min-h-screen -mt-16 w-full items-center justify-center px-4 overflow-hidden">
          {/* Marco sticker con el campo (PNG + fallback gradiente) */}
          <div aria-hidden="true" className="hero-field sticker-frame absolute inset-x-4 top-24 bottom-10 md:inset-x-14">
            <div className="hero-field-night" />
          </div>

          {/* Burbujas de cromo flotantes */}
          <div aria-hidden="true" className="bubble-deco hidden md:block h-28 w-28 left-[4%] top-[16%]" />
          <div aria-hidden="true" className="bubble-deco hidden md:block h-16 w-16 right-[6%] top-[60%]" />
          <div aria-hidden="true" className="bubble-deco hidden lg:block h-20 w-20 right-[10%] top-[14%]" />

          {/* Lens-flare sparkles */}
          {fieldSparkles.map((sparkle, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className={`flare pointer-events-none absolute select-none z-10 ${sparkle.className}`}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 12, 0],
              }}
              transition={{
                duration: sparkle.duration,
                delay: sparkle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {sparkle.char}
            </motion.span>
          ))}

          {/* LA VENTANA PRINCIPAL */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.15 }}
            className="window-panel texture-droplets relative z-20 w-full max-w-3xl mt-14"
          >
            {/* Barra de título */}
            <div className="title-bar">
              <span className="title-bar-caption">✦ ericpastor.exe</span>
              <div className="title-bar-controls" aria-hidden="true">
                <span className="tb-btn">_</span>
                <span className="tb-btn">□</span>
                <span className="tb-btn">×</span>
              </div>
            </div>

            {/* Menú de texto estilo software */}
            <div className="win-menu hidden sm:flex" aria-hidden="true">
              <span>File</span><span>Play</span><span>Options</span><span>View</span><span>Help</span>
            </div>

            <div className="px-4 pb-6 pt-4 md:px-7 md:pb-7">
              {/* Pantalla LCD */}
              <div className="lcd px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm md:text-base flex items-center gap-2">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full status-dot-ping opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 status-dot"></span>
                    </span>
                    <span className="truncate uppercase">{dict.hero.availability}</span>
                    <span className="lcd-cursor" aria-hidden="true">▮</span>
                  </div>
                  <div className="text-[0.62rem] md:text-xs opacity-80 mt-1.5 tracking-wider">
                    TGN·ES · 41.1°N 1.1°E · 320KBPS 48KHZ · CH.01
                  </div>
                </div>
                <div className="eq shrink-0" aria-hidden="true">
                  <span /><span /><span /><span /><span /><span /><span />
                </div>
              </div>

              {/* Titular cromado */}
              <h1 className="font-display chrome-text text-4xl sm:text-5xl md:text-6xl font-bold text-center mt-8 pb-3 leading-tight">
                {dict.hero.greeting}
              </h1>
              <p className="text-center text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {renderWithAccent(dict.hero.description)}
              </p>

              {/* Botones transport: sociales */}
              <motion.div
                className="mt-9 flex items-center justify-center gap-6"
                variants={iconContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.a
                  href="https://github.com/ericpastorm"
                  target="_blank"
                  aria-label="GitHub"
                  className="btn-transport flex h-14 w-14 items-center justify-center"
                  variants={iconVariants}
                >
                  <Github className="h-6 w-6" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/eric-pastor-moreno"
                  target="_blank"
                  aria-label="LinkedIn"
                  className="btn-transport flex h-14 w-14 items-center justify-center"
                  variants={iconVariants}
                >
                  <Linkedin className="h-6 w-6" />
                </motion.a>
                <motion.a
                  href="mailto:hello@ericpastor.dev"
                  aria-label="Email"
                  className="btn-transport flex h-14 w-14 items-center justify-center"
                  variants={iconVariants}
                >
                  <Mail className="h-6 w-6" />
                </motion.a>
              </motion.div>

              {/* Sliders decorativos + botones de utilidad */}
              <div className="mt-9 flex items-center justify-between gap-5" aria-hidden="true">
                <div className="flex-1 max-w-[130px]">
                  <div className="text-[0.58rem] font-bold text-subtle tracking-[0.2em] mb-1.5">VOL</div>
                  <div className="slider"><div className="slider-thumb" style={{ left: '62%' }} /></div>
                </div>
                <div className="flex gap-2">
                  <span className="project-tag">PL</span>
                  <span className="project-tag">ML</span>
                  <span className="project-tag">EQ</span>
                </div>
                <div className="flex-1 max-w-[130px]">
                  <div className="text-[0.58rem] font-bold text-subtle tracking-[0.2em] mb-1.5 text-right">BAL</div>
                  <div className="slider"><div className="slider-thumb" style={{ left: '38%' }} /></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============ ABOUT: ventana con barra de título ============ */}
        <div ref={aboutRef} id="about" className="w-full max-w-5xl px-4 mt-28">
          <SpotlightCard title={dict.about.title} texture>
            <div className="px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6">
              <div className="text-base md:text-lg lg:text-xl text-muted leading-relaxed space-y-6 max-w-4xl">
                <p>{dict.about.description1}</p>
                <p>{renderWithAccent(dict.about.description2)}</p>
                <p>{dict.about.description3}</p>
              </div>

              {/* Panel inset de skills */}
              <div className="inset-panel mt-10 p-5 md:p-6">
                <div className="flex items-center justify-between mb-6" aria-hidden="true">
                  <span className="text-[0.62rem] font-bold tracking-[0.22em] text-subtle uppercase">dir://skills</span>
                  <span className="text-[0.62rem] font-bold tracking-[0.22em] text-subtle uppercase">{totalSkills} items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {skillsData.map((category) => (
                    <div key={category.titleKey}>
                      <h3 className="led-chip mb-5">{dict.skills[category.titleKey]}</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        {category.skills.map((skill) => (
                          <SkillCard
                            key={skill.name}
                            name={skill.name}
                            icon={skill.icon}
                            color={skill.color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* ============ PROJECTS: ventana con carousel ============ */}
        <div ref={projectsRef} id="projects" className="w-full max-w-5xl px-4 mt-28">
          <SpotlightCard title={dict.projects.title} texture>
            <div className="px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6">
              <p className="text-base md:text-lg lg:text-xl text-secondary mb-10">
                {dict.projects.subtitle}
              </p>
              <ProjectCarousel projects={projectsArray} labels={projectLabels} />
            </div>
          </SpotlightCard>
        </div>

        {/* ============ CONTACT: ventana con formulario ============ */}
        <div ref={contactRef} id="contact" className="w-full max-w-5xl px-4 mt-28">
          <SpotlightCard title={dict.contact.title} texture>
            <div className="px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6">
              <p className="text-base md:text-lg lg:text-xl text-secondary mb-10 max-w-3xl">
                {dict.contact.description}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="btn-metal flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <Mail className="h-5 w-5" />
                    </span>
                    <a href="mailto:hello@ericpastor.dev" className="text-base md:text-lg text-secondary hover:text-primary transition-colors break-all">hello@ericpastor.dev</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="btn-metal flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <Linkedin className="h-5 w-5" />
                    </span>
                    <a href="https://linkedin.com/in/eric-pastor-moreno" target="_blank" className="text-base md:text-lg text-secondary hover:text-primary transition-colors">LinkedIn</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="btn-metal flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <p className="text-base md:text-lg text-secondary">{dict.contact.location}</p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="inset-panel p-5 md:p-6">
                    <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
                      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY} />

                      <h3 className="led-chip">
                        {dict.contact.form.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" name="name" placeholder={dict.contact.form.name} required className="w-full form-input rounded-lg px-4 py-2.5" />
                        <input type="email" name="email" placeholder={dict.contact.form.email} required className="w-full form-input rounded-lg px-4 py-2.5" />
                      </div>

                      <textarea name="message" placeholder={dict.contact.form.message} required rows={4} className="w-full form-input rounded-lg px-4 py-2.5"></textarea>

                      <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full btn-primary">
                        <Send className="h-4 w-4" />
                        {dict.contact.form.send}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* ============ FOOTER ============ */}
        <div className="w-full mt-28">
          <div className="halftone h-6 w-full opacity-70" aria-hidden="true" />
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto px-4 py-10 border-t border-adaptive"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/ericpastorm"
                  target="_blank"
                  aria-label="GitHub"
                  className="text-subtle hover:text-[rgb(var(--accent))] transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com/in/eric-pastor-moreno"
                  target="_blank"
                  aria-label="LinkedIn"
                  className="text-subtle hover:text-[rgb(var(--accent))] transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="mailto:hello@ericpastor.dev"
                  aria-label="Email"
                  className="text-subtle hover:text-[rgb(var(--accent))] transition-colors"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>

              <p className="text-sm text-muted flex items-center gap-2">
                <span aria-hidden="true" className="flare">✦</span>
                {dict.footer.designed}
                <span aria-hidden="true" className="flare">✦</span>
              </p>

              <p className="led-chip text-xs">
                © {new Date().getFullYear()} Eric Pastor · {dict.footer.rights}
              </p>
            </div>
          </motion.footer>
        </div>
      </main>

      <NavigationMenu
        activeSection={activeSection}
        translations={dict.navigation}
        themeSwitcherLabel={dict.hero.changeTheme}
      />
      <LanguageSwitcher />
    </>
  );
}
