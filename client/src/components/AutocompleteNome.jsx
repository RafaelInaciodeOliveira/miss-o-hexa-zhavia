import { useEffect, useRef, useState } from 'react';
import AvatarNome from './AvatarNome.jsx';

export default function AutocompleteNome({ value, onChange, onEnter, sugestoes = [], placeholder = 'Digite seu nome...' }) {
  const [aberto, setAberto] = useState(false);
  const [indice, setIndice] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtradas = value.trim().length === 0
    ? sugestoes
    : sugestoes.filter((n) => n.toLowerCase().includes(value.toLowerCase()));

  useEffect(() => {
    setIndice(-1);
  }, [value]);

  useEffect(() => {
    function handleClickFora(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  function handleKeyDown(e) {
    if (!aberto || filtradas.length === 0) {
      if (e.key === 'Enter') onEnter?.();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndice((i) => Math.min(i + 1, filtradas.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndice((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (indice >= 0) {
        onChange(filtradas[indice]);
        setAberto(false);
        setIndice(-1);
      } else {
        onEnter?.();
      }
    } else if (e.key === 'Escape') {
      setAberto(false);
    }
  }

  function selecionar(nome) {
    onChange(nome);
    setAberto(false);
    setIndice(-1);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: 1, minWidth: 200 }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setAberto(true); }}
        onFocus={() => setAberto(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: 'var(--space-dark)',
          border: '1px solid #444',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: aberto && filtradas.length > 0 ? '6px 6px 0 0' : 6,
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'border-color 0.2s',
          borderColor: aberto ? 'var(--cosmic-blue)' : '#444',
        }}
      />

      {aberto && filtradas.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          margin: 0,
          padding: 0,
          listStyle: 'none',
          background: '#0d1117',
          border: '1px solid var(--cosmic-blue)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          maxHeight: 220,
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}>
          {filtradas.map((nome, i) => (
            <li
              key={nome}
              onMouseDown={() => selecionar(nome)}
              onMouseEnter={() => setIndice(i)}
              style={{
                padding: '9px 14px',
                cursor: 'pointer',
                background: i === indice ? 'rgba(0,102,255,0.18)' : 'transparent',
                borderBottom: i < filtradas.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'background 0.15s',
              }}
            >
              <AvatarNome nome={nome} size={28} fontSize="0.75rem" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
