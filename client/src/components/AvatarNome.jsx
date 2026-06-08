const CORES = [
  '#0066ff', '#7c3aed', '#db2777', '#059669', '#d97706',
  '#dc2626', '#0891b2', '#65a30d', '#9333ea', '#ea580c',
];

function getIniciais(nome) {
  const palavras = nome.trim().split(/\s+/).filter((p) => p.length > 2);
  if (palavras.length === 0) return nome.slice(0, 2).toUpperCase();
  if (palavras.length === 1) return palavras[0].slice(0, 2).toUpperCase();
  return (palavras[0][0] + palavras[1][0]).toUpperCase();
}

function getCor(nome) {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return CORES[Math.abs(hash) % CORES.length];
}

export default function AvatarNome({ nome, size = 34, fontSize = '0.85rem' }) {
  const iniciais = getIniciais(nome);
  const cor = getCor(nome);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${cor}22`,
        border: `1.5px solid ${cor}`,
        color: cor,
        fontWeight: 800,
        fontSize,
        flexShrink: 0,
        letterSpacing: '0.03em',
      }}>
        {iniciais}
      </span>
      {nome}
    </span>
  );
}
