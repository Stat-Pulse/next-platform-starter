import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar({ data = [] }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const matches = data
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, 8); // limit suggestions

    setSuggestions(matches);
  }, [query, data]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        router.push(suggestions[highlightedIndex].url);
      } else if (suggestions.length > 0) {
        router.push(suggestions[0].url);
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search players, teams, stats, settings..."
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full shadow-lg max-h-64 overflow-y-auto mt-1 rounded-md">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className={`px-4 py-2 cursor-pointer ${
                idx === highlightedIndex ? 'bg-blue-100' : ''
              }`}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onClick={() => router.push(item.url)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
