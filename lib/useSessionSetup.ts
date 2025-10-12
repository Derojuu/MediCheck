'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useSessionSetup() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    const setupSession = async () => {
      if (!isLoaded || !user) return;

      try {
        console.log('Setting up user session...');
        const response = await fetch('/api/auth/session-setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Session setup successful:', data);
          
          // If user is an organization member with a specific type, redirect to correct dashboard
          if (data.user.role === 'ORGANIZATION_MEMBER' && data.user.organizationType) {
            const orgRoutes: Record<string, string> = {
              drug_distributor: "/dashboard/drug-distributor",
              hospital: "/dashboard/hospital",
              manufacturer: "/dashboard/manufacturer", 
              pharmacy: "/dashboard/pharmacy",
              regulator: "/dashboard/regulator",
            };
            
            const correctRoute = orgRoutes[data.user.organizationType.toLowerCase()];
            if (correctRoute && !window.location.pathname.startsWith(correctRoute)) {
              console.log('Redirecting to correct dashboard:', correctRoute);
              router.push(correctRoute);
              return;
            }
          }
          
          setIsSetupComplete(true);
        } else {
          console.error('Session setup failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during session setup:', error);
      }
    };

    // Only setup if user is loaded and we haven't completed setup yet
    if (isLoaded && user && !isSetupComplete) {
      setupSession();
    }
  }, [user, isLoaded, router, isSetupComplete]);

  return { isSetupComplete };
}