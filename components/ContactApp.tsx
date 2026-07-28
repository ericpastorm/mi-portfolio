// components/ContactApp.tsx
"use client";

import { Linkedin, Mail, MapPin, Send } from "lucide-react";
import type { Dictionary } from "@/types";

export function ContactApp({ dict }: { dict: Dictionary }) {
  return (
    <div>
      <p className="text-base md:text-lg text-secondary mb-8 max-w-2xl">
        {dict.contact.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div className="lg:col-span-1 space-y-5">
          <div className="flex items-center gap-3.5">
            <span className="btn-metal flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Mail className="h-5 w-5" />
            </span>
            <a href="mailto:hello@ericpastor.dev" className="text-sm md:text-base text-secondary hover:text-primary transition-colors break-all">hello@ericpastor.dev</a>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="btn-metal flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Linkedin className="h-5 w-5" />
            </span>
            <a href="https://linkedin.com/in/eric-pastor-moreno" target="_blank" className="text-sm md:text-base text-secondary hover:text-primary transition-colors">LinkedIn</a>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="btn-metal flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <MapPin className="h-5 w-5" />
            </span>
            <p className="text-sm md:text-base text-secondary">{dict.contact.location}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="inset-panel p-5 md:p-6">
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5">
              <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY} />

              <h3 className="led-chip">
                {dict.contact.form.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
  );
}
