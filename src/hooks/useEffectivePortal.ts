import { useAuth } from '@/contexts/AuthContext';
import { useAdminPreviewOptional } from '@/contexts/AdminPreviewContext';
import { PortalType, canAccessFeature } from '@/types/portal';

/**
 * Hook that provides the effective portal level for access checks.
 * This considers the admin preview mode, allowing admins to simulate
 * viewing the app as different user types.
 */
export function useEffectivePortal() {
  const { user } = useAuth();
  const preview = useAdminPreviewOptional();

  // Determine if we're in preview mode (only admins can use preview)
  const isInPreviewMode = 
    preview?.isPreviewMode && 
    preview?.previewPortal && 
    user?.portal === 'admin';

  // Get the effective portal
  const effectivePortal: PortalType = isInPreviewMode
    ? preview.previewPortal!
    : user?.portal || 'visitante';

  // Get the actual (real) portal
  const actualPortal: PortalType = user?.portal || 'visitante';

  // Check if user can access a required portal level
  const canAccess = (requiredPortal: PortalType): boolean => {
    return canAccessFeature(effectivePortal, requiredPortal);
  };

  // Check if user would have access with their real portal (ignoring preview)
  const canAccessActual = (requiredPortal: PortalType): boolean => {
    return canAccessFeature(actualPortal, requiredPortal);
  };

  // Is the user an admin (regardless of preview mode)
  const isAdmin = actualPortal === 'admin';

  return {
    // Current effective portal (considers preview mode)
    effectivePortal,
    // Actual user portal (ignores preview mode)
    actualPortal,
    // Whether preview mode is active
    isInPreviewMode,
    // The portal being previewed (null if not in preview mode)
    previewPortal: isInPreviewMode ? preview?.previewPortal : null,
    // Check access with effective portal
    canAccess,
    // Check access with actual portal (ignores preview)
    canAccessActual,
    // Is actual admin
    isAdmin,
  };
}
