import React, { useState, useEffect, useRef } from 'react';
import dummyData from '../data/dummyData';
import LRUCache from '../utils/LRUCache';

const cache = new LRUCache<string[]>(5);

const highlightMatch = (text: string, query: string) => {
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const AutoFillInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: number; name: string }[]>([]);
  const debounceRef = useRef<number | undefined>(undefined); // <-- updated here

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (value.trim() === '') {
        setResults([]);
        return;
      }

      const cached = cache.get(value);
      if (cached) {
        setResults(cached.map(name => ({ id: name.length, name })));
        return;
      }

      const filtered = dummyData.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );

      setResults(filtered);
      cache.put(value, filtered.map(item => item.name));
    }, 300);
  };

  // Optional: clear timeout on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div style={{ width: '300px', margin: '20px auto' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        style={{ width: '100%', padding: '8px' }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map(item => (
          <li key={item.id} style={{ padding: '5px 0' }}>
            {highlightMatch(item.name, query)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoFillInput;
