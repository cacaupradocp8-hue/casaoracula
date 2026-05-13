
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const TEST_EMAIL = 'test_d1_clube_mensal@oracula.test';
const TEST_NAME = 'Teste Clube Mensal D1';

async function runTest() {
  console.log("--- 1. Pre-flight Checks ---");
  
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const userExists = existingUsers?.users.some(u => u.email === TEST_EMAIL);
  console.log(`Usuário ${TEST_EMAIL} já existe no auth.users? ${userExists ? 'SIM' : 'NÃO'}`);
  
  const { data: existingProfile } = await supabase.from('profiles').select('id').eq('email', TEST_EMAIL).maybeSingle();
  console.log(`Perfil com e-mail ${TEST_EMAIL} já existe? ${existingProfile ? 'SIM' : 'NÃO'}`);

  const { data: pendingMatriculas } = await supabase.from('matriculas_pendentes').select('id').eq('email', TEST_EMAIL);
  console.log(`Matrículas pendentes para ${TEST_EMAIL}: ${pendingMatriculas?.length || 0}`);

  const { data: existingSubs } = await supabase.from('subscriptions').select('id').eq('provider_subscription_id', 'TEST_EXT_CLUBE_MENSAL_D1');
  console.log(`Subscription TEST_EXT_CLUBE_MENSAL_D1 já existe? ${existingSubs?.length > 0 ? 'SIM' : 'NÃO'}`);

  if (userExists || existingProfile) {
    console.error("ERRO: Ambiente não está limpo para o teste. Usuário ou perfil já existem.");
    process.exit(1);
  }

  console.log("\n--- 2. Criação via auth.admin.createUser ---");
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    email_confirm: true,
    user_metadata: { full_name: TEST_NAME },
    app_metadata: { provider: 'email' }
  });

  if (createError) {
    console.error("Erro ao criar usuário:", createError.message);
    process.exit(1);
  }

  const userId = newUser.user.id;
  console.log(`Usuário criado com sucesso. ID: ${userId}`);

  console.log("\n--- 3. Aguardando processamento das triggers (3 segundos) ---");
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("\n--- 4. Post-flight Checks ---");
  
  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (profileError || !profile) {
    console.error("FALHA CRÍTICA: Perfil não foi criado automaticamente pela trigger handle_new_user.");
    process.exit(1);
  }
  console.log("Perfil criado automaticamente:", profile);

  const { data: userRole, error: roleError } = await supabase.from('user_roles').select('*').eq('user_id', userId).maybeSingle();
  if (roleError || !userRole) {
    console.error("FALHA CRÍTICA: user_role não foi criado automaticamente pela trigger handle_new_user.");
    process.exit(1);
  }
  console.log("User role criado automaticamente:", userRole);

  const isVisitante = profile.portal === 'visitante' && userRole.role === 'visitante';
  console.log(`Estado inicial é 'visitante'? ${isVisitante ? 'SIM' : 'NÃO'}`);

  const { data: postSubs } = await supabase.from('subscriptions').select('id').eq('user_id', userId);
  console.log(`Subscriptions encontradas para o usuário: ${postSubs?.length || 0}`);

  const { data: postMatriculas } = await supabase.from('matriculas').select('id').eq('user_id', userId);
  console.log(`Matrículas encontradas para o usuário: ${postMatriculas?.length || 0}`);

  const { data: postPending } = await supabase.from('matriculas_pendentes').select('id').eq('email', TEST_EMAIL);
  console.log(`Matrículas pendentes encontradas para o e-mail: ${postPending?.length || 0}`);

  console.log("\n--- RESUMO DA EXECUÇÃO ---");
  console.log(`ID do Usuário: ${userId}`);
  console.log(`E-mail: ${TEST_EMAIL}`);
  console.log(`Profile Portal: ${profile.portal}`);
  console.log(`User Role: ${userRole.role}`);
  console.log(`Status Final: ${isVisitante && postSubs?.length === 0 ? 'SUCESSO' : 'FALHA'}`);
}

runTest();
