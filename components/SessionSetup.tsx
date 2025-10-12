'use client';

import { useSessionSetup } from '@/lib/useSessionSetup';

export function SessionSetup() {
  useSessionSetup();
  return null; // This component only handles side effects
}