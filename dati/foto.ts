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
  'hero-urbinati': {
    largo: [
      { file: 'hero-urbinati-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'hero-urbinati-largo-960.webp', larghezza: 960, altezza: 540 },
    ],
    alto: [
      { file: 'hero-urbinati-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'hero-urbinati-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'hero-urbinati-alto-741.webp', larghezza: 741, altezza: 926 },
    ],
  },
  'azione-contrasto': {
    largo: [
      { file: 'azione-contrasto-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'azione-contrasto-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'azione-contrasto-largo-1440.webp', larghezza: 1440, altezza: 810 },
    ],
    alto: [
      { file: 'azione-contrasto-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'azione-contrasto-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'azione-contrasto-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'azione-corsa': {
    largo: [
      { file: 'azione-corsa-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'azione-corsa-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'azione-corsa-largo-1600.webp', larghezza: 1600, altezza: 900 },
    ],
    alto: [
      { file: 'azione-corsa-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'azione-corsa-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'azione-corsa-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'portiere': {
    largo: [
      { file: 'portiere-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'portiere-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'portiere-largo-1440.webp', larghezza: 1440, altezza: 810 },
    ],
    alto: [
      { file: 'portiere-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'portiere-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'portiere-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'giovanili-squadra': {
    largo: [
      { file: 'giovanili-squadra-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'giovanili-squadra-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'giovanili-squadra-largo-1600.webp', larghezza: 1600, altezza: 900 },
    ],
    alto: [
      { file: 'giovanili-squadra-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'giovanili-squadra-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'giovanili-squadra-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'pista-tramonto': {
    largo: [
      { file: 'pista-tramonto-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'pista-tramonto-largo-1080.webp', larghezza: 1080, altezza: 608 },
    ],
    alto: [
      { file: 'pista-tramonto-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'pista-tramonto-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'pista-tramonto-alto-864.webp', larghezza: 864, altezza: 1080 },
    ],
  },
  'torneo-mare': {
    largo: [
      { file: 'torneo-mare-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'torneo-mare-largo-1200.webp', larghezza: 1200, altezza: 675 },
      { file: 'torneo-mare-largo-1440.webp', larghezza: 1440, altezza: 810 },
    ],
    alto: [
      { file: 'torneo-mare-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'torneo-mare-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'torneo-mare-alto-900.webp', larghezza: 900, altezza: 1125 },
    ],
  },
  'premiazione-mare': {
    largo: [
      { file: 'premiazione-mare-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'premiazione-mare-largo-1080.webp', larghezza: 1080, altezza: 608 },
    ],
    alto: [
      { file: 'premiazione-mare-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'premiazione-mare-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'premiazione-mare-alto-864.webp', larghezza: 864, altezza: 1080 },
    ],
  },
  'pista-mare-gioco': {
    largo: [
      { file: 'pista-mare-gioco-largo-800.webp', larghezza: 800, altezza: 450 },
      { file: 'pista-mare-gioco-largo-1080.webp', larghezza: 1080, altezza: 608 },
    ],
    alto: [
      { file: 'pista-mare-gioco-alto-400.webp', larghezza: 400, altezza: 500 },
      { file: 'pista-mare-gioco-alto-600.webp', larghezza: 600, altezza: 750 },
      { file: 'pista-mare-gioco-alto-864.webp', larghezza: 864, altezza: 1080 },
    ],
  },
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
