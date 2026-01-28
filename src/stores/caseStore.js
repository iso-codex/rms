import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useCaseStore = create((set, get) => ({
    assessments: [],
    caseNotes: [],
    referrals: [],
    currentAssessment: null,
    loading: false,
    error: null,

    // ========== ASSESSMENTS ==========
    fetchAssessments: async (householdId = null) => {
        set({ loading: true, error: null });
        try {
            let query = supabase
                .from('assessments')
                .select(`
                    *,
                    household:households!assessments_household_id_fkey(id, address),
                    completedBy:profiles!assessments_completed_by_fkey(id, full_name)
                `)
                .order('created_at', { ascending: false });

            if (householdId) {
                query = query.eq('household_id', householdId);
            }

            const { data, error } = await query;
            if (error) throw error;
            set({ assessments: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching assessments:', error);
            set({ error: error.message, loading: false });
        }
    },

    createAssessment: async (assessmentData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('assessments')
                .insert([assessmentData])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                assessments: [data, ...state.assessments],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error creating assessment:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    updateAssessment: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('assessments')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                assessments: state.assessments.map(a => a.id === id ? data : a),
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error updating assessment:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // ========== CASE NOTES ==========
    fetchCaseNotes: async (householdId) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('case_notes')
                .select(`
                    *,
                    caseworker:caseworker_id(id, full_name)
                `)
                .eq('household_id', householdId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ caseNotes: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching case notes:', error);
            set({ error: error.message, loading: false });
        }
    },

    addCaseNote: async (noteData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('case_notes')
                .insert([noteData])
                .select(`*, caseworker:caseworker_id(id, full_name)`)
                .single();

            if (error) throw error;
            set((state) => ({
                caseNotes: [data, ...state.caseNotes],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error adding case note:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // ========== REFERRALS ==========
    fetchReferrals: async (householdId = null) => {
        set({ loading: true, error: null });
        try {
            let query = supabase
                .from('referrals')
                .select(`
                    *,
                    household:household_id(id, address),
                    referredBy:referred_by(id, full_name)
                `)
                .order('created_at', { ascending: false });

            if (householdId) {
                query = query.eq('household_id', householdId);
            }

            const { data, error } = await query;
            if (error) throw error;
            set({ referrals: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching referrals:', error);
            set({ error: error.message, loading: false });
        }
    },

    createReferral: async (referralData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('referrals')
                .insert([referralData])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                referrals: [data, ...state.referrals],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error creating referral:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    updateReferral: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('referrals')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                referrals: state.referrals.map(r => r.id === id ? data : r),
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error updating referral:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    deleteAssessment: async (id) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('assessments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                assessments: state.assessments.filter(a => a.id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            console.error('Error deleting assessment:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    deleteReferral: async (id) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('referrals')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                referrals: state.referrals.filter(r => r.id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            console.error('Error deleting referral:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    clearError: () => set({ error: null })
}));
