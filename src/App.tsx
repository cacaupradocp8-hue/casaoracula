import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PortalType } from "@/types/portal";

// Pages (IMPORTAR SÓ UMA VEZ)
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Biblioteca from "./pages/Biblioteca";
import Mentoria from "./pages/Mentoria";
import Travessias from "./pages/Travessias";
import Agentes from "./pages/Agentes";
import LeituraOracular from "./pages/LeituraOracular";
import Salas from "./pages/Salas";
import SalaDetalhe from "./pages/SalaDetalhe";
import PortalDetalhe from "./pages/PortalDetalhe";
import AulaPage from "./pages/AulaPage";
import Casos from "./pages/Casos";
import Metodo from "./pages/Metodo";
import Portais from "./pages/Portais";
import ConfirmarProfissional from "./pages/ConfirmarProfissional";
import MinhasClientes from "./pages/MinhasClientes";
import MapaOracula from "./pages/MapaOracula";
import QuizPage from "./pages/QuizPage";

// Salas específicas
import Big5 from "./pages/salas/Big5";
import Eneagrama from "./pages/salas/Eneagrama";
import OraculoPergu
