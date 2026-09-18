-- Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    transmission TEXT NOT NULL,
    fuel TEXT NOT NULL,
    seats INTEGER NOT NULL,
    doors INTEGER NOT NULL,
    mileage TEXT NOT NULL,
    price_per_day INTEGER NOT NULL,
    available BOOLEAN DEFAULT true,
    insurance_start TEXT,
    insurance_end TEXT,
    vignette_start TEXT,
    vignette_end TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    dates TEXT NOT NULL,
    message TEXT NOT NULL,
    handled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Agency Table (Single row)
CREATE TABLE IF NOT EXISTS agency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    hours TEXT NOT NULL,
    phone1 TEXT NOT NULL,
    phone2 TEXT NOT NULL,
    maps_url TEXT NOT NULL
);

-- Insert initial agency data if empty
INSERT INTO agency (name, address, hours, phone1, phone2, maps_url)
SELECT
    'ALLAOUA Location (Ets ACHOURI)',
    'Cité 50 logements, Seddouk 06011, Algérie',
    'Ouvert 24h/24 — 7j/7',
    '0770646557',
    '0540845843',
    'https://maps.google.com/maps?q=GMWP%2BPM%20Seddouk%2C%20Alg%C3%A9rie&z=15&output=embed'
WHERE NOT EXISTS (SELECT 1 FROM agency);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency ENABLE ROW LEVEL SECURITY;

-- Vehicles: Everyone can read, only admin can modify
CREATE POLICY "Public can view vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Admin can modify vehicles" ON vehicles USING (auth.role() = 'authenticated');

-- Services: Everyone can read, only admin can modify
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Admin can modify services" ON services USING (auth.role() = 'authenticated');

-- Messages: Public can insert, only admin can view/modify
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view and modify messages" ON messages USING (auth.role() = 'authenticated');

-- Agency: Everyone can read, only admin can modify
CREATE POLICY "Public can view agency" ON agency FOR SELECT USING (true);
CREATE POLICY "Admin can modify agency" ON agency USING (auth.role() = 'authenticated');
