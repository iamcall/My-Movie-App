import { Router, Request, Response } from 'express';
import {
  searchTitles,
  getTitleDetails,
  getTopRatedTitles,
  getTitlesByGenre,
  getStreamingAvailability
} from '../utils/imdbClient.js';
import { fetchPosterForTitle } from '../utils/posterClient.js';
import { SearchRequest, IMDbTitle } from '../types/index.js';

const router = Router();

// Search endpoint
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { services, seeds, filters }: SearchRequest = req.body;

    if (!services || services.length === 0) {
      return res.status(400).json({ error: 'At least one streaming service must be selected' });
    }

    let candidateTitles: IMDbTitle[] = [];

    // If we have seed titles (from ratings), use those to find similar content
    if (seeds && seeds.length > 0) {
      // Fetch details for seed titles to get their genres
      const seedDetails = await Promise.all(
        seeds.slice(0, 5).map(id => getTitleDetails(id))
      );

      // Extract genres from seeds
      const genres = new Set<string>();
      seedDetails.forEach(title => {
        if (title?.genres) {
          title.genres.forEach(g => genres.add(g));
        }
      });

      // Fetch titles for each genre
      const genrePromises = Array.from(genres).slice(0, 5).map(genre =>
        getTitlesByGenre(genre, 40)
      );

      const genreResults = await Promise.all(genrePromises);
      candidateTitles = genreResults.flat();
    } else {
      // No seeds yet, fetch top rated titles
      candidateTitles = await getTopRatedTitles(undefined, 50);
    }

    // Apply mood/filter-based genre preferences if provided
    if (filters?.moods && filters.moods.length > 0) {
      const moodGenres = mapMoodsToGenres(filters.moods);
      const moodTitles = await Promise.all(
        moodGenres.map(genre => getTitlesByGenre(genre, 40))
      );
      candidateTitles = [...candidateTitles, ...moodTitles.flat()];
    }

    // Remove duplicates
    const uniqueTitles = Array.from(
      new Map(candidateTitles.map(t => [t.id, t])).values()
    );

    // Fetch streaming availability for each title
    const titlesWithStreaming = await Promise.all(
      uniqueTitles.slice(0, 120).map(async (title) => {
        const [availableOn, poster] = await Promise.all([
          getStreamingAvailability(title.id, services),
          title.poster ? Promise.resolve(title.poster) : fetchPosterForTitle(title.id)
        ]);
        return {
          ...title,
          streamingServices: availableOn,
          poster: title.poster || poster || null
        };
      })
    );

    // Filter to only titles available on user's services
    const availableTitles = titlesWithStreaming.filter(
      t => t.streamingServices && t.streamingServices.length > 0
    );
    let finalResults = availableTitles;

    if (finalResults.length === 0) {
      finalResults = titlesWithStreaming;
    }

    res.json({
      results: finalResults,
      total: finalResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search titles' });
  }
});

// Get title details
router.get('/title/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const services = req.query.services as string;

    const title = await getTitleDetails(id);

    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    if (!title.poster) {
      const poster = await fetchPosterForTitle(id);
      if (poster) {
        title.poster = poster;
      }
    }

    // Add streaming availability if services are provided
    if (services) {
      const serviceArray = services.split(',');
      const availableOn = await getStreamingAvailability(id, serviceArray);
      return res.json({
        ...title,
        streamingServices: availableOn
      });
    }

    res.json(title);
  } catch (error) {
    console.error('Title details error:', error);
    res.status(500).json({ error: 'Failed to fetch title details' });
  }
});

// Get calibration titles (for the taste calibration phase)
router.get('/calibration', async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string) || 9;

    // Get a mix of popular titles from different genres
    const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance'];
    const genrePromises = genres.map(genre => getTitlesByGenre(genre, 3));

    const results = await Promise.all(genrePromises);
    const titles = results.flat();

    // Shuffle and return requested count
    const shuffled = titles.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    const withPosters = await Promise.all(
      selected.map(async (title) => {
        if (title.poster) {
          return title;
        }
        const poster = await fetchPosterForTitle(title.id);
        return {
          ...title,
          poster: poster || null
        };
      })
    );

    res.json({
      results: withPosters
    });
  } catch (error) {
    console.error('Calibration error:', error);
    res.status(500).json({ error: 'Failed to fetch calibration titles' });
  }
});

// Helper function to map moods to genres
function mapMoodsToGenres(moods: string[]): string[] {
  const moodMap: { [key: string]: string[] } = {
    'Cozy': ['Comedy', 'Romance', 'Family'],
    'Thrilling': ['Thriller', 'Action', 'Mystery'],
    'Dark Comedy': ['Comedy', 'Crime'],
    'Romance': ['Romance', 'Drama'],
    'Family-Friendly': ['Family', 'Animation', 'Adventure'],
    'Mind-Bending': ['Sci-Fi', 'Thriller', 'Mystery']
  };

  const genres = new Set<string>();
  moods.forEach(mood => {
    const mappedGenres = moodMap[mood] || [];
    mappedGenres.forEach(g => genres.add(g));
  });

  return Array.from(genres);
}

export default router;
