import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useEventStore = create((set, get) => ({
    events: [],
    currentEvent: null,
    participants: [],
    loading: false,
    error: null,

    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('community_events')
                .select('*')
                .order('event_date', { ascending: true });

            if (error) throw error;
            set({ events: data || [], loading: false });
        } catch (error) {
            console.error('Error fetching events:', error);
            set({ error: error.message, loading: false });
        }
    },

    fetchEvent: async (id) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('community_events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Also fetch participants
            const { data: participants, error: pError } = await supabase
                .from('event_participation')
                .select('*, household:households!event_participation_household_id_fkey(id, address, head:profiles!households_head_of_household_id_fkey(full_name))')
                .eq('event_id', id);

            if (pError) console.error('Error fetching participants:', pError);

            set({ currentEvent: data, participants: participants || [], loading: false });
            return data;
        } catch (error) {
            console.error('Error fetching event:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    createEvent: async (eventData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('community_events')
                .insert([eventData])
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                events: [...state.events, data],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error creating event:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    updateEvent: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('community_events')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            set((state) => ({
                events: state.events.map(e => e.id === id ? data : e),
                currentEvent: state.currentEvent?.id === id ? data : state.currentEvent,
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error updating event:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    deleteEvent: async (id) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('community_events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                events: state.events.filter(e => e.id !== id),
                loading: false
            }));
            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    registerParticipant: async (participationData) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('event_participation')
                .insert([participationData])
                .select('*, household:households!event_participation_household_id_fkey(id, address, head:profiles!households_head_of_household_id_fkey(full_name))')
                .single();

            if (error) throw error;

            set((state) => ({
                participants: [...state.participants, data],
                loading: false
            }));
            return data;
        } catch (error) {
            console.error('Error registering participant:', error);
            set({ error: error.message, loading: false });
            return null;
        }
    },

    clearError: () => set({ error: null })
}));
