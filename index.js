(() => {
})();

import { ChatHooks } from './modules/chat.js';
import { ImageHooks } from './modules/image.js';
import { PlayerHooks } from './modules/player.js';
import { ScenesHooks } from './modules/scenes.js';

Hooks.on("init", () => {
    ChatHooks();
    ImageHooks();
    PlayerHooks();
    ScenesHooks();
});

//----------------------------------------------
