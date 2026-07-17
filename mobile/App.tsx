import React from 'react';
import { AppProviders } from '@/shared/providers';
import { RootNavigator } from '@/navigation';

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
