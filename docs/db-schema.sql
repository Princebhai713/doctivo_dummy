
-- DOCTIVO PLATFORM - Master Database Schema (PostgreSQL Optimized)

-- [6] ADMINS Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id TEXT PRIMARY KEY, -- Firebase Auth UID
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Sub_Admin', -- 'Super_Admin' or 'Sub_Admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [1] PATIENTS Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id TEXT PRIMARY KEY, -- Firebase Auth UID
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT,
    age INTEGER,
    gender TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    blood_group TEXT,
    state TEXT,
    city TEXT,
    area_society TEXT,
    pincode TEXT,
    onboarding_symptoms JSONB DEFAULT '[]',
    past_medical_history TEXT,
    allergies_medications TEXT,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [2] FAMILY_MEMBERS Table
CREATE TABLE IF NOT EXISTS family_members (
    member_id TEXT PRIMARY KEY,
    primary_user_id TEXT REFERENCES patients(patient_id) ON DELETE CASCADE,
    relationship TEXT NOT NULL, -- 'Mother', 'Father', 'Child', 'Spouse', 'Other'
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    blood_group TEXT,
    member_medical_history TEXT,
    member_allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [3] DOCTORS Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id TEXT PRIMARY KEY, -- Firebase Auth UID
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT,
    experience_years INTEGER,
    consultation_fee INTEGER DEFAULT 0,
    clinic_address TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    added_by TEXT REFERENCES admins(admin_id),
    working_days JSONB DEFAULT '[]', -- ["Monday", "Tuesday"]
    available_slots JSONB DEFAULT '[]', -- ["10:00 AM", "10:30 AM"]
    blocked_holidays JSONB DEFAULT '[]', -- ["2026-06-15"]
    blocked_slots JSONB DEFAULT '[]', -- ["2026-06-12_11:00AM"]
    allowed_free_attendants INTEGER DEFAULT 1,
    total_purchased_slots INTEGER DEFAULT 0,
    current_active_campaign TEXT,
    campaign_validity_end DATE,
    allow_revenue_deduction BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [4] ATTENDANTS Table
CREATE TABLE IF NOT EXISTS attendants (
    attendant_id TEXT PRIMARY KEY, -- Firebase Auth UID
    doctor_id TEXT REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    account_status TEXT DEFAULT 'Active', -- 'Active' / 'Blocked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [5] APPOINTMENTS Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id TEXT PRIMARY KEY,
    doctor_id TEXT REFERENCES doctors(doctor_id),
    doctor_name TEXT,
    booked_by_user_id TEXT REFERENCES patients(patient_id),
    patient_type TEXT DEFAULT 'Self', -- 'Self' or 'Family_Member'
    patient_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time_slot TEXT NOT NULL,
    current_symptoms TEXT,
    consultation_fee_amount INTEGER DEFAULT 0,
    payment_status TEXT DEFAULT 'Pending', -- 'Paid', 'Failed', 'Pending'
    payment_mode TEXT, -- 'Online_UPI', 'Online_Card'
    transaction_id TEXT,
    payment_timestamp TIMESTAMP WITH TIME ZONE,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_by TEXT, -- 'Patient', 'Doctor', 'Admin'
    cancellation_reason TEXT,
    refund_status TEXT DEFAULT 'Not Applicable',
    refund_transaction_id TEXT,
    status TEXT DEFAULT 'Confirmed', -- 'Pending', 'Confirmed', 'Waiting', 'In Consultation', 'Completed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for optimized searching
CREATE INDEX idx_patients_phone ON patients(phone_number);
CREATE INDEX idx_family_members_primary ON family_members(primary_user_id);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(booked_by_user_id);
CREATE INDEX idx_attendants_doctor ON attendants(doctor_id);
