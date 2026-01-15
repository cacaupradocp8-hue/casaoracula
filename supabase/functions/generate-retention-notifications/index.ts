import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProfileWithExpiration {
  id: string
  subscription_status: string | null
  access_expires_at: string | null
}

interface NotificationData {
  user_id: string
  type: 'pre_expiracao' | 'expiracao' | 'retorno'
  title: string
  body: string
  cta_label: string
  cta_url: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    console.log('=== GENERATING RETENTION NOTIFICATIONS ===')
    console.log('Today:', today.toISOString())
    console.log('7 days from now:', sevenDaysFromNow.toISOString())
    console.log('7 days ago:', sevenDaysAgo.toISOString())
    
    // Fetch all users with access_expires_at set and subscription not active
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, subscription_status, access_expires_at')
      .not('access_expires_at', 'is', null)
      .neq('subscription_status', 'active')
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw profilesError
    }
    
    console.log(`Found ${profiles?.length || 0} profiles with expiration dates`)
    
    const notifications: NotificationData[] = []
    const logs: { user_id: string; type: string; reference_date: string }[] = []
    
    for (const profile of profiles || []) {
      if (!profile.access_expires_at) continue
      
      const expiresAt = new Date(profile.access_expires_at)
      expiresAt.setHours(0, 0, 0, 0)
      
      const expiresDateStr = expiresAt.toISOString().split('T')[0]
      
      // Check PRE-EXPIRATION (7 days before)
      const diffToExpiration = Math.floor((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffToExpiration === 7) {
        // Check if already sent
        const { data: existingLog } = await supabase
          .from('notification_logs')
          .select('id')
          .eq('user_id', profile.id)
          .eq('type', 'pre_expiracao')
          .eq('reference_date', expiresDateStr)
          .single()
        
        if (!existingLog) {
          console.log(`Creating PRE-EXPIRATION notification for user ${profile.id}`)
          notifications.push({
            user_id: profile.id,
            type: 'pre_expiracao',
            title: 'Seu acesso está prestes a encerrar',
            body: 'Seu acesso ao app se encerra em 7 dias. Seu histórico permanece. Para manter tudo ativo, veja os planos.',
            cta_label: 'Ver planos',
            cta_url: '/planos'
          })
          logs.push({
            user_id: profile.id,
            type: 'pre_expiracao',
            reference_date: expiresDateStr
          })
        }
      }
      
      // Check EXPIRATION (on the day or past)
      if (expiresAt <= today) {
        const { data: existingLog } = await supabase
          .from('notification_logs')
          .select('id')
          .eq('user_id', profile.id)
          .eq('type', 'expiracao')
          .eq('reference_date', expiresDateStr)
          .single()
        
        if (!existingLog) {
          console.log(`Creating EXPIRATION notification for user ${profile.id}`)
          notifications.push({
            user_id: profile.id,
            type: 'expiracao',
            title: 'Seu acesso foi encerrado',
            body: 'As funções profissionais estão pausadas, mas seus dados continuam intactos. Reabra quando quiser.',
            cta_label: 'Reativar acesso',
            cta_url: '/planos'
          })
          logs.push({
            user_id: profile.id,
            type: 'expiracao',
            reference_date: expiresDateStr
          })
        }
      }
      
      // Check RETURN (7 days after expiration)
      const diffFromExpiration = Math.floor((today.getTime() - expiresAt.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffFromExpiration === 7) {
        const { data: existingLog } = await supabase
          .from('notification_logs')
          .select('id')
          .eq('user_id', profile.id)
          .eq('type', 'retorno')
          .eq('reference_date', expiresDateStr)
          .single()
        
        if (!existingLog) {
          console.log(`Creating RETURN notification for user ${profile.id}`)
          notifications.push({
            user_id: profile.id,
            type: 'retorno',
            title: 'Seu espaço continua aqui',
            body: 'Clientes, registros e ferramentas seguem guardados. Você pode reativar quando for o momento.',
            cta_label: 'Ver planos',
            cta_url: '/planos'
          })
          logs.push({
            user_id: profile.id,
            type: 'retorno',
            reference_date: expiresDateStr
          })
        }
      }
    }
    
    // Insert notifications
    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications)
      
      if (insertError) {
        console.error('Error inserting notifications:', insertError)
        throw insertError
      }
      
      console.log(`Inserted ${notifications.length} notifications`)
    }
    
    // Insert logs
    if (logs.length > 0) {
      const { error: logError } = await supabase
        .from('notification_logs')
        .insert(logs)
      
      if (logError) {
        console.error('Error inserting logs:', logError)
        throw logError
      }
      
      console.log(`Inserted ${logs.length} notification logs`)
    }
    
    const result = {
      success: true,
      processed: profiles?.length || 0,
      notifications_created: notifications.length,
      breakdown: {
        pre_expiracao: notifications.filter(n => n.type === 'pre_expiracao').length,
        expiracao: notifications.filter(n => n.type === 'expiracao').length,
        retorno: notifications.filter(n => n.type === 'retorno').length
      }
    }
    
    console.log('=== RESULT ===', JSON.stringify(result))
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: unknown) {
    console.error('Error in generate-retention-notifications:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
