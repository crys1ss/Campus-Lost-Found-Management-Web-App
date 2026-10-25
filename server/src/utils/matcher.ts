export interface MatchResult {
  score: number;
  reasons: {
    categoryMatch: boolean;
    brandMatch: boolean;
    colorMatch: boolean;
    locationMatch: boolean;
    titleOverlap: boolean;
    dateDiffDays: number;
    notes: string[];
  };
}

export function calculateMatchScore(
  lost: {
    category_id: number;
    title: string;
    description: string;
    color?: string | null;
    brand?: string | null;
    location: string;
    date_lost: string;
  },
  found: {
    category_id: number;
    title: string;
    description: string;
    color?: string | null;
    brand?: string | null;
    location: string;
    date_found: string;
  }
): MatchResult {
  let score = 0;
  const notes: string[] = [];

  // 1. Category match (30 pts)
  const categoryMatch = lost.category_id === found.category_id;
  if (categoryMatch) {
    score += 30;
    notes.push('Exact item category match (+30)');
  } else {
    // Different categories rarely match
    score -= 30;
    notes.push('Category mismatch (-30)');
  }

  // 2. Brand match (20 pts)
  let brandMatch = false;
  if (lost.brand && found.brand) {
    const b1 = lost.brand.trim().toLowerCase();
    const b2 = found.brand.trim().toLowerCase();
    if (b1 === b2 || b1.includes(b2) || b2.includes(b1)) {
      brandMatch = true;
      score += 20;
      notes.push(`Brand matched: "${lost.brand}" (+20)`);
    }
  }

  // 3. Color match (15 pts)
  let colorMatch = false;
  if (lost.color && found.color) {
    const c1 = lost.color.trim().toLowerCase();
    const c2 = found.color.trim().toLowerCase();
    if (c1 === c2 || c1.includes(c2) || c2.includes(c1)) {
      colorMatch = true;
      score += 15;
      notes.push(`Color matched: "${lost.color}" (+15)`);
    }
  }

  // 4. Location match (15 pts)
  let locationMatch = false;
  const loc1 = lost.location.trim().toLowerCase();
  const loc2 = found.location.trim().toLowerCase();
  const locKeywords = ['lab', 'library', 'canteen', 'sports', 'room', 'ground', 'hostel', 'staircase', 'floor'];
  const commonLocKeywords = locKeywords.filter(k => loc1.includes(k) && loc2.includes(k));

  if (loc1 === loc2 || loc1.includes(loc2) || loc2.includes(loc1) || commonLocKeywords.length > 0) {
    locationMatch = true;
    score += 15;
    notes.push(`Campus location match / vicinity (+15)`);
  }

  // 5. Title & Description text overlap (up to 15 pts)
  const cleanTokens = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  
  const lostTokens = new Set([...cleanTokens(lost.title), ...cleanTokens(lost.description)]);
  const foundTokens = new Set([...cleanTokens(found.title), ...cleanTokens(found.description)]);
  const intersection = [...lostTokens].filter(t => foundTokens.has(t));
  
  let titleOverlap = false;
  if (intersection.length >= 2) {
    titleOverlap = true;
    const textBonus = Math.min(15, intersection.length * 4);
    score += textBonus;
    notes.push(`Key terms shared: ${intersection.slice(0, 4).join(', ')} (+${textBonus})`);
  }

  // 6. Date Proximity (up to 10 pts)
  const dLost = new Date(lost.date_lost);
  const dFound = new Date(found.date_found);
  const diffTime = dFound.getTime() - dLost.getTime();
  const dateDiffDays = Math.round(diffTime / (1000 * 3600 * 24));

  // Found item should ideally be on or after lost date
  if (dateDiffDays >= 0 && dateDiffDays <= 1) {
    score += 10;
    notes.push('Found within 24-48 hours of loss (+10)');
  } else if (dateDiffDays >= -1 && dateDiffDays <= 5) {
    score += 7;
    notes.push(`Found within ${Math.abs(dateDiffDays)} days of report (+7)`);
  } else if (dateDiffDays > 5 && dateDiffDays <= 14) {
    score += 4;
    notes.push('Found within 2 weeks (+4)');
  } else if (dateDiffDays < -2) {
    // Found much earlier than lost date is unlikely
    score -= 15;
    notes.push('Date anomaly: Item was found prior to reported loss date (-15)');
  }

  // Normalize final score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  return {
    score: normalizedScore,
    reasons: {
      categoryMatch,
      brandMatch,
      colorMatch,
      locationMatch,
      titleOverlap,
      dateDiffDays,
      notes,
    },
  };
}
