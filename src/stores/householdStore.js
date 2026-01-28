import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useHouseholdStore = create((set, get) => ({
    households: [],
    currentHousehold: null,
    loading: false,
    error: null,

    // Fetch all households (for caseworkers/admin)
    fetchHouseholds: async (caseworkerId = null) => {
        set({ loading: true, error: null });
        try {
            let query = supabase
                .from('households')
                .select(`
                    *,
                    head:profiles!households_head_of_household_id_fkey(id, full_name, phone),
                    caseworker:profiles!households_assigned_caseworker_id_fkey(id, full_name),
                    members:profiles!profiles_household_fkey(id, full_name, gender, date_of_birth)
                `)
                .order('created_at', { ascending: false });

            if (caseworkerId) {
                query = query.eq('assigned_caseworker_id', caseworkerId);
            }

            const { data, error } = await query;
            if (error) throw error;
            set({ households: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching households:', error);
            set({ error: error.message, loading: false });
        }
    },

    // Fetch single household by ID
    fetchHousehold: async (id) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('households')
                .select(`
                    *,
                    head:profiles!households_head_of_household_id_fkey(id, full_name, phone, gender, date_of_birth, nationality),
                    caseworker:profiles!households_assigned_caseworker_id_fkey(id, full_name),
                    members:profiles!profiles_household_fkey(id, full_name, gender, date_of_birth, nationality)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            set({ currentHousehold: data, loading: false });
            return data;
        } catch (error) {
            console.error('Error fetching household:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // Create new household
    createHousehold: async (householdData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('households')
                .insert([householdData])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                households: [data, ...state.households],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error creating household:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // Update household
    updateHousehold: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('households')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                households: state.households.map(h => h.id === id ? data : h),
                currentHousehold: state.currentHousehold?.id === id ? data : state.currentHousehold,
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error updating household:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // Assign caseworker
    assignCaseworker: async (householdId, caseworkerId) => {
        return get().updateHousehold(householdId, { assigned_caseworker_id: caseworkerId });
    },

    clearCurrentHousehold: () => set({ currentHousehold: null }),
    clearError: () => set({ error: null })
}));
