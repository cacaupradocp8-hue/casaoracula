
import { createClient } from '@supabase/supabase-client'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function validate() {
  const testUserId = '00000000-0000-0000-0000-000000000000' // Using a dummy UUID or real one if I find it
  const pontoId = 'test-ponto-1'
  
  console.log('--- Testing Jardim da Psique ---')
  
  // 1. Clear previous test data
  await supabase.from('jardim_psique_registros').delete().eq('user_id', testUserId).eq('ferramenta_chave', pontoId)
  
  // 2. Simulate Save 1
  const { data: save1, error: err1 } = await supabase.from('jardim_psique_registros').insert({
    user_id: testUserId,
    reflexao_pessoal: 'Test Psique 1',
    ferramenta_chave: pontoId,
    ferramenta_nome: 'Estação Teste',
    tipo_registro: 'estacao_rota'
  }).select()
  
  console.log('Save 1:', save1 ? 'Success' : 'Fail', err1 || '')
  
  // 3. Simulate Save 2 (Check for duplicates)
  const { data: save2, error: err2 } = await supabase.from('jardim_psique_registros').insert({
    user_id: testUserId,
    reflexao_pessoal: 'Test Psique 2',
    ferramenta_chave: pontoId,
    ferramenta_nome: 'Estação Teste',
    tipo_registro: 'estacao_rota'
  }).select()
  
  console.log('Save 2:', save2 ? 'Success' : 'Fail', err2 || '')
  
  // 4. Verify count
  const { count } = await supabase.from('jardim_psique_registros')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', testUserId)
    .eq('ferramenta_chave', pontoId)
    
  console.log('Total records for this point:', count)
  
  if (count && count > 1) {
    console.log('PENDENCY: Created duplicate records for the same point.')
  } else {
    console.log('VALIDATED: No duplicates created (if it was an upsert/update).')
  }

  console.log('\n--- Testing Jardim do Ofício ---')
  
  const contexto = `ponto:${pontoId}`
  await supabase.from('jardim_do_oficio').delete().eq('user_id', testUserId).eq('contexto_origem', contexto)
  
  await supabase.from('jardim_do_oficio').insert({
    user_id: testUserId,
    reflexao_profissional: 'Test Oficio 1',
    contexto_origem: contexto
  })
  
  await supabase.from('jardim_do_oficio').insert({
    user_id: testUserId,
    reflexao_profissional: 'Test Oficio 2',
    contexto_origem: contexto
  })
  
  const { count: countOficio } = await supabase.from('jardim_do_oficio')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', testUserId)
    .eq('contexto_origem', contexto)
    
  console.log('Total records for Oficio:', countOficio)
}

validate()
