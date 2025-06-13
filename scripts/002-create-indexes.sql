-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

CREATE INDEX IF NOT EXISTS idx_scheduled_calls_email ON scheduled_calls(email);
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_date ON scheduled_calls(call_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_status ON scheduled_calls(status);

CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
