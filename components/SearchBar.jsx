import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for suggestions (replace with API call in production)
const searchData = [
  { type: 'player', name: 'Dak Prescott', details: 'QB, Dallas Cowboys' },
  { type: 'player', name: 'Patrick Mahomes', details: 'QB, Kansas City Chiefs' },
  { type: 'coach', name: 'Andy Reid', details: 'Head Coach, Kansas City Chiefs' },
  { type: 'team', name: 'Dallas Cowboys', details: 'NFC East' },
  { type: 'team', name: 'Kansas City Chiefs', details: 'AFC West' },
  { type: 'referee', name: 'Carl Cheffers', details: 'NFL Referee' },
  { type: 'news', name: 'Trade Rumors: Mahomes to Jets?', details: 'Latest NFL News' },
  { type: 'news', name: 'Prescott Injured in Practice', details: 'Breaking News' },
];

// Animation variants
const suggestionVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setSelectedIndex(-1); // Reset selection on new input
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current.blur();
        break;
    }
  };

  // Handle suggestion selection
  const handleSelect = (item) => {
    setQuery(item.name);
    setSuggestions([]);
    setSelectedIndex(-1);
    if (onSelect) onSelect(item);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search players, news, coaches, teams, refs..."
        className="w-full p-4 rounded-lg bg-gray-900 text-cyan-300 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 shadow-md"
        aria-label="Search bar for players, news, coaches, teams, and referees"
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        role="combobox"
        aria-expanded={suggestions.length > 0}
      />
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            ref={suggestionRef}
            id="suggestions-list"
            className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-teal-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {suggestions.map((item, index) => (
              <motion.div
                key={item.name}
                variants={suggestionVariants}
                initial="hidden"
                animate="visible"
                className={`p-3 cursor-pointer ${
                  index === selectedIndex ? 'bg-teal-700' : 'hover:bg-teal-600'
                }`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-gray-400 ml-2">{item.details}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;