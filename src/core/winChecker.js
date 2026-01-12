import { Graphics } from "pixi.js";
import { SLOT_TEXTURES_URLS } from "../constants/slotTextures.js";
import { GAME_SETTINGS } from "../constants/gameSettings.js";

const { symbolSize } = GAME_SETTINGS;

export function winCheck(result, gridContainer, betAmount) {
  let totalWin = 0;
  const middleRow = result.map((col) => col[1]);

  let count = 1;
  let startIndex = 0;

  for (let i = 1; i <= middleRow.length; i++) {
    if (i < middleRow.length && middleRow[i] === middleRow[i - 1]) {
      count++;
    } else {
      if (count >= 3) {
        const symbolId = middleRow[i - 1];
        const symbolData = SLOT_TEXTURES_URLS.find((s) => s.id === symbolId);
        const multiplier = symbolData?.multiple ?? 1;

        totalWin += betAmount * multiplier * count;
        drawWinLine(gridContainer, startIndex, count);
      }

      count = 1;
      startIndex = i;
    }
  }

  return totalWin;
}

function drawWinLine(container, startIndex, symbolsCount) {
  const lineHeight = 8;
  const line = new Graphics()
    .rect(0, -lineHeight / 2, symbolsCount * symbolSize - 60, lineHeight)
    .fill({ color: 0xff46e3, alpha: 0.9 });

  line.x = startIndex * symbolSize + 10;
  line.y = symbolSize * 1.5;
  line.label = "winLine";

  let timer = 0;
  const blink = (time) => {
    timer += time.deltaTime;
    line.alpha = 0.4 + Math.abs(Math.sin(timer * 0.2)) * 0.6;
  };

  container.addChild(line);

  if (container.rootTicker) {
    container.rootTicker.add(blink);
  }

  const blinkInterval = setInterval(() => {
    if (line.destroyed) {
      clearInterval(blinkInterval);
      return;
    }
    line.visible = !line.visible;
  }, 250);
}
