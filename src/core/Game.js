import {
  Application,
  Assets,
  Sprite,
  Texture,
  BlurFilter
} from "pixi.js";
import { createBackground } from "../ui/background.js";
import { createFooter } from "../ui/footer.js";
import { createGrid } from "../slot/createGrid.js";
import { createReels } from "../slot/createReels.js";
import { SLOT_TEXTURES_URLS } from "../constants/slotTextures.js";
import { generateReelResult } from "./GenerateReelResult.js";
import { winCheck, clearWinLines } from "./winChecker.js";
import { GAME_SETTINGS } from "../constants/gameSettings.js";

export const STATES = {
  IDLE: "IDLE",
  SPINNING: "SPINNING",
  SHOW_WIN: "SHOW_WIN",
};

export async function initGame() {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x171717,
    antialias: true,
  });
  document.body.appendChild(app.canvas);

  const textureUrls = SLOT_TEXTURES_URLS.map((item) => item.url);
  await Assets.load(["background.jpg", ...textureUrls]);

  const mainBackground = new Sprite(Texture.from("background.jpg"));
  mainBackground.width = app.screen.width;
  mainBackground.height = app.screen.height;
  mainBackground.alpha = 0.5;
  const blurFilter = new BlurFilter();
  blurFilter.strength = 4;
  mainBackground.filters = [blurFilter];

  app.stage.addChild(mainBackground);

  const slotTextures = textureUrls.map((url) => Texture.from(url));
  const uiBackground = await createBackground(app);
  const { gridContainer, columns } = await createGrid(app);

  const handleStateChange = (newState, result) => {
    if (newState === STATES.SHOW_WIN) {
      setTimeout(() => {
        const winAmount = winCheck(
          result,
          gridContainer,
          GAME_SETTINGS.currentBeT,
        );
        if (winAmount > 0) {
          GAME_SETTINGS.balance += winAmount;
          footer.updateBalance(GAME_SETTINGS.balance);
        }
        setTimeout(() => reelController.setIdle(), 100);
      }, 100);
    }
  };

  const initialResult = generateReelResult();

  const reelController = createReels(
    app,
    slotTextures,
    columns,
    initialResult,
    handleStateChange,
  );

  const handleSpin = () => {
    if (reelController.getCurrentState() !== STATES.IDLE) return;
    if (GAME_SETTINGS.balance < GAME_SETTINGS.currentBeT) return;

    clearWinLines(gridContainer);

    GAME_SETTINGS.balance -= GAME_SETTINGS.currentBeT;
    footer.updateBalance(GAME_SETTINGS.balance);
    reelController.startSpin();
  };

  const footer = await createFooter(
    uiBackground,
    handleSpin,
    GAME_SETTINGS.currentBeT,
  );
  footer.updateBalance(GAME_SETTINGS.balance);

  app.ticker.add(() => {
    const isBusy = reelController.getCurrentState() !== STATES.IDLE;
    footer.updateButtons(isBusy);
  });

  app.stage.addChild(uiBackground, gridContainer, footer);
}
