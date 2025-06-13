-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    message TEXT NOT NULL,
    selected_product VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_calls table
CREATE TABLE IF NOT EXISTS scheduled_calls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone_number VARCHAR(50),
    product_of_interest VARCHAR(255) NOT NULL,
    quantity VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table (updated to use brevo_email_id)
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    email_type VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    brevo_email_id VARCHAR(255),
    related_contact_id INTEGER REFERENCES contacts(id),
    related_call_id INTEGER REFERENCES scheduled_calls(id),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE contacts IS 'Stores contact form submissions from the website';
COMMENT ON TABLE scheduled_calls IS 'Stores scheduled call requests from users';
COMMENT ON TABLE quote_requests IS 'Stores quote requests for products';
COMMENT ON TABLE email_logs IS 'Logs all email activity with Brevo email service';

COMMENT ON COLUMN email_logs.brevo_email_id IS 'Email ID returned by Brevo API for tracking';
COMMENT ON COLUMN email_logs.email_type IS 'Type of email: contact_form, quote_request, scheduled_call, etc.';
COMMENT ON COLUMN email_logs.status IS 'Email status: sent, failed, pending';
