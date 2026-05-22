-- =====================================================
-- Car Rental System - Supabase PostgreSQL Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    license_number TEXT,
    license_expiry DATE,
    date_of_birth DATE,
    address JSONB DEFAULT '{}',
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VEHICLES TABLE
-- =====================================================
CREATE TABLE public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2030),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
    category TEXT NOT NULL CHECK (category IN ('Economy', 'Compact', 'Sedan', 'SUV', 'Luxury', 'Van', 'Sports', 'Electric')),
    specs JSONB NOT NULL DEFAULT '{
        "fuel": "Gasoline",
        "transmission": "Automatic",
        "seats": 5,
        "doors": 4,
        "luggage": 3,
        "ac": true,
        "gps": false
    }',
    image_urls TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'retired')),
    color TEXT,
    plate TEXT UNIQUE NOT NULL,
    mileage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESERVATIONS TABLE
-- =====================================================
CREATE TABLE public.reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    pickup_location TEXT NOT NULL DEFAULT 'Downtown Office',
    return_location TEXT NOT NULL DEFAULT 'Downtown Office',
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'cancelled', 'refunded')),
    reservation_status TEXT DEFAULT 'pending' CHECK (reservation_status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure return date is after pickup date
    CONSTRAINT valid_date_range CHECK (return_date > pickup_date)
);

-- =====================================================
-- PREVENT DOUBLE-BOOKING FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION check_vehicle_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.reservations
        WHERE vehicle_id = NEW.vehicle_id
        AND id != COALESCE(NEW.id, uuid_generate_v4())
        AND reservation_status NOT IN ('cancelled')
        AND payment_status NOT IN ('cancelled', 'refunded')
        AND (
            (NEW.pickup_date, NEW.return_date) OVERLAPS (pickup_date, return_date)
        )
    ) THEN
        RAISE EXCEPTION 'Vehicle is not available for the selected dates. Double-booking detected.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_double_booking
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION check_vehicle_availability();

-- =====================================================
-- AUTO-UPDATE TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- VEHICLES policies (public read, admin write)
CREATE POLICY "Anyone can view available vehicles"
ON public.vehicles FOR SELECT
USING (status != 'retired');

CREATE POLICY "Admins can insert vehicles"
ON public.vehicles FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update vehicles"
ON public.vehicles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete vehicles"
ON public.vehicles FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- RESERVATIONS policies
CREATE POLICY "Users can view their own reservations"
ON public.reservations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations"
ON public.reservations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reservations"
ON public.reservations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update reservations"
ON public.reservations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_vehicles_category ON public.vehicles(category);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_daily_rate ON public.vehicles(daily_rate);
CREATE INDEX idx_reservations_vehicle_id ON public.reservations(vehicle_id);
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX idx_reservations_dates ON public.reservations(pickup_date, return_date);
CREATE INDEX idx_reservations_status ON public.reservations(reservation_status);
CREATE INDEX idx_reservations_payment ON public.reservations(payment_status);

-- =====================================================
-- SEED DATA (Sample Vehicles)
-- =====================================================
-- See src/data/vehicles.ts for the full fleet of 32 vehicles
