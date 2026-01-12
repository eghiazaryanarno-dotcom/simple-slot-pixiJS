import { Sprite, BlurFilter, Container, Texture } from "pixi.js";
import { GAME_SETTINGS } from "../constants/gameSettings.js";
import { applyScale } from "../core/ApplyScale.js";
import { generateReelResult } from "../core/GenerateReelResult.js";
import { SLOT_TEXTURES_URLS } from "../constants/slotTextures.js";
import { STATES } from "../core/Game.js";

const {
  cellWidth,
  symbolSize,
  speed,
  cellHeight,
  reelStopingTime,
  symbolBlure,
} = GAME_SETTINGS;

export function createReels(
  app,
  slotTextures,
  columns,
  initialResult,
  onChangeState
) {
  const slotIds = SLOT_TEXTURES_URLS;
  const reels = [];
  let currentState = STATES.IDLE;
  let reelResult = initialResult;

  columns.forEach((column) => {
    const reel = {
      container: column.symbolsContainer,
      blocks: [],
      rolling: false,
      isStopping: false,
    };

    for (let i = 0; i < 2; i++) {
      const block = new Container();
      block.symbols = [];
      block.isFinal = false;

      for (let j = 0; j < 3; j++) {
        const symbol = new Sprite(
          slotTextures[Math.floor(Math.random() * slotTextures.length)]
        );
        const blur = new BlurFilter();
        blur.strengthX = 0;
        blur.strengthY = 0;
        symbol.filters = [blur];
        symbol.blur = blur;
        symbol.anchor.set(0.5);
        symbol.x = cellWidth / 2;
        applyScale(symbol);
        symbol.y = j * symbolSize + symbolSize / 2;
        block.addChild(symbol);
        block.symbols.push(symbol);
      }
      block.y = i * -cellHeight;
      reel.container.addChild(block);
      reel.blocks.push(block);
    }
    reels.push(reel);
  });

  function startSpin() {
    if (currentState !== STATES.IDLE) return;

    currentState = STATES.SPINNING;
    onChangeState(STATES.SPINNING);

    reelResult = generateReelResult();
    reels.forEach((reel, i) => {
      reel.blocks[0].y = 0;
      reel.blocks[1].y = -cellHeight;
      reel.rolling = true;
      reel.isStopping = false;
      reel.blocks.forEach((block) => {
        block.isFinal = false;
        block.symbols.forEach((s) => (s.blur.strengthY = symbolBlure));
      });
      setTimeout(
        () => (reel.isStopping = true),
        reelStopingTime + i * reelStopingTime
      );
    });
  }

  app.ticker.add((time) => {
    reels.forEach((reel, reelIndex) => {
      if (!reel.rolling) return;

      let shouldStopReel = false;

      reel.blocks.forEach((block) => {
        block.y += speed * time.deltaTime;

        if (block.y >= cellHeight) {
          block.y -= cellHeight * 2;

          if (
            reel.isStopping &&
            !block.isFinal &&
            !reel.blocks.some((b) => b.isFinal)
          ) {
            block.symbols.forEach((s, j) => {
              const index = reelResult[reelIndex][j];
              const sym = slotIds.find((symbol) => symbol.id === index);
              s.texture = Texture.from(sym.url);
              applyScale(s);
              s.blur.strengthY = 0;
            });
            block.isFinal = true;
          } else {
            block.symbols.forEach((s) => {
              s.texture =
                slotTextures[Math.floor(Math.random() * slotTextures.length)];
              applyScale(s);
              s.blur.strengthY = symbolBlure;
            });
          }
        }

        if (reel.isStopping && block.isFinal && block.y >= 0) {
          shouldStopReel = true;
        }
      });

      if (shouldStopReel) {
        reel.rolling = false;
        reel.isStopping = false;
        const finalBlock = reel.blocks.find((b) => b.isFinal);
        const otherBlock = reel.blocks.find((b) => b !== finalBlock);

        finalBlock.y = 0;
        finalBlock.isFinal = false;
        otherBlock.y = -cellHeight;
        otherBlock.isFinal = false;

        reel.blocks.forEach((b) =>
          b.symbols.forEach((s) => (s.blur.strengthY = 0))
        );
      }
    });

    if (currentState === STATES.SPINNING && reels.every((r) => !r.rolling)) {
      currentState = STATES.SHOW_WIN;
      onChangeState(STATES.SHOW_WIN, reelResult);
    }
  });

  return {
    startSpin,
    reels,
    getCurrentState: () => currentState,
    setIdle: () => (currentState = STATES.IDLE),
  };
}
