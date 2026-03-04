
-- Create a trigger function that calls the dispatch-notification edge function
-- via pg_net whenever a notification is inserted
CREATE OR REPLACE FUNCTION public.dispatch_notification_channels()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Use pg_net to call the dispatch edge function asynchronously
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/dispatch-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't block notification insert if dispatch fails
  RAISE WARNING 'dispatch_notification_channels failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create the trigger on notifications table
DROP TRIGGER IF EXISTS trg_dispatch_notification ON public.notifications;
CREATE TRIGGER trg_dispatch_notification
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.dispatch_notification_channels();
