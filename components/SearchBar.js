'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

const badgeColors = {
  Player: 'bg-blue-100 text-blue-800',
  Team: 'bg-green-100 text-green-800',
  Referee: 'bg-purple-100 text-purple-800',
  Stats: 'bg-yellow-100 text-yellow-800',
  Utility: 'bg-gray-200 text-gray-800',
};

export default function SearchBar({ data }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const router = useRouter();

  // Memoize fuse to prevent re-creation on every render
  const fuse = useMemo(() => new Fuse(data, {
    keys: ['label'],
    threshold: 0.3, // Lower = more strict
    minMatchCharLength: 2,
  }), [data]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const fuzzy = fuse.search(query);
      setResults(fuzzy.map(res => res.item));
      setActiveIndex(-1);
    } else {
      setResults([]);
    }
  }, [query, fuse]); // Add fuse as a dependency

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (results[activeIndex]) {
        router.push(results[activeIndex].url);
        setQuery('');
        setResults([]);
      }
    }
  };

  const handleClick = (item) => {
    router.push(item.url);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        placeholder="Search players, teams, stats, refs..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 bg-white border border-gray-300 rounded shadow mt-2 w-full max-h-72 overflow-auto">
          {results.map((item, i) => (
            <li
              key={item.label + i}
              className={`px-4 py-2 cursor-pointer flex justify-between items-center ${
                i === activeIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleClick(item)}
            >
              <span className="text-gray-800">{item.label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${badgeColors[item.type] || 'bg-gray-200 text-gray-800'}`}>
                {item.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
