
export const getTeamColor = (teamName) => {
  if (!teamName) return '#ef4444'; // Default F1 Red fallback
  
  const name = teamName.toLowerCase();
  if (name.includes('red bull')) return '#4570C0';
  if (name.includes('ferrari')) return '#D52E37';
  if (name.includes('mercedes')) return '#75F1D3';
  if (name.includes('mclaren')) return '#ef8733';
  if (name.includes('aston')) return '#4B9774';
  if (name.includes('alpine')) return '#479FE2'; // Or #FF87BC for BWT Pink
  if (name.includes('williams')) return '#3267D4';
  if (name.includes('rb') || name.includes('visa') || name.includes('VCARB')) return '#7091f8';
  // Note: If Sauber fully transitions to Audi in 2026, you can change this to red/black/silver
  if (name.includes('audi')) return '#EB4526'; 
  if (name.includes('haas')) return '#DFE1E2';
  if (name.includes('cadillac')) return '#AAAADD';
  
  return '#ef4444'; // Fallback for unknown teams
};