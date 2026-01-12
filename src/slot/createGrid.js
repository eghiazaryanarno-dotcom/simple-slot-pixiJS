import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { GAME_SETTINGS } from "../constants/gameSettings";

const { colors, cellWidth, cellHeight, columnsCount, totalWidth, bgH, bgW } =
  GAME_SETTINGS;

export async function createGrid(app) {
  const gridContainer = new Container();
  const columns = [];

  const frameTexture = await Assets.load("slotFrame.png");
  const frame = new Sprite(frameTexture);

  frame.anchor.set(0.5);
  frame.x = totalWidth / 2;
  frame.y = cellHeight / 2;
  frame.width = bgW - 200;
  frame.height = bgH - 140;

  for (let i = 0; i < columnsCount; i++) {
    const columnContainer = new Container();
    columnContainer.x = i * cellWidth;

    const bg = new Graphics()
      .rect(0, 0, cellWidth, cellHeight)
      .fill({ color: colors.bg, alpha: 0.2 })
      .stroke({
        width: 3,
        color: colors.stroke,
        alpha: 0.5,
      });

    const mask = new Graphics()
      .rect(0, 0, cellWidth, cellHeight)
      .fill(0xffffff);

    const symbolsContainer = new Container();

    columnContainer.addChild(bg);
    columnContainer.addChild(symbolsContainer);
    columnContainer.addChild(mask);
    columnContainer.mask = mask;

    gridContainer.addChild(columnContainer);
    columns.push({ symbolsContainer });
  }

  gridContainer.addChild(frame);

  gridContainer.pivot.set(totalWidth / 2, cellHeight / 2);
  gridContainer.x = app.screen.width / 2;
  gridContainer.y = (app.screen.height - 80) / 2;

  return { gridContainer, columns };
}
