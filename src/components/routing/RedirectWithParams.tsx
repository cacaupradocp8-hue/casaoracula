import { Navigate, useParams } from 'react-router-dom';

interface RedirectWithParamsProps {
  to: string; // e.g. "/casa-das-maquinas/clientes/:clienteId/mapa-cidadela"
}

/**
 * A redirect component that preserves route params.
 * Usage: <Route path="/old/:id" element={<RedirectWithParams to="/new/:id" />} />
 */
export default function RedirectWithParams({ to }: RedirectWithParamsProps) {
  const params = useParams();
  let resolvedPath = to;
  for (const [key, value] of Object.entries(params)) {
    if (key !== '*' && value) {
      resolvedPath = resolvedPath.replace(`:${key}`, value);
    }
  }
  return <Navigate to={resolvedPath} replace />;
}
