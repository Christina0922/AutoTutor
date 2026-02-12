import { useState, KeyboardEvent } from 'react';

interface LogInputProps {
  onCommand: (command: string) => void;
  placeholder?: string;
}

export function LogInput({ onCommand, placeholder = "명령어 입력..." }: LogInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '2px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: 'var(--input-bg)',
        color: 'var(--text-primary)',
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-color)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    />
  );
}

