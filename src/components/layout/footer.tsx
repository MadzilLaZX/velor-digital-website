import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/lib/site-config";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Foundation", href: "/services#foundation" },
      { label: "Operations", href: "/services#operations" },
      { label: "Marketing Manager", href: "/services#marketing-manager" },
      { label: "Digital Department", href: "/services#digital-department" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Work", href: "/work" },
      { label: "Velor OS", href: "/velor-os" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Book a Strategy Call", href: "/book" },
      { label: "Apply for Velor OS Beta", href: "/velor-os#apply" },
      { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-hairline bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
            <Logo />
            <p className="max-w-[220px] text-sm leading-relaxed text-muted">
              Premium websites, automation, and digital systems for service businesses in
              Ottawa, Gatineau, and Ontario.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-2">
                {col.title}
              </span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover-glow-text focus-ring text-sm text-muted transition-colors duration-300 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex w-full max-w-md items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-l from-accent/60 via-hairline-strong to-transparent" />
            <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]" />
            <span className="h-px flex-1 bg-gradient-to-r from-accent/60 via-hairline-strong to-transparent" />
          </div>

          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-muted-2">
            <span className="h-px w-10 bg-gradient-to-l from-white/25 to-transparent sm:w-16" />
            <span>Designed by Velor</span>
            <span className="h-px w-10 bg-gradient-to-r from-white/25 to-transparent sm:w-16" />
          </div>

          <p className="text-xs text-muted-2">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
