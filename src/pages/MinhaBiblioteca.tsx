import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ChevronRight,
  Library,
  Search,
  Calendar,
  Lock,
  FileDown,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMinhaBiblioteca, FiltroPeriodo } from '@/hooks/useMinhaBiblioteca';
import {
  BibliotecaTabs,
  BibliotecaTimeline,
} from '@/components/biblioteca-pessoal';

// ════════════════════════════════════════════════════════════════════════════
// PERIOD OPTIONS
// ════════════════════════════════════════════════════════════════════════════

const PERIOD_OPTIONS: { value: FiltroPeriodo; label: string }[] = [
  { value: 'todos', label: 'Todo o período' },
  { value: 'semana', label: 'Última semana' },
  { value: 'mes', label: 'Último mês' },
  { value: '3meses', label: 'Últimos 3 meses' },
];

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════

export default function MinhaBiblioteca() {
  const {
    registros,
    contagem,
    isLoading,
    filters,
    setTipo,
    setPeriodo,
    setBusca,
  } = useMinhaBiblioteca();

  const isFiltered =
    filters.tipo !== 'todos' ||
    filters.periodo !== 'todos' ||
    filters.busca.trim() !== '';

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            to="/jornada"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="w-3 h-3" />
            Jornada
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Minha Biblioteca</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
            <Library className="w-7 h-7 text-gold" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-2">
            Minha Biblioteca
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Seu espaço pessoal de memórias e aprendizados — tudo que você salvou durante sua jornada.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <BibliotecaTabs
            value={filters.tipo}
            onChange={setTipo}
            contagem={contagem}
          />
        </motion.div>

        {/* Filters Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={filters.busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Period Filter */}
          <Select
            value={filters.periodo}
            onValueChange={(v) => setPeriodo(v as FiltroPeriodo)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BibliotecaTimeline
            registros={registros}
            isLoading={isLoading}
            isFiltered={isFiltered}
          />
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-full px-4 py-2">
            <Lock className="w-3 h-3" />
            <span>Tudo aqui é 100% privado. Nenhum admin vê seus registros.</span>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
