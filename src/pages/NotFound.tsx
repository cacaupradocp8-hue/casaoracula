import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    console.error("404 full URL:", window.location.href);
    console.error("404 search:", location.search);
    console.error("404 state:", location.state);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center max-w-sm px-4">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">Página não encontrada</p>
        <p className="mb-6 text-xs font-mono bg-muted-foreground/10 rounded px-3 py-2 text-muted-foreground break-all">
          {window.location.href}
        </p>
        <div className="flex flex-col gap-2">
          <a href="/" className="text-primary underline hover:text-primary/90">
            Voltar para o início
          </a>
          <Link to="/jornada" className="text-primary underline hover:text-primary/90 text-sm">
            Ir para Jornada
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
