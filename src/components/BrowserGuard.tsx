
'use client';

import { useEffect, useState } from 'react';

/**
 * BrowserGuard - Temporary Disabled for Development
 * Allows standard browsers (Chrome, Safari, etc.) to access the Patient UI 
 * during the building and testing phase.
 */
export function BrowserGuard({ children }: { children: React.ReactNode }) {
  // Restriction removed as requested: Always allow access during development.
  return <>{children}</>;
}
