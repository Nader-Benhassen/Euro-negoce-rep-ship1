-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  message TEXT NOT NULL,
  selected_product VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_calls table
CREATE TABLE IF NOT EXISTS scheduled_calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  call_date DATE NOT NULL,
  call_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'CET',
  topic VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  product VARCHAR(255) NOT NULL,
  quantity VARCHAR(100),
  delivery_location VARCHAR(255),
  additional_requirements TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table for tracking email delivery
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email_type VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  status VARCHAR(50) DEFAULT 'sent',
  resend_email_id VARCHAR(255),
  error_message TEXT,
  related_contact_id UUID REFERENCES contacts(id),
  related_call_id UUID REFERENCES scheduled_calls(id),
  related_quote_id UUID REFERENCES quote_requests(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
