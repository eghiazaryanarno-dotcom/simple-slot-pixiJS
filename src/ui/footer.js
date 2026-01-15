import { Assets, Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { sound } from "@pixi/sound";
import { GAME_SETTINGS } from "../constants/gameSettings";
const { bgW, bgH, footerHeight } = GAME_SETTINGS;

const padding = 90;

export async function createFooter(background, startSpin, initialBet) {
  const footerContainer = new Container();
  let balanceValueText;

  const footer = new Graphics()
    .rect(0, 0, bgW, footerHeight)
    .fill({ color: "black", alpha: 0.55 });
  footerContainer.addChild(footer);

  const labelStyle = new TextStyle({
    fill: "#ff46e3ff",
    fontSize: 18,
    fontWeight: "bold",
    dropShadow: true,
    dropShadowColor: "#000000ff",
    dropShadowBlur: 4,
    dropShadowDistance: 4,
  });

  const valueStyle = new TextStyle({
    fill: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowDistance: 2,
  });

  const createInfo = (label, value, x, y, labelOffsetX) => {
    const c = new Container();
    const l = new Text({ text: label, style: labelStyle });
    const v = new Text({ text: `$${value}`, style: valueStyle });
    l.x = labelOffsetX;
    v.x = 80;
    v.y = -2;
    c.addChild(l, v);
    c.x = x;
    c.y = y;
    if (label === "CREDIT") balanceValueText = v;
    return c;
  };

  footerContainer.addChild(createInfo("CREDIT", "0", padding, 20, 0));
  footerContainer.addChild(
    createInfo("BET", initialBet.toString(), padding, 45, 30)
  );

  footerContainer.updateBalance = (amount) => {
    if (balanceValueText) balanceValueText.text = `$${amount.toLocaleString()}`;
  };

  const spinButton = new Container();
  const circle = new Graphics()
    .circle(0, 0, 40)
    .fill({ color: "black", alpha: 0.2 })
    .stroke({ width: 2, color: "white" });

  const arrows = new Sprite(await Assets.load("arrows.png"));
  const stop = new Sprite(await Assets.load("stop.png"));

  [arrows, stop].forEach((s) => {
    s.anchor.set(0.5);
    s.position.set(0, 0);
  });

  arrows.scale.set(0.12);
  arrows.alpha = 0.7;
  stop.scale.set(0.05);

  spinButton.addChild(circle, arrows, stop);

  footerContainer.updateButtons = (isRolling) => {
    arrows.visible = !isRolling;
    stop.visible = isRolling;
    spinButton.cursor = isRolling ? "default" : "pointer";
    spinButton.alpha = isRolling ? 0.5 : 1;
  };

  spinButton.eventMode = "static";
  spinButton.x = bgW - padding - 50;
  spinButton.y = footerHeight / 2 - 5;
  spinButton.on("pointerdown", () => startSpin());

  const playMusicTexture = await Assets.load("playMusic.png");
  const muteMusicTexture = await Assets.load("muteMusic.png");
  const playMusic = new Sprite(playMusicTexture);
  const muteMusic = new Sprite(muteMusicTexture);

  [playMusic, muteMusic].forEach((icon) => {
    icon.x = bgW - 35;
    icon.y = footerHeight / 2 + 15;
    icon.scale.set(0.018);
    icon.alpha = 0.8;
    icon.anchor.set(0.5);
    icon.eventMode = "static";
    icon.cursor = "pointer";
  });

  footerContainer.addChild(playMusic, muteMusic);
  playMusic.visible = false;

  sound.add("bgMusic", "bgMusic.mp3", { loop: true, volume: 0.3 });

  playMusic.on("pointertap", () => {
    sound.stop("bgMusic");
    playMusic.visible = false;
    muteMusic.visible = true;
  });

  muteMusic.on("pointertap", () => {
    sound.play("bgMusic");
    playMusic.visible = true;
    muteMusic.visible = false;
  });

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !event.repeat) {
      event.preventDefault();
      startSpin();
    }
  });

  footerContainer.addChild(spinButton);
  footerContainer.pivot.set(bgW / 2, footerHeight);
  footerContainer.x = background.x;
  footerContainer.y = background.y + bgH / 2;

  return footerContainer;
}
