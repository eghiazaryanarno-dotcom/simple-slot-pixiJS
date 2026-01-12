import { SLOT_TEXTURES_URLS } from "../constants/slotTextures.js";

const slotIds = SLOT_TEXTURES_URLS;
export function generateReelResult() {
    const result = []
    for (let i = 0; i < slotIds.length - 1; i++) {
      const column = [];
      for (let j = 0; j < slotIds.length / 2; j++) {
        column.push(Math.floor(Math.random() * slotIds.length + 1));
      }
      result.push(column);
    }
    return result
}