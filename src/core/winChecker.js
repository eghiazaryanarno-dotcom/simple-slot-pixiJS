import { Graphics, Ticker } from "pixi.js";
import { SLOT_TEXTURES_URLS } from "../constants/slotTextures.js";
import { GAME_SETTINGS } from "../constants/gameSettings.js";

const { symbolSize } = GAME_SETTINGS;

export function clearWinLines(container) {
  if (!container || !container.children) return;
  for (let i = container.children.length - 1; i >= 0; i--) {
    if (container.children[i].label === "winLine") {
      if (container.children[i].blink) {
        Ticker.shared.remove(container.children[i].blink);
      }
      container.children[i].destroy({ children: true });
    }
  }
}

export function winCheck(result, container, betAmount) {
  clearWinLines(container);
  let win = 0;
  for (let r = 0; r < result[0].length; r++) {
    let count = 1,
      start = 0;
    for (let i = 1; i <= result.length; i++) {
      if (i < result.length && result[i][r] === result[i - 1][r]) count++;
      else {
        if (count >= 3) {
          const s = SLOT_TEXTURES_URLS.find((x) => x.id === result[i - 1][r]);
          win += betAmount * (s?.multiple ?? 1) * count;
          drawWinLine(container, start, count, r);
        }
        count = 1;
        start = i;
      }
    }
  }
  return win;
}

function drawWinLine(container, start, count, row) {
  const line = new Graphics()
    .rect(0, -4, count * symbolSize - 60, 8)
    .fill(0xff46e3);
  line.x = start * symbolSize + 30;
  line.y = (row + 0.5) * symbolSize;
  line.label = "winLine";
  line.t = 0;
  line.blink = (dt) => {
    if (line.destroyed || !line.parent) {
      Ticker.shared.remove(line.blink);
      return;
    }
    line.t += dt.deltaTime;
    line.alpha = 0.4 + Math.abs(Math.sin(line.t * 0.1)) * 0.6;
  };
  container.addChild(line);
  Ticker.shared.add(line.blink);
}
