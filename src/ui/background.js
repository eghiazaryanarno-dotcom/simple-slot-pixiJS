import { Container, Sprite, Assets, Text, TextStyle } from "pixi.js";
import { GAME_SETTINGS } from "../constants/gameSettings";

export async function createBackground(app) {
const { bgW, bgH } = GAME_SETTINGS;

  const container = new Container();

  const texture = await Assets.load("slotBackground.jpg");
  const titleIconTexture = await Assets.load("title.png");

  const bg = new Sprite(texture);
  bg.width = bgW; 
  bg.height = bgH;
  bg.anchor.set(0.5);
  bg.alpha = 0.9

  const frameTexture = await Assets.load("mainFrame.png");
  const frame = new Sprite(frameTexture);
  frame.width = bgW + 165;
  frame.height = bgH + 194;
  frame.anchor.set(0.5);


  container.addChild(bg);
  container.addChild(frame);

  const titleContainer = new Container();
  titleContainer.x = 0;
  titleContainer.y = -bgH / 2 - 20;

  const titleIcon = new Sprite(titleIconTexture);
  titleIcon.anchor.set(0.5);
  titleIcon.scale.set(0.1);

  const titleStyle = new TextStyle({
    fill: "#ffffff",
    fontFamily: "Comic Sans MS",
    fontSize: 30,
    fontWeight: "900",
    dropShadow: true,
    dropShadowColor: "#ffa4f1",
    dropShadowBlur: 6,
    dropShadowDistance: 0,
    stroke: { color: '#ff12d4ff', width: 4, join: "round" },
    lineJoin: "round",
  });

  const titleText = new Text({
    text: "SPACE WUYS",
    style: titleStyle,
  });

  titleText.anchor.set(0.5);
  titleText.y = 15;

  titleContainer.addChild(titleIcon);
  titleContainer.addChild(titleText);
  container.addChild(titleContainer);

  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  return container;
}
