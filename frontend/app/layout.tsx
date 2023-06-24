import Navigation from '@/components/Navigation';
import Player from '@/components/Player';
import '../styles/globals.scss';
import ReduxProvider from './store/provider';

export const metadata = {
  title: 'Spotify',
  description: 'Spotify is a digital music service that gives you access to millions of songs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ReduxProvider>
          <main>
            <Navigation />
            <div className='paper page-content'>{children}</div>
          </main>
          <Player />
        </ReduxProvider>
      </body>
    </html>
  );
}
