import { Github, Linkedin, Mail } from 'lucide-react'

export function FooterSection() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Muhammad Usman. Built with React, Firebase, and AI.</p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/usaaman/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-lg border border-border p-2 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-usman-a76984378/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-lg border border-border p-2 transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:musmannazir97@gmail.com"
            aria-label="Email"
            className="rounded-lg border border-border p-2 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
