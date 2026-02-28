import axios from 'axios';
import dotenv from 'dotenv';

// 1. Fetch from Adzuna
export const fetchAdzuna = async (jobTitle, location = '') => {
    try {
      const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_API_KEY,
          results_per_page: 10,
          what: jobTitle,
          where: location
        }
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Adzuna API Error:', error.message);
      return [];
    }
  };

// 2. Fetch from Reed (UK focused, but good for testing aggregation)
export const fetchReed = async (jobTitle, location = '') => {
    try {
      const response = await axios.get('https://www.reed.co.uk/api/1.0/search', {
        params: {
          keywords: jobTitle,
          locationName: location
        },
        // Reed uses Basic Auth where the API key is the username and password is empty
        auth: {
          username: process.env.Reed_API_KEY,
          password: '' 
        }
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Reed API Error:', error.message);
      return [];
    }
  };

// 3. Fetch from SerpApi (Google Jobs)
export const fetchSerpApi = async (jobTitle, location = '') => {
    try {
      // single search string, so combine title and location
      const searchQuery = location ? `${jobTitle} ${location}` : jobTitle;
      
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_jobs',
          q: searchQuery,
          api_key: process.env.SerpApi_API_KEY,
          num: 10 // limit results to save credits
        }
      });
      return response.data.jobs_results || [];
    } catch (error) {
      console.error('SerpApi Error:', error.message);
      return [];
    }
  };

