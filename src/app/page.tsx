'use client';

import dynamic from 'next/dynamic';
import { HomeSkeleton } from '../components/Skeleton';

const App = dynamic(() => import('./App'), {
  ssr: false,
  loading: () => <HomeSkeleton />,
});

export default function Home() {
  return <App />;
}
