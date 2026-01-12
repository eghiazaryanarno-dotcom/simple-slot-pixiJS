export const GAME_SETTINGS = {
  bgH: 600,
  bgW: 850,
  columnsCount: 5,
  totalWidth: 550,
  cellHeight: 350,
  symbolScaleFactor: 0.75,
  speed: 20,
  colors: {
    bg: 0x000000,
    stroke: 0xffffff,
  },
  alphas: {
    bg: 0.6,
    stroke: 0.4,
  },
  reelStopingTime: 300,
  symbolBlure: 4,
  balance: 10000,
  currentBeT: 50,
  footerHeight: 100,
};

GAME_SETTINGS.cellWidth = GAME_SETTINGS.totalWidth / GAME_SETTINGS.columnsCount;
GAME_SETTINGS.symbolSize = GAME_SETTINGS.cellHeight / 3;
