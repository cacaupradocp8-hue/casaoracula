import { useAuth } from '@/contexts/AuthContext';
import { Course, CourseEnrollment } from '@/types/course';

export function useCourseAccess() {
  const { user } = useAuth();

  const hasAccess = (course: Course, enrollment: CourseEnrollment | null): boolean => {
    // Admin always has access
    if (user?.portal === 'admin') return true;

    // Free courses with appropriate portal
    if (course.pricing_model === 'free') {
      return hasPortalAccess(course.portal_minimo);
    }

    // Check active enrollment
    if (enrollment?.ativo) {
      if (!enrollment.data_fim) return true;
      return new Date(enrollment.data_fim) > new Date();
    }

    return false;
  };

  const hasPortalAccess = (minPortal: string): boolean => {
    if (!user) return minPortal === 'visitante';
    
    const portalHierarchy: Record<string, number> = {
      'visitante': 0,
      'pre_iniciada': 1,
      'iniciada': 2,
      'admin': 3
    };

    const userLevel = portalHierarchy[user.portal] ?? 0;
    const requiredLevel = portalHierarchy[minPortal] ?? 0;

    return userLevel >= requiredLevel;
  };

  const getLockReason = (course: Course, enrollment: CourseEnrollment | null): string | null => {
    if (hasAccess(course, enrollment)) return null;

    if (!hasPortalAccess(course.portal_minimo)) {
      return 'Seu nível de acesso não permite visualizar este curso.';
    }

    if (course.pricing_model === 'one_time') {
      return 'Este curso requer compra para acessar o conteúdo completo.';
    }

    if (course.pricing_model === 'subscription') {
      return 'Este curso está disponível apenas para assinantes.';
    }

    return 'Você não tem acesso a este curso.';
  };

  const canPreview = (course: Course): boolean => {
    // Anyone can see published courses in catalog
    return course.publicado;
  };

  return {
    hasAccess,
    hasPortalAccess,
    getLockReason,
    canPreview,
    isAdmin: user?.portal === 'admin'
  };
}
