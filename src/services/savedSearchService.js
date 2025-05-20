import { supabase } from 'boot/supabase'

export const savedSearchService = {
  // Save a new search
  async saveSearch(searchCriteria) {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert([
          {
            search_criteria: searchCriteria,
          },
        ])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error saving search:', error)
      throw error
    }
  },

  // Get all saved searches for the current user
  async getSavedSearches() {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching saved searches:', error)
      throw error
    }
  },

  // Update a saved search
  async updateSavedSearch(id, searchCriteria) {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .update({ search_criteria: searchCriteria })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating saved search:', error)
      throw error
    }
  },

  // Delete a saved search
  async deleteSavedSearch(id) {
    try {
      const { error } = await supabase.from('saved_searches').delete().eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting saved search:', error)
      throw error
    }
  },
}
