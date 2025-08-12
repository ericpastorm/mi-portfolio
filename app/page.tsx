// app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react"; 
import AnimatedSection from "@/components/AnimatedSection";
import { NavigationMenu } from "@/components/NavigationMenu";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useInView } from "react-intersection-observer";
import { skillsData } from '@/data/skills';
import { SkillCard } from '@/components/SkillCard';
import { projectsData } from "@/data/projects";
import { ProjectCarousel } from "@/components/ProjectCarousel";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("#home");
  const options = { threshold: 0.3 }; // Umbral para considerar una sección como "visible"
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

  return (
    <>
      <main className="flex flex-col items-center justify-start p-4 py-16">
        {/* SECCIÓN 1: HERO */}
        <div ref={homeRef} id="home" className="flex flex-col items-center justify-center text-center min-h-screen -mt-16">
          <div className="mb-6 flex items-center gap-2 availability-badge px-3 py-1 rounded-full text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full status-dot-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 status-dot"></span>
            </span>
            Disponible para proyectos
          </div>
          <h1 className="text-5xl md:text-7xl font-bold title-gradient pb-4">
            Hola, soy Eric
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted max-w-4xl leading-relaxed">
            <span className="text-[rgb(var(--accent))] font-medium">
              Desarrollador de software
            </span>{" "}
            multiplataforma, dedicado a transformar ideas en experiencias interactivas para{" "}
            <span className="text-[rgb(var(--accent))] font-medium">
              cualquier pantalla que imagines
            </span>.
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

        {/* SECCIÓN 2: SOBRE MÍ Y HABILIDADES*/}
        <div ref={aboutRef} id="about" className="w-full max-w-5xl px-4 mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-baseline gap-3 mb-8"
          >
            Sobre Mí
            <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent))]"></span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-lg lg:text-xl text-muted leading-relaxed space-y-6 max-w-4xl mb-12"
          >
            <p>
              Mi trabajo consiste en transformar problemas complejos en soluciones de software eficientes y elegantes. Como desarrollador, mi pasión no solo reside en escribir código limpio, sino en construir la herramienta que cada proyecto necesita. 
            </p>
            <p>
              Me mantengo en constante aprendizaje, explorando activamente desde el desarrollo web y móvil hasta la inteligencia artificial, lo que me permite aportar una visión integral y actualizada a cada desafío.
            </p>
          </motion.div>

          <SpotlightCard className="group/spotlight border-[rgb(var(--accent))]/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {skillsData.map((category) => (
                <div key={category.title}>
                  <h3 className="text-lg font-medium text-primary mb-4 border-l-2 border-[rgb(var(--accent))] pl-3">
                    {category.title}
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
        {/* SECCIÓN 3: PROYECTOS */}
        <div ref={projectsRef} id="projects" className="w-full max-w-5xl mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-baseline gap-3 mb-4">
              Proyectos
              <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent))]"></span>
            </h2>
            <p className="text-lg md:text-lg lg:text-xl text-secondary mb-12">
              Una selección de los proyectos en los que he trabajado.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProjectCarousel projects={projectsData} />
          </motion.div>
        </div>

        {/* SECCIÓN 4: CONTACTO*/}
        <div ref={contactRef} id="contact" className="w-full max-w-5xl px-4 mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold flex items-baseline gap-3 mb-4">
              Contacto
              <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent))]"></span>
            </h2>
            <p className="text-lg md:text-lg lg:text-xl text-secondary mb-12 max-w-3xl">
              ¿Tienes un proyecto en mente o simplemente quieres saludar? Estaré encantado de escucharte. ¡Creemos algo increíble juntos!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Columna Izquierda: Datos de Contacto */}
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
                <p className="text-lg text-secondary">Tarragona, España</p>
              </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="lg:col-span-2">
              <SpotlightCard className="group/spotlight border-[rgb(var(--accent))]/30">
                <form action="https://api.web3forms.com/submit" method="POST" className="p-6 space-y-6">
                  <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY}  />

                  <h3 className="text-xl font-bold text-primary flex items-center justify-center md:justify-start gap-2">
                    Escríbeme 👋
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="name" placeholder="Tu nombre" required className="w-full form-input rounded-lg px-4 py-2 focus:outline-none transition-colors" />
                    <input type="email" name="email" placeholder="Tu dirección de email" required className="w-full form-input rounded-lg px-4 py-2 focus:outline-none transition-colors" />
                  </div>
                  
                  <textarea name="message" placeholder="¿En qué puedo ayudarte?" required rows={4} className="w-full form-input rounded-lg px-4 py-2 focus:outline-none transition-colors"></textarea>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold btn-primary">
                    <Send className="h-4 w-4" />
                    Enviar Mensaje
                  </button>
                </form>
              </SpotlightCard>
            </div>
          </motion.div>
        </div>

      {/* SECCIÓN 5: FOOTER */}
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
              Diseñado y desarrollado por Eric Pastor
            </p>

            <p className="text-xs text-subtle">
              © {new Date().getFullYear()} Eric Pastor. Todos los derechos reservados.
            </p>
          </div>
        </motion.footer>
      </div>
      </main>

      <NavigationMenu activeSection={activeSection} />
    </>
  );
}