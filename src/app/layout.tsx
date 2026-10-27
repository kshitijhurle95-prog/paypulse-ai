import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';

export const metadata: Metadata = {
  title: 'PayPulse AI — The "Talk-to-Your-Money" Business Helper',
  description:
    'Conversational PayPal Store Manager & Zero-Dashboard Financial Workbench. Built with xAI Grok, PayPal Sandbox, and AG Grid for the PayPal and AI Global Hackathon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-app-bg">
      <body className="h-full flex flex-col antialiased text-fintech-text">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
