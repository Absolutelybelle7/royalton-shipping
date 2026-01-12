import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to normalize network and supabase errors
async function safeQuery<T>(op: any): Promise<{ data: T | null; error: Error | null }> {
  try {
    const res = await (op as any);
    // supabase client sometimes returns shapes like { data, error }
    if (res && typeof res === 'object' && ('error' in res)) {
      if (res.error) {
        return { data: null, error: new Error(res.error.message || String(res.error)) };
      }
      return { data: res.data ?? null, error: null };
    }
    return { data: res ?? null, error: null };
  } catch (err: any) {
    // Network errors often surface as TypeError: Failed to fetch
    if (err instanceof TypeError) {
      return { data: null, error: new Error('Network error: failed to fetch. Check SUPABASE_URL, network connectivity and CORS settings.') };
    }
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function isAdminUser(userId?: string): Promise<boolean> {
  // if userId not provided, try to read current authenticated user
  let uid = userId;
  if (!uid) {
    try {
      const res = await supabase.auth.getUser();
      uid = res.data.user?.id ?? undefined;
    } catch (e) {
      uid = undefined;
    }
  }

  if (!uid) return false;

  const { data, error } = await safeQuery<{ role: string }>(supabase.from('admins').select('role').eq('user_id', uid).limit(1).maybeSingle() as any);
  if (error) {
    console.warn('isAdminUser error:', error.message);
    return false;
  }
  return !!data;
}

export async function promoteUserByEmail(email: string) {
  return await safeQuery(supabase.rpc('promote_user_by_email', { target_email: email }));
}

export async function demoteUserByEmail(email: string) {
  return await safeQuery(supabase.rpc('demote_user_by_email', { target_email: email }));
}

export async function checkSupabaseConnectivity() {
  const { error } = await safeQuery<any>(supabase.from('locations').select('id').limit(1) as any);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
export type Database = {
  public: {
    Tables: {
      shipments: {
        Row: {
          id: string;
          user_id: string | null;
          tracking_number: string;
          status: string;
          service_type: string;
          origin_address: string;
          origin_city: string;
          origin_country: string;
          destination_address: string;
          destination_city: string;
          destination_country: string;
          weight: number | null;
          dimensions: { length: number; width: number; height: number } | null;
          declared_value: number | null;
          pickup_date: string | null;
          estimated_delivery: string | null;
          actual_delivery: string | null;
          recipient_name: string;
          recipient_email: string | null;
          recipient_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          user_id: string | null;
          service_type: string;
          origin_city: string;
          origin_country: string;
          destination_city: string;
          destination_country: string;
          weight: number;
          dimensions: any;
          declared_value: number | null;
          quoted_price: number | null;
          status: string;
          valid_until: string | null;
          created_at: string;
        };
      };
      saved_addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          recipient_name: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string | null;
          postal_code: string;
          country: string;
          phone: string | null;
          is_default: boolean;
          created_at: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: string;
          city: string;
          state: string | null;
          country: string;
          postal_code: string | null;
          phone: string | null;
          email: string | null;
          coordinates: { lat: number; lng: number } | null;
          hours: Record<string, string> | null;
          services: string[];
          is_active: boolean;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          shipment_id: string | null;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
      };
      tracking_events: {
        Row: {
          id: string;
          shipment_id: string;
          status: string;
          location: string | null;
          description: string;
          timestamp: string;
        };
      };
      billing_info: {
        Row: {
          id: string;
          user_id: string;
          card_last_four: string | null;
          card_brand: string | null;
          billing_address: Record<string, string> | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      admins: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_by: string | null;
          created_at: string;
        };
      };
      admin_logs: {
        Row: {
          id: string;
          actor: string | null;
          action: string;
          target: string | null;
          details: Record<string, any> | null;
          created_at: string;
        };
      };
    };
  };
};
