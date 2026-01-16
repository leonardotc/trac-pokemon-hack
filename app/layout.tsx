export const metadata = {
  title: 'Pokedex',
  description: 'Pokedex with Catch button and live state',
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

