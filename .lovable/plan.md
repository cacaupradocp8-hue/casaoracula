

## Plan: Create Training Database Tables

Apply the migration to create 6 new `co_training_*` tables for the Sala de Treinamento simulator.

### Database Migration

Create these tables with the `co_` prefix convention:

1. **co_training_cases** - Simulated clinical cases with reference answers
2. **co_training_case_signals** - Observable signals per case (relational, replaces array)
3. **co_training_case_possible_readings** - Expected/acceptable/common-error readings
4. **co_training_case_feedbacks** - Conditional feedback by type (coerente/ajuste/erro)
5. **co_training_attempts** - Student response records
6. **co_training_progress** - Aggregated progress per student

All tables use UUID PKs, proper foreign keys with CASCADE, and relevant indexes on `case_id` and `user_id`. No RLS in this step.

### Post-Migration: Update Simulator Components

After tables are created, update the existing simulator components to use the new relational structure:

1. **Update `types.ts`** - New interfaces matching `co_training_cases`, signals, readings, feedbacks
2. **Update `SimuladorConducao.tsx`** - Query `co_training_cases` + join signals; save to `co_training_attempts` and `co_training_progress`
3. **Update `BlocoFeedback.tsx`** - Use `co_training_case_feedbacks` and `co_training_case_possible_readings` for richer conditional feedback
4. **Update remaining bloco components** as needed for the new data shape

### Files Affected
- `src/components/treinamento/simulador/types.ts`
- `src/components/treinamento/simulador/SimuladorConducao.tsx`
- `src/components/treinamento/simulador/BlocoFeedback.tsx`
- `src/components/treinamento/simulador/BlocoCaso.tsx`
- `src/components/treinamento/simulador/BlocoLeitura.tsx`

