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

    assignCaseworker: async (householdId, caseworkerId) => {
        return get().updateHousehold(householdId, { assigned_caseworker_id: caseworkerId });
    },

    // Add Member
    addMember: async (memberData) => {
        set({ loading: true, error: null });
        try {
            // 1. Create Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    full_name: memberData.full_name,
                    date_of_birth: memberData.date_of_birth,
                    gender: memberData.gender,
                    nationality: memberData.nationality,
                    role: 'refugee', // Default role
                    household_id: memberData.household_id
                }])
                .select()
                .single();

            if (profileError) throw profileError;

            // 2. Refresh current household to show new member
            await get().fetchHousehold(memberData.household_id);

            set({ loading: false });
            return profileData;
        } catch (error) {
            console.error('Error adding member:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // Set Head of Household
    setHeadOfHousehold: async (householdId, memberId) => {
        return get().updateHousehold(householdId, { head_of_household_id: memberId });
    },

    clearCurrentHousehold: () => set({ currentHousehold: null }),
    clearError: () => set({ error: null })
}));
