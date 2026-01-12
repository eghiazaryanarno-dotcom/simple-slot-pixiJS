import { GAME_SETTINGS } from "../constants/gameSettings";

export function applyScale(symbol) {
  const scale =
    Math.min(
      GAME_SETTINGS.cellWidth / symbol.texture.width,
      GAME_SETTINGS.symbolSize / symbol.texture.height
    ) * GAME_SETTINGS.symbolScaleFactor;

  symbol.scale.set(scale);
}
