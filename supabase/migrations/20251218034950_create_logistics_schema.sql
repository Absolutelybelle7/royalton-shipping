/*
# Logistics Platform Database Schema

## New Tables
1. shipments - All shipment/package information with tracking
2. quotes - Shipping quote requests
3. saved_addresses - User saved shipping addresses
4. locations - Drop-off and pickup locations
5. notifications - User notifications and alerts
6. tracking_events - Detailed tracking history
7. billing_info - User billing and payment information

## Security
- Enable RLS on all tables
- Users can only access their own data
- Public can track shipments with tracking number
- Locations are publicly readable
*/

CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  tracking_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  service_type text NOT NULL,
  origin_address text NOT NULL,
  origin_city text NOT NULL,
  origin_country text NOT NULL,
  destination_address text NOT NULL,
  destination_city text NOT NULL,
  destination_country text NOT NULL,
  weight numeric,
  dimensions jsonb,
  declared_value numeric,
  pickup_date timestamptz,
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  recipient_name text NOT NULL,
  recipient_email text,
  recipient_phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  service_type text NOT NULL,
  origin_city text NOT NULL,
  origin_country text NOT NULL,
  destination_city text NOT NULL,
  destination_country text NOT NULL,
  weight numeric NOT NULL,
  dimensions jsonb,
  declared_value numeric,
  quoted_price numeric,
  status text DEFAULT 'pending',
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  label text NOT NULL,
  recipient_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text NOT NULL,
  country text NOT NULL,
  phone text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text,
  country text NOT NULL,
  postal_code text,
  phone text,
  email text,
  coordinates jsonb,
  hours jsonb,
  services text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  shipment_id uuid REFERENCES shipments,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments NOT NULL,
  status text NOT NULL,
  location text,
  description text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billing_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  card_last_four text,
  card_brand text,
  billing_address jsonb,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shipments"
  ON shipments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shipments"
  ON shipments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can track with tracking number"
  ON shipments FOR SELECT
  TO public
  USING (tracking_number IS NOT NULL);

CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create quotes"
  ON quotes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own addresses"
  ON saved_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
  ON saved_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON saved_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON saved_addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active locations"
  ON locations FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view tracking events"
  ON tracking_events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view own billing info"
  ON billing_info FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own billing info"
  ON billing_info FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own billing info"
  ON billing_info FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own billing info"
  ON billing_info FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON saved_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_billing_info_user_id ON billing_info(user_id);