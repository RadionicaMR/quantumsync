
export const CHAKRA_FREQUENCIES = {
  'Raíz': 396,
  'Sacro': 417,
  'Plexo Solar': 528,
  'Corazón': 639,
  'Garganta': 741,
  'Tercer Ojo': 852,
  'Corona': 963
} as const;

export const CHAKRA_COLORS = {
  'Corona': '#A675F5',
  'Tercer Ojo': '#5E5DF0',
  'Garganta': '#3498DB',
  'Corazón': '#2ECC71',
  'Plexo Solar': '#F1C40F',
  'Sacro': '#E67E22',
  'Raíz': '#E74C3C'
} as const;

export const CHAKRA_POSITIONS = {
  'Corona': 21,
  'Tercer Ojo': 27,
  'Garganta': 33,
  'Corazón': 41,
  'Plexo Solar': 50,
  'Sacro': 57,
  'Raíz': 63
} as const;

export const CHAKRA_ORDER = [
  'Raíz', 
  'Sacro', 
  'Plexo Solar', 
  'Corazón', 
  'Garganta', 
  'Tercer Ojo', 
  'Corona'
] as const;

export type ChakraName = keyof typeof CHAKRA_FREQUENCIES;
