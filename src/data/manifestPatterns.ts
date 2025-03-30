
export interface ManifestPattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const manifestPatterns: ManifestPattern[] = [
  { id: 'abundance', name: 'Abundancia', description: 'Atrae prosperidad y abundancia material y espiritual a tu vida', image: '/patterns/abundance.svg' },
  { id: 'health', name: 'Salud', description: 'Promueve la salud, vitalidad y bienestar físico y mental', image: '/patterns/health.svg' },
  { id: 'love', name: 'Amor', description: 'Atrae relaciones armoniosas y amor incondicional a tu vida', image: '/patterns/love.svg' },
  { id: 'success', name: 'Éxito', description: 'Amplifica el éxito y los logros en todas tus empresas', image: '/patterns/success.svg' },
  { id: 'creativity', name: 'Creatividad', description: 'Estimula la inspiración, la creatividad y la expresión artística', image: '/patterns/creativity.svg' },
  { id: 'protection', name: 'Protección', description: 'Crea un escudo energético contra energías e influencias negativas', image: '/patterns/protection.svg' },
];
