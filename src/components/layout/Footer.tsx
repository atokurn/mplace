"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Discriminated union type for footer sections
type FooterSection =
  | { key: string; title: string; items: { label: string; href: string }[]; custom?: never }
  | { key: string; title: string; custom: ReactNode; items?: never };

const BRAND_NAME = "FlatMarket";

// Footer with desktop boxed columns + mobile accordions (as in reference)
export default function Footer() {
  const [openKey, setOpenKey] = useState<string | null>("newsletter");

  const sections: FooterSection[] = [
    {
      key: "newsletter",
      title: "NEWSLETTER",
      items: [
        { label: "Subscribe to our newsletter", href: "/#subscribe" },
      ],
    },
    {
      key: "client",
      title: "CLIENT SERVICES",
      items: [
        { label: "FAQ", href: "/faq" },
        { label: "Track Order", href: "/orders/track" },
        { label: "Returns", href: "/returns" },
        { label: "Delivery", href: "/delivery" },
        { label: "Payment", href: "/payment" },
      ],
    },
    {
      key: "company",
      title: "THE COMPANY",
      items: [
        { label: "Careers", href: "/careers" },
        { label: "Careers - Design", href: "/careers/design" },
        { label: "Legal", href: "/legal" },
        { label: "Privacy Policy and Cookies", href: "/privacy" },
        { label: "World Food Programme", href: "/impact" },
      ],
    },
    {
      key: "follow",
      title: "FOLLOW US",
      items: [
        { label: "Facebook", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "Tiktok", href: "#" },
        { label: "Pinterest", href: "#" },
        { label: "Linkedin", href: "#" },
      ],
    },
    {
      key: "boutiques",
      title: "BOUTIQUES",
      custom: (
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="#" className="underline underline-offset-4">Find a store nearby</Link>
          </li>
          <li className="text-muted-foreground">
            Country / Region: International Version
          </li>
          <li className="text-muted-foreground">Language: English</li>
        </ul>
      ),
    },
    {
      key: "contact",
      title: "CONTACT US",
      custom: (
        <div className="text-sm space-y-2">
          <div>
            <div className="text-muted-foreground">CALL US AT</div>
            <Link href="tel:+442038186032" className="underline underline-offset-4">
              +44 20 38 18 60 32
            </Link>
          </div>
          <div>
            <Link href="mailto:hello@example.com" className="underline underline-offset-4">
              SEND US AN EMAIL
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <footer className="w-full bg-background text-foreground">
      {/* Desktop: boxed columns with solid separators */}
      <div className="hidden w-full md:block">
        <div className="border-x border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
            {sections.map((sec) => (
              <div key={sec.key} className="p-6">
                <div className="text-xs font-semibold tracking-wide">{sec.title}</div>
                <div className="mt-4 text-sm">
                  {"custom" in sec ? (
                    sec.custom
                  ) : (
                    <ul className="space-y-2">
                      {sec.items.map((it) => (
                        <li key={it.label}>
                          <Link href={it.href} className="underline underline-offset-4">
                            {it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND_NAME}</div>
        </div>
      </div>

      {/* Mobile: accordion-like using Collapsible */}
      <div className="w-full md:hidden">
        <div className="border-x border-t border-border">
          {sections.map((sec) => {
            const isOpen = openKey === sec.key;
            return (
              <Collapsible key={sec.key} open={isOpen} onOpenChange={(o) => setOpenKey(o ? sec.key : null)}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between p-4 text-sm font-medium uppercase"
                    aria-expanded={isOpen}
                    aria-controls={`section-${sec.key}`}
                  >
                    <span>{sec.title}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : undefined)} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent id={`section-${sec.key}`}>
                  <div className="border-t px-4 py-4 text-sm">
                    {"custom" in sec ? (
                      sec.custom
                    ) : (
                      <ul className="space-y-3">
                        {sec.items.map((it) => (
                          <li key={it.label}>
                            <Link href={it.href} className="underline underline-offset-4">
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CollapsibleContent>
                <div className="border-t" />
              </Collapsible>
            );
          })}
          <div className="py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND_NAME}</div>
        </div>
      </div>
    </footer>
  );
}