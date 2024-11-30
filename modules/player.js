import { ReloadChat } from './chat.js';

var appPlayerList = undefined;

export function PlayerHooks() {
    Hooks.on("renderPlayerList", (app, html, data) => {
        appPlayerList = app;
        $(html).find('.player.gm').each((index, gmElement) => {
            var lastElement = gmElement;
            $(html).find('.player').not('.gm').each((index, playerElement) => {
                if(gmElement.dataset.userId === game.users.get(playerElement.dataset.userId).getFlag('westmarch', 'partyId')) {
                    let clone = playerElement.cloneNode(true);
                    gmElement.insertAdjacentElement('afterend', clone);
                    playerElement.remove();
                    lastElement = clone;
                }
            });
            lastElement.insertAdjacentHTML('afterend', '<hr/>');
        });
    });
    Hooks.on('getUserContextOptions', (html, contextMenu) => {
        contextMenu.push({
            name: "Join Party",
            icon: '<i class="fa-solid fa-users"></i>',
            callback: li => {
                game.user.setFlag("westmarch", "partyId",  li.data("userId")).then(() => { 
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.users.get(li.data("userId")).isGM
        });
        contextMenu.push({
            name: "Leave Party",
            icon: '<i class="fa-solid fa-user-minus"></i>',
            callback: li => {
                game.user.unsetFlag("westmarch", "partyId").then(() => {
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.user.id == li.data("userId") && game.users.get(li.data("userId")).getFlag('westmarch', 'partyId')
        });
    });
}
