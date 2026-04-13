/**
 * DAL — Subscriptions Service
 * Subscription state and history.
 */

import { supabase } from './dbClient';

export async function getActiveSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, user_id, provider, plan_id, status, current_period_start, current_period_end, next_billing_date, created_at')
    .eq('user_id', userId)
    .in('status', ['active', 'past_due'])
    .order('created_at', { ascending: false })
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSubscriptionHistory(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, provider, plan_id, status, current_period_start, current_period_end, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
