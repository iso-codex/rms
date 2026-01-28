import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useIIPStore = create((set, get) => ({
    plans: [],
    currentPlan: null,
    goals: [],
    loading: false,
    error: null,

    // ========== INTEGRATION PLANS ==========
    fetchPlans: async (householdId = null, caseworkerId = null) => {
        set({ loading: true, error: null });
        try {
            let query = supabase
                .from('integration_plans')
                .select(`
                    *,
                    *,
                    household:households!integration_plans_household_id_fkey(id, address),
                    caseworker:profiles!integration_plans_caseworker_id_fkey(id, full_name)
                `)
                .order('created_at', { ascending: false });

            if (householdId) {
                query = query.eq('household_id', householdId);
            }
            if (caseworkerId) {
                query = query.eq('caseworker_id', caseworkerId);
            }

            const { data, error } = await query;
            if (error) throw error;
            set({ plans: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching plans:', error);
            set({ error: error.message, loading: false });
        }
    },

    fetchPlan: async (planId) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('integration_plans')
                .select(`
                    *,
                    *,
                    household:households!integration_plans_household_id_fkey(id, address),
                    caseworker:profiles!integration_plans_caseworker_id_fkey(id, full_name),
                    goals:integration_goals(*)
                `)
                .eq('id', planId)
                .single();

            if (error) throw error;
            set({ currentPlan: data, goals: data.goals || [], loading: false });
            return data;
        } catch (error) {
            console.error('Error fetching plan:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    createPlan: async (planData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('integration_plans')
                .insert([planData])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                plans: [data, ...state.plans],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error creating plan:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    updatePlan: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('integration_plans')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                plans: state.plans.map(p => p.id === id ? data : p),
                currentPlan: state.currentPlan?.id === id ? { ...state.currentPlan, ...data } : state.currentPlan,
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error updating plan:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    // ========== GOALS ==========
    fetchGoals: async (planId) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('integration_goals')
                .select('*')
                .eq('plan_id', planId)
                .order('priority', { ascending: false })
                .order('created_at', { ascending: true });

            if (error) throw error;
            set({ goals: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching goals:', error);
            set({ error: error.message, loading: false });
        }
    },

    addGoal: async (goalData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('integration_goals')
                .insert([goalData])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                goals: [...state.goals, data],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error adding goal:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    updateGoal: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('integration_goals')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                goals: state.goals.map(g => g.id === id ? data : g),
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error updating goal:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    deleteGoal: async (id) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('integration_goals')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                goals: state.goals.filter(g => g.id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            console.error('Error deleting goal:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    // Calculate IIP progress
    getProgress: () => {
        const goals = get().goals;
        if (goals.length === 0) return 0;
        const completed = goals.filter(g => g.status === 'completed').length;
        return Math.round((completed / goals.length) * 100);
    },

    clearCurrentPlan: () => set({ currentPlan: null, goals: [] }),
    clearError: () => set({ error: null })
}));
