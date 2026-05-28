import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'VedaAI — AI Assessment Creator & Exam Paper Builder',
  description: 'Design high-quality educational assessments, select custom question counts, upload referenced syllabus files, and compile robust exam papers instantly via active background Gemini AI workers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#EFEFEF]">
        {children}
      </body>
    </html>
  );
}
