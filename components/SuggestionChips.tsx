
import React from 'react';

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  "I'm feeling a bit anxious.",
  "Give me a quick mindfulness tip.",
  "Can you suggest a journal prompt?",
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 text-sm text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/50 rounded-full hover:bg-sky-200 dark:hover:bg-sky-800/70 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
