-- Enable RLS and set default policies for the contacts table
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts FORCE ROW LEVEL SECURITY; -- Ensures RLS is applied even for table owners

-- Policy: Allow authenticated users to insert into contacts (e.g., via API routes if not using service_role strictly)
-- The actual data validation should occur in your API routes.
CREATE POLICY "Allow authenticated inserts for contacts"
ON public.contacts
FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy: Deny select, update, delete for anonymous and general authenticated users on contacts
-- API routes using service_role will bypass this.
CREATE POLICY "Deny public select on contacts"
ON public.contacts
FOR SELECT TO anon, authenticated
USING (false);

CREATE POLICY "Deny public update on contacts"
ON public.contacts
FOR UPDATE TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete on contacts"
ON public.contacts
FOR DELETE TO anon, authenticated
USING (false);

-- Enable RLS and set default policies for the scheduled_calls table
ALTER TABLE public.scheduled_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_calls FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated inserts for scheduled_calls"
ON public.scheduled_calls
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Deny public select on scheduled_calls"
ON public.scheduled_calls
FOR SELECT TO anon, authenticated
USING (false);

CREATE POLICY "Deny public update on scheduled_calls"
ON public.scheduled_calls
FOR UPDATE TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete on scheduled_calls"
ON public.scheduled_calls
FOR DELETE TO anon, authenticated
USING (false);

-- Enable RLS and set default policies for the quote_requests table
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated inserts for quote_requests"
ON public.quote_requests
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Deny public select on quote_requests"
ON public.quote_requests
FOR SELECT TO anon, authenticated
USING (false);

CREATE POLICY "Deny public update on quote_requests"
ON public.quote_requests
FOR UPDATE TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete on quote_requests"
ON public.quote_requests
FOR DELETE TO anon, authenticated
USING (false);

-- Enable RLS and set default policies for the email_logs table
-- This table should generally only be accessed by the service_role.
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY "Deny public select on email_logs"
ON public.email_logs
FOR SELECT TO anon, authenticated
USING (false);

-- Deny inserts from anon/authenticated roles; should only be done server-side with service_role
CREATE POLICY "Deny public insert on email_logs"
ON public.email_logs
FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny public update on email_logs"
ON public.email_logs
FOR UPDATE TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete on email_logs"
ON public.email_logs
FOR DELETE TO anon, authenticated
USING (false);

-- Insert success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS enabled and default policies applied to contacts, scheduled_calls, quote_requests, and email_logs tables.';
END $$;
