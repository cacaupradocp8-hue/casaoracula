import { Navigate } from 'react-router-dom';

/**
 * Página legada do Clube (geração `club_*`, tabelas vazias e depreciadas).
 * Preservada como redirecionamento para a Home unificada do Clube.
 */
export default function ClubeEncontro() {
  return <Navigate to="/clube" replace />;
}
