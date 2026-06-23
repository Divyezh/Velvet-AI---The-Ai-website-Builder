import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ChatWidget from "@/app/components/ChatWidget/ChatWidget";
import SmoothScroll from "@/app/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Website Builder | Live Dashboard Compiler",
  description: "A premium AI website builder delivering custom SaaS and data-driven portals instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="hydration-fix" strategy="beforeInteractive">
          {`
            (function() {
              const clear = (el) => {
                if (el.removeAttribute) {
                  el.removeAttribute('bis_skin_checked');
                  el.removeAttribute('bis_register');
                  el.removeAttribute('fdprocessedid');
                }
              };
              clear(document.documentElement);
              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === 'attributes') {
                    clear(mutation.target);
                  } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === 1) {
                        clear(node);
                        node.querySelectorAll('[bis_skin_checked], [bis_register], [fdprocessedid]').forEach(clear);
                      }
                    });
                  }
                }
              });
              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['bis_skin_checked', 'bis_register', 'fdprocessedid']
              });
            })();
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        <SmoothScroll>
          {children}
          <ChatWidget />
        </SmoothScroll>
      </body>
    </html>
  );
}
