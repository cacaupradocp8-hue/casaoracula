import { createClient } from 'https://esm.sh/@supabase/supabase-base-js@2';

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_EMAIL = 'test_user_d@example.com';

async function getTestUserId() {
  const { data, error } = await supabase.rpc('read_query', { 
    query: `SELECT id FROM auth.users WHERE email = '${TEST_EMAIL}' LIMIT 1` 
  });
  return data?.[0]?.id;
}

async function runTest(testName, payload) {
  console.log(`--- Running ${testName} ---`);
  const { data, error } = await supabase.rpc('process_webhook_subscription', payload);
  return { data, error };
}

async function getFinalState(userId) {
  const { data: profile } = await supabase.from('profiles').select('portal').eq('id', userId).single();
  const { data: role } = await supabase.from('user_roles').select('portal').eq('user_id', userId).single();
  const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
  return { profile, role, sub: sub?.[0] };
}

const userId = await getTestUserId();
if (!userId) {
  console.error("Test user not found");
  Deno.exit(1);
}

// D.TEST-2: Unknown Offer
const test2 = await runTest('D.TEST-2', {
  p_user_id: userId,
  p_external_subscription_id: 'TEST_EXT_UNKNOWN_D2',
  p_plan_id: 'TEST_UNKNOWN_OFFER',
  p_status: 'active',
  p_provider: 'rockty',
  p_current_period_end: new Date(Date.now() + 86400000).toISOString(),
  p_customer_id: 'TEST_CUST_D2'
});

// D.TEST-3: Clube Anual
const test3 = await runTest('D.TEST-3', {
  p_user_id: userId,
  p_external_subscription_id: 'TEST_EXT_CLUBE_ANUAL_D3',
  p_plan_id: '2tgmh6vsiki7fg0buxdfxq',
  p_status: 'active',
  p_provider: 'rockty',
  p_current_period_end: new Date(Date.now() + 365 * 86400000).toISOString(),
  p_customer_id: 'TEST_CUST_D3'
});

// D.TEST-4: Formação Orácula
const test4 = await runTest('D.TEST-4', {
  p_user_id: userId,
  p_external_subscription_id: 'TEST_EXT_FORMACAO_D4',
  p_plan_id: 'qqqmfhyjku7ou9kc70gg',
  p_status: 'active',
  p_provider: 'rockty',
  p_current_period_end: new Date(Date.now() + 365 * 86400000).toISOString(),
  p_customer_id: 'TEST_CUST_D4'
});

const finalState = await getFinalState(userId);

console.log(JSON.stringify({
  test2,
  test3,
  test4,
  finalState
}, null, 2));
