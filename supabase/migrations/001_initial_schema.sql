-- RentCheck Production Database Schema & RLS Policies
-- Supabase PostgreSQL Migration 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Profile Extension Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('seeker', 'landlord', 'moderator')) DEFAULT 'seeker',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Listings Table
CREATE TABLE IF NOT EXISTS listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    property_type TEXT CHECK (property_type IN ('Apartment', 'Condominium', 'Single-Family House', 'Townhouse', 'Studio', 'Shared Room')) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT DEFAULT 'CA',
    zip_code TEXT,
    bedrooms INTEGER DEFAULT 1,
    bathrooms NUMERIC(3, 1) DEFAULT 1.0,
    square_feet INTEGER,
    base_rent NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2) NOT NULL,
    recurring_fees NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    fee_details JSONB DEFAULT '{}'::jsonb,
    amenities TEXT[] DEFAULT '{}'::text[],
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}'::text[],
    verification_status TEXT CHECK (verification_status IN ('unverified', 'pending_review', 'verified', 'flagged_duplicate', 'suspicious')) DEFAULT 'unverified',
    verification_evidence TEXT[] DEFAULT '{}'::text[],
    moderation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Duplicate Flags Table
CREATE TABLE IF NOT EXISTS duplicate_flags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    duplicate_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    similarity_score NUMERIC(5, 4) NOT NULL,
    ai_reasoning TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed_duplicate', 'false_positive')) DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT,
    evidence_urls TEXT[] DEFAULT '{}'::text[],
    status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')) DEFAULT 'open',
    moderator_notes TEXT,
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_base_rent ON listings(base_rent);
CREATE INDEX IF NOT EXISTS idx_listings_verification_status ON listings(verification_status);
CREATE INDEX IF NOT EXISTS idx_listings_landlord ON listings(landlord_id);
CREATE INDEX IF NOT EXISTS idx_duplicate_flags_orig ON duplicate_flags(original_listing_id);
CREATE INDEX IF NOT EXISTS idx_duplicate_flags_dup ON duplicate_flags(duplicate_listing_id);
CREATE INDEX IF NOT EXISTS idx_duplicate_flags_status ON duplicate_flags(status);
CREATE INDEX IF NOT EXISTS idx_reports_listing ON reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplicate_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings Policies
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone" 
    ON listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Landlords can insert listings" ON listings;
CREATE POLICY "Landlords can insert listings" 
    ON listings FOR INSERT WITH CHECK (auth.uid() = landlord_id);

DROP POLICY IF EXISTS "Landlords can update their own listings" ON listings;
CREATE POLICY "Landlords can update their own listings" 
    ON listings FOR UPDATE USING (
        auth.uid() = landlord_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    );

DROP POLICY IF EXISTS "Landlords can delete their own listings" ON listings;
CREATE POLICY "Landlords can delete their own listings" 
    ON listings FOR DELETE USING (
        auth.uid() = landlord_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    );

-- Duplicate Flags Policies
DROP POLICY IF EXISTS "Duplicate flags viewable by everyone" ON duplicate_flags;
CREATE POLICY "Duplicate flags viewable by everyone" 
    ON duplicate_flags FOR SELECT USING (true);

DROP POLICY IF EXISTS "System or moderators can insert duplicate flags" ON duplicate_flags;
CREATE POLICY "System or moderators can insert duplicate flags" 
    ON duplicate_flags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Moderators can update duplicate flags" ON duplicate_flags;
CREATE POLICY "Moderators can update duplicate flags" 
    ON duplicate_flags FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    );

-- Reports Policies
DROP POLICY IF EXISTS "Users can create reports" ON reports;
CREATE POLICY "Users can create reports" 
    ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

DROP POLICY IF EXISTS "Reports viewable by moderators and reporters" ON reports;
CREATE POLICY "Reports viewable by moderators and reporters" 
    ON reports FOR SELECT USING (
        auth.uid() = reporter_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    );

DROP POLICY IF EXISTS "Moderators can update reports" ON reports;
CREATE POLICY "Moderators can update reports" 
    ON reports FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator')
    );
