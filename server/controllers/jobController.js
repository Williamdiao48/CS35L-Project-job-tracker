import { fetchAdzuna, fetchReed, fetchSerpApi } from '../services/jobService.js';
import { getCacheKey, getCached, setCache } from '../cache/searchCache.js'

const generateUniqueID = (job) => {
    const company = job.company?.toLowerCase().replace(/\s+/g, '') || 'unknown';
    const title = job.title?.toLowerCase().replace(/\s+/g, '') || 'unknown';
    const location = job.location?.toLowerCase().replace(/\s+/g, '') || 'unknown';
    return `${company}|${title}|${location}`;
  };

const isLocationMatch = (jobLocation, searchLocation) => {
    if (!searchLocation) return true; // If user didn't specify location, allow all
    
    const search = searchLocation.toLowerCase().trim();
    const jobLoc = jobLocation.toLowerCase().trim();
  
    // Return true if the job's location contains the search term (e.g., "New York, NY" contains "New York")
    return jobLoc.includes(search) || search.includes(jobLoc);
};
export const discoverJobs = async (req, res) => {
    try {
        // Get search parameters from the frontend query (e.g., ?title=React&location=NY)
        const { title, location } = req.query;
        const startTime = Date.now();
        if (!title) {
        return res.status(400).json({ message: "Job title is required for discovery." });
        }
        const cacheKey = getCacheKey(title, location || '');
        const cachedResults = getCached(cacheKey);

        if (cachedResults) {
          console.log(`Cache hit for: "${cacheKey}" took ${Date.now() - startTime}ms`);
          return res.status(200).json({
            total: cachedResults.length,
            jobs: cachedResults,
            fromCache: true
          });
        }

        console.log(`Cache miss for: "${cacheKey}" — fetching from APIs...`);
        console.log(`Searching for ${title} in ${location || 'anywhere'}...`);
        //Reeds only supports UK so we have to ensure we only use its results for uk searches
        const isUKSearch = location?.toLowerCase().includes('uk') || location?.toLowerCase().includes('london') || location?.toLowerCase().includes('united kingdom');
        
        // send requests
        const apiCalls = [
        fetchAdzuna(title, location),
        fetchSerpApi(title, location)];

        if (isUKSearch) {
        apiCalls.push(fetchReed(title, location));}

        const results = await Promise.all(apiCalls);
        const adzunaResults = results[0] || [];
        const serpResults = results[1] || [];
        const reedResults = isUKSearch ? results[2] : [];

        // Normalize the data (ensure every job has the same keys)
        const normalizedAdzuna = adzunaResults.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        url: job.redirect_url,
        source: 'Adzuna'
        }));
  
        const normalizedReed = reedResults.map(job => ({
        id: job.jobId,
        title: job.jobTitle,
        company: job.employerName,
        location: job.locationName,
        description: job.jobDescription,
        url: job.jobUrl,
        source: 'Reed'
        }));
  
        const normalizedSerp = serpResults.map((job, index) => {
            // priority to 'apply_options', and 'related_links' as a fallback
            const bestLink = job.apply_options?.[0]?.link || job.related_links?.[0]?.link || null;
          
            return {
                id: job.job_id || `serp-${index}`,
                title: job.title,
                company: job.company_name,
                location: job.location,
                description: job.description,
                url: bestLink, 
                source: 'Google Jobs'
            };
          }).filter(job => isLocationMatch(job.location, location));

        // Combine and return the results
        const combinedJobs = [...normalizedAdzuna, ...normalizedReed, ...normalizedSerp];
      
        // 5. De-duplicate using a Map
        // This keeps the first occurrence of a job and ignores subsequent matches
        const uniqueJobsMap = new Map();

        combinedJobs.forEach(job => {
        const uniqueID = generateUniqueID(job);
        if (!uniqueJobsMap.has(uniqueID)) {
          uniqueJobsMap.set(uniqueID, job);
        }
        });

        // 6. Convert map back to array and sort (if you want latest first)
        const allJobs = Array.from(uniqueJobsMap.values());
        
        // Optional: Sort by Title (or Date if your APIs provide it)
        allJobs.sort((a, b) => a.title.localeCompare(b.title));

        setCache(cacheKey, allJobs);
        res.status(200).json({
        total: allJobs.length,
        jobs: allJobs
        });
        console.log(`Search "${title} in ${location || 'anywhere'}" took ${Date.now() - startTime}ms`);
    } catch (error) {
        console.error("Discovery Controller Error:", error);
        res.status(500).json({ message: "Failed to fetch jobs from external sources." });
    }
  };