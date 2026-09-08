/*
 * ===========================================================================
 * LE MISURE DELLE FOTOGRAFIE — file generato, non si tocca a mano
 * ===========================================================================
 * Lo riscrive `npm run immagini` (`scripts/immagini.mjs`) ogni volta che si
 * rigenerano i ritagli. Serve al componente `sito/componenti/Foto.tsx` per
 * comporre `srcset`: le misure che esistono davvero le sa solo lo script che
 * le ha prodotte, e un `srcset` che promette un file inesistente è
 * un'immagine rotta sul telefono di chi apre il sito.
 *
 * Il testo alternativo NON sta qui: dipende da come la fotografia viene usata
 * in quella pagina, e lo scrive chi scrive la pagina.
 * ===========================================================================
 */

export interface VarianteFoto {
  readonly file: string
  readonly larghezza: number
  readonly altezza: number
}

/** I due tagli: `largo` 16:9 per la scrivania, `alto` 4:5 per il telefono. */
export interface TagliFoto {
  readonly largo: readonly VarianteFoto[]
  readonly alto: readonly VarianteFoto[]
}

/** La cartella pubblica dei ritagli, senza il percorso di base del sito:
 *  quello lo aggiunge `link()` di `sito/rotte.ts`. */
export const CARTELLA_FOTO = '/media/squadra/generate/'

export const FOTO = {
  'azione-1': {
    largo: [
      { file: 'azione-1-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'azione-1-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'azione-1-largo-1600.webp', larghezza: 1600, altezza: 900 },
    ],
    alto: [
      { file: 'azione-1-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'azione-1-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'azione-1-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'azione-2': {
    largo: [
      { file: 'azione-2-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'azione-2-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'azione-2-largo-1600.webp', larghezza: 1600, altezza: 900 },
    ],
    alto: [
      { file: 'azione-2-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'azione-2-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'azione-2-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'azione-3': {
    largo: [
      { file: 'azione-3-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'azione-3-largo-1027.webp', larghezza: 1027, altezza: 578 },
    ],
    alto: [
      { file: 'azione-3-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'azione-3-alto-462.webp', larghezza: 462, altezza: 578 },
    ],
  },
} as const satisfies Record<string, TagliFoto>

export type NomeFoto = keyof typeof FOTO
