import './globals.css';

export const metadata = {
  title: 'MarginGuard',
  description: 'Site Variation & Profit Protector',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F12] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
