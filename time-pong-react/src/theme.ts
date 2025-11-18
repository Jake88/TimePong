// Theme configuration based on the original Polymer app styling
export const theme = {
  // Text colors
  primaryTextColor: '#333',
  secondaryTextColor: '#666',
  primaryBackgroundColor: '#fafafa',
  overlayBackgroundColor: '#999',
  lightGrey: '#ccc',
  linkColor: '#3B76D4',

  // Drop shadow
  dropShadowColor: 'rgba(0, 0, 0, .2)',

  // Game colors
  successGreen: '#0AC900',
  failureRed: '#E30000',

  // Rarity colors - Common
  commonSoft: '#eee',
  commonSoftTint: '#ddd',
  commonHighlight: '#666',

  // Rarity colors - Rare
  rareSoft: '#E3E4FF',
  rareSoftTint: '#D0D1F5',
  rareHighlight: '#787AFF',

  // Rarity colors - Limited
  limitedSoft: '#E5FFE3',
  limitedSoftTint: '#CEF2CB',
  limitedHighlight: '#8AE690',

  // Rarity colors - Special
  specialSoft: '#FFE3E3',
  specialSoftTint: '#F2CECE',
  specialHighlight: '#FF7878',

  // Fonts
  fontFamily: "'Roboto', 'Noto', sans-serif",

  // Layout mixins
  absoluteTemplate: `
    box-sizing: border-box;
    position: absolute;
    height: 100%;
    width: 100%;
  `,

  relativeTemplate: `
    box-sizing: border-box;
    position: relative;
    height: 100%;
    width: 100%;
  `,

  pseudoElement: `
    content: "";
    box-sizing: border-box;
    position: absolute;
    height: 0;
    width: 0;
  `,

  cardWrapper: `
    position: absolute;
    height: 28.75em;
    width: 18.75em;
    left: 50%;
    top: 50%;
    margin-top: -14.375em;
    margin-left: -9.375em;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  `,
};

export type Theme = typeof theme;
