import './globals.css';

export const metadata = {
  title: 'VSB Student Information Portal',
  description: 'Official Student Database & Academic Information Management System for VSB Engineering College',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F0F4FA] text-slate-900 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
