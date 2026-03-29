
INSERT INTO app_settings (key, value, description)
VALUES 
  ('planos_clube_checkout_mensal_url', 'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=karv9y4bewbdjcwbmvtwq', 'URL de checkout Rockty - Plano Mensal'),
  ('planos_clube_checkout_anual_url', 'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=2tgmh6vsiki7fg0buxdfxq', 'URL de checkout Rockty - Plano Anual')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
