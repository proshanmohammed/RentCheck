import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey && apiKey.trim() !== '') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[Gemini Service] Initialization failed, will use heuristic engine:', err.message);
  }
}

/**
 * Text normalization helper for local heuristic comparison
 */
function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|apartment|apt|suite|ste|unit)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Jaccard token similarity
 */
function tokenSimilarity(str1, str2) {
  const set1 = new Set(normalizeText(str1).split(' ').filter(w => w.length > 2));
  const set2 = new Set(normalizeText(str2).split(' ').filter(w => w.length > 2));
  if (set1.size === 0 || set2.size === 0) return 0;
  
  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) intersection++;
  }
  const union = new Set([...set1, ...set2]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Rule-based heuristic deduplication engine
 */
export function heuristicDuplicateCheck(newListing, existingListings) {
  let highestScore = 0;
  let matchedListing = null;
  let matchReasons = [];

  const normNewAddr = normalizeText(newListing.address);
  const normNewCity = (newListing.city || '').toLowerCase().trim();

  for (const existing of existingListings) {
    if (existing.id === newListing.id) continue;

    let score = 0;
    const reasons = [];

    // 1. Address matching
    const normExtAddr = normalizeText(existing.address);
    const normExtCity = (existing.city || '').toLowerCase().trim();

    const isSameCity = normNewCity && normExtCity && (normNewCity === normExtCity || normNewCity.includes(normExtCity) || normExtCity.includes(normNewCity));
    const addrSim = (normNewAddr && normExtAddr && (normNewAddr === normExtAddr || normNewAddr.includes(normExtAddr) || normExtAddr.includes(normNewAddr))) ? 1.0 : tokenSimilarity(normNewAddr, normExtAddr);

    if (addrSim > 0.8 && isSameCity) {
      score += 0.50;
      reasons.push(`Direct street address match (${existing.address})`);
    } else if (addrSim > 0.5 && isSameCity) {
      score += 0.30;
      reasons.push(`Close address similarity (${Math.round(addrSim * 100)}%) in ${existing.city}`);
    }

    // 2. Base rent proximity
    if (newListing.baseRent && existing.baseRent) {
      const priceDiff = Math.abs(newListing.baseRent - existing.baseRent);
      const pricePercentDiff = priceDiff / Math.max(newListing.baseRent, existing.baseRent);
      if (pricePercentDiff <= 0.05) {
        score += 0.20;
        reasons.push(`Nearly identical pricing ($${newListing.baseRent} vs $${existing.baseRent})`);
      } else if (pricePercentDiff <= 0.15) {
        score += 0.10;
        reasons.push(`Close pricing range within 15%`);
      }
    }

    // 3. Property configuration (Bedrooms & Bathrooms & Property Type)
    if (newListing.bedrooms === existing.bedrooms && newListing.propertyType === existing.propertyType) {
      score += 0.15;
      reasons.push(`Identical layout (${existing.bedrooms} Bed, ${existing.propertyType})`);
    }

    // 4. Description content similarity
    const descSim = tokenSimilarity(newListing.description || '', existing.description || '');
    if (descSim > 0.55) {
      score += 0.15;
      reasons.push(`High textual description overlap (${Math.round(descSim * 100)}%)`);
    }

    // 5. Image URL matching
    const newImages = new Set(newListing.images || []);
    const extImages = existing.images || [];
    const sharedImages = extImages.filter(img => newImages.has(img));
    if (sharedImages.length > 0) {
      score += 0.25;
      reasons.push(`Re-used property photographs detected (${sharedImages.length} identical image URLs)`);
    }

    const finalListingScore = Math.min(1.0, score);
    if (finalListingScore > highestScore) {
      highestScore = finalListingScore;
      matchedListing = existing;
      matchReasons = reasons;
    }
  }

  const isDuplicate = highestScore >= 0.65;
  return {
    isDuplicate,
    matchedListingId: isDuplicate && matchedListing ? matchedListing.id : null,
    similarityScore: Number(highestScore.toFixed(4)),
    reasoning: isDuplicate && matchedListing
      ? `Potential duplicate syndication detected with Listing #${matchedListing.id.slice(0, 8)} (${matchedListing.title}): ${matchReasons.join('; ')}.`
      : (highestScore > 0.35 && matchedListing
          ? `Minor similarities noted with #${matchedListing.id.slice(0, 8)} (${Math.round(highestScore * 100)}%), but below duplicate threshold.`
          : 'No significant duplicates or syndication conflicts detected across current directory.')
  };
}

/**
 * Primary Duplicate Analysis function backed by Gemini AI with robust heuristic fallback
 */
export async function analyzeListingForDuplicates(newListing, existingListings) {
  if (!existingListings || existingListings.length === 0) {
    return {
      isDuplicate: false,
      matchedListingId: null,
      similarityScore: 0.0,
      reasoning: 'No existing listings in the database to compare against.'
    };
  }

  // Pre-filter candidate listings in the same city or with close price to fit context comfortably
  const cityFiltered = existingListings.filter(l => 
    !newListing.city || 
    !l.city || 
    l.city.toLowerCase() === newListing.city.toLowerCase() ||
    Math.abs(Number(l.baseRent) - Number(newListing.baseRent)) < 600
  );

  const sampleListings = (cityFiltered.length > 0 ? cityFiltered : existingListings).slice(0, 15).map(l => ({
    id: l.id,
    title: l.title,
    propertyType: l.propertyType,
    address: l.address,
    city: l.city,
    baseRent: l.baseRent,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    description: (l.description || '').slice(0, 250),
    images: l.images ? l.images.slice(0, 2) : []
  }));

  // If Gemini API is available, invoke @google/genai
  if (ai) {
    try {
      const systemInstruction = `You are the RentCheck Core Intelligence Engine. Your mandate is to ensure rental listing transparency, protect seekers from misleading advertisements, and accurately flag duplicate syndication without jumping to premature fraud conclusions. Maintain absolute neutrality, rely strictly on concrete textual and numerical evidence, and output valid structured JSON matching requested schemas.`;

      const prompt = `Compare the newly submitted listing against existing listings to detect potential duplicates or syndication spam.

New Listing:
${JSON.stringify({
  title: newListing.title,
  propertyType: newListing.propertyType,
  address: newListing.address,
  city: newListing.city,
  baseRent: newListing.baseRent,
  bedrooms: newListing.bedrooms,
  bathrooms: newListing.bathrooms,
  description: (newListing.description || '').slice(0, 300),
  images: newListing.images ? newListing.images.slice(0, 2) : []
}, null, 2)}

Existing Listings Sample:
${JSON.stringify(sampleListings, null, 2)}

Return a JSON object containing:
- isDuplicate (boolean)
- matchedListingId (string or null)
- similarityScore (number between 0 and 1)
- reasoning (string explaining the heuristic match)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      const parsed = JSON.parse(responseText);
      if (typeof parsed.isDuplicate === 'boolean' && typeof parsed.similarityScore === 'number') {
        return {
          isDuplicate: parsed.isDuplicate,
          matchedListingId: parsed.matchedListingId || null,
          similarityScore: Math.min(1.0, Math.max(0.0, parsed.similarityScore)),
          reasoning: parsed.reasoning || 'Gemini verified duplicate syndication assessment.'
        };
      }
    } catch (err) {
      console.warn('[Gemini Service] AI API call skipped or error, falling back to heuristic engine:', err.message);
    }
  }

  // Fallback heuristic evaluation
  return heuristicDuplicateCheck(newListing, existingListings);
}
