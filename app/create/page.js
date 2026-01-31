'use client';

import dynamic from 'next/dynamic';

const CreateClient = dynamic(() => import('./CreateClient'), { ssr: false });

export default function CreatePage() {
  return <CreateClient />;
}
