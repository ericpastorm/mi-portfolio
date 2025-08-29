// components/HomePageClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { skillsData } from '@/data/skills';
import { NavigationMenu } from "@/components/NavigationMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SpotlightCard } from "@/components/SpotlightCard";
import { SkillCard } from '@/components/SkillCard';
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { ProjectType } from "@/data/projects";
import type { Dictionary } from "@/types";

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
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const iconVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const renderWithAccent = (text: string) => {
    return text.split(/(<accent>.*?<\/accent>)/).map((part, index) => {
      if (part.startsWith('<accent>') && part.endsWith('</accent>')) {
        const content = part.replace(/<\/?accent>/g, '');
        return (
          <span key={index} className="text-[rgb(var(--accent))] font-medium">
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

  return (
    <>
      <main className="flex flex-col items-center justify-start p-4 py-16">
        {/* HERO SECTION */}
        <div ref={homeRef} id="home" className="flex flex-col items-center justify-center text-center min-h-screen -mt-16">
          <div className="mb-6 flex items-center gap-2 availability-badge px-3 py-1 rounded-full text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full status-dot-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 status-dot"></span>
            </span>
            {dict.hero.availability}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold title-gradient pb-4">
            {dict.hero.greeting}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted max-w-4xl leading-relaxed">
            {renderWithAccent(dict.hero.description)}
          </p>
          <motion.div
            className="mt-8 flex gap-4"
            variants={iconContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.a
              href="https://github.com/ericpastorm"
              target="_blank"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-adaptive bg-transparent transition-all duration-300 hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10"
              variants={iconVariants}
            >
              <Github className="h-6 w-6 text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-[rgb(var(--accent))]" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/eric-pastor-moreno"
              target="_blank"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-adaptive bg-transparent transition-all duration-300 hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10"
              variants={iconVariants}
            >
              <Linkedin className="h-6 w-6 text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-[rgb(var(--accent))]" />
            </motion.a>
            <motion.a
              href="mailto:hello@ericpastor.dev"
              target="_blank"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-adaptive bg-transparent transition-all duration-300 hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10"
              variants={iconVariants}
            >
              <Mail className="h-6 w-6 text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-[rgb(var(--accent))]" />
            </motion.a>
          </motion.div>
        </div>

        {/* ABOUT SECTION */}
        <div ref={aboutRef} id="about" className="w-full max-w-5xl px-4 mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-baseline gap-3 mb-8"
          >
            {dict.about.title}
            <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent))]"></span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-lg lg:text-xl text-muted leading-relaxed space-y-6 max-w-4xl mb-12"
          >
            <p>{dict.about.description1}</p>
            <p>{dict.about.description2}</p>
          </motion.div>

          <SpotlightCard className="group/spotlight border-[rgb(var(--accent))]/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {skillsData.map((category) => (
                <div key={category.titleKey}>
                  <h3 className="text-lg font-medium text-primary mb-4 border-l-2 border-[rgb(var(--accent))] pl-3">
                    {dict.skills[category.titleKey]}
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-6 gap-3">
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
          </SpotlightCard>
        </div>

        {/* PROJECTS SECTION */}
        <div ref={projectsRef} id="projects" className="w-full max-w-5xl mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-baseline gap-3 mb-4">
              {dict.projects.title}
              <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent))]"></span>
            </h2>
            <p className="text-lg md:text-lg lg:text-xl text-secondary mb-12">
              {dict.projects.subtitle}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProjectCarousel projects={projectsArray} labels={projectLabels} />
          </motion.div>
        </div>

        {/* CONTACT SECTION */}
        <div ref={contactRef} id="contact" className="w-full max-w-5xl px-4 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-baseline gap-3 mb-4">
              {dict.contact.title}
              <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent))]"></span>
            </h2>
            <p className="text-lg md:text-lg lg:text-xl text-secondary mb-12 max-w-3xl">
              {dict.contact.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-[rgb(var(--accent))]" />
                <a href="mailto:hello@ericpastor.dev" className="text-lg text-secondary hover:text-primary transition-colors">hello@ericpastor.dev</a>
              </div>
              <div className="flex items-center gap-4">
                <Linkedin className="h-6 w-6 text-[rgb(var(--accent))]" />
                <a href="https://linkedin.com/in/eric-pastor-moreno" target="_blank" className="text-lg text-secondary hover:text-primary transition-colors">LinkedIn</a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-[rgb(var(--accent))]" />
                <p className="text-lg text-secondary">{dict.contact.location}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <SpotlightCard className="group/spotlight border-[rgb(var(--accent))]/30">
                <form action="https://api.web3forms.com/submit" method="POST" className="p-6 space-y-6">
                  <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY} />

                  <h3 className="text-xl font-bold text-primary flex items-center justify-center md:justify-start gap-2">
                    {dict.contact.form.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="name" placeholder={dict.contact.form.name} required className="w-full form-input rounded-lg px-4 py-2 focus:outline-none transition-colors" />
                    <input type="email" name="email" placeholder={dict.contact.form.email} required className="w-full form-input rounded-lg px-4 py-2 focus:outline-none transition-colors" />
                  </div>
                  
                  <textarea name="message" placeholder={dict.contact.form.message} required rows={4} className="w-full form-input rounded-lg px-4 py-2 focus:outline-none transition-colors"></textarea>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold btn-primary">
                    <Send className="h-4 w-4" />
                    {dict.contact.form.send}
                  </button>
                </form>
              </SpotlightCard>
            </div>
          </motion.div>
        </div>

        {/* FOOTER SECTION */}
        <div className="w-full mt-32 border-t border-adaptive">
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto px-4 py-8"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-6">
                <a 
                  href="https://github.com/ericpastorm" 
                  target="_blank" 
                  aria-label="GitHub" 
                  className="text-subtle hover:text-secondary transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a 
                  href="https://linkedin.com/in/eric-pastor-moreno" 
                  target="_blank" 
                  aria-label="LinkedIn" 
                  className="text-subtle hover:text-secondary transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a 
                  href="mailto:hello@ericpastor.dev" 
                  aria-label="Email" 
                  className="text-subtle hover:text-secondary transition-colors"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>

              <p className="text-sm text-muted">
                {dict.footer.designed}
              </p>

              <p className="text-xs text-subtle">
                © {new Date().getFullYear()} Eric Pastor. {dict.footer.rights}
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