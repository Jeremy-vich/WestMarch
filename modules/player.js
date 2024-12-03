import { ReloadChat } from './chat.js';

var appPlayerList = undefined;

export function PlayerHooks() {
    Hooks.on("renderPlayerList", (app, html, data) => {
        appPlayerList = app;
        $(html).find('.players-mode').after(`<i class="fa-solid fa-arrows-rotate" style="float: right;"></i>`);
        $(html).find('.fa-arrows-rotate').click((event) => { 
            event.stopPropagation();
            appPlayerList.render();
        });
        $(html).find('.player.gm').each((index, gmElement) => {
            var user = game.users.get(gmElement.dataset.userId);
            if(user.getFlag('westmarch', 'partyId') === user.id) { 
                gmElement.insertAdjacentHTML('beforebegin', '<hr style="border: 1px solid '+$(gmElement).find('span').css('background-color')+'"/>');
            }
            if(user.getFlag('westmarch', 'partyId') === user.id) {
                var lastElement = gmElement;
                $(html).find('.player').each((index, playerElement) => {
                    if(playerElement.dataset.userId !== gmElement.dataset.userId && game.users.get(gmElement.dataset.userId).getFlag('westmarch', 'partyId') == game.users.get(playerElement.dataset.userId).getFlag('westmarch', 'partyId')) {
                        let clone = playerElement.cloneNode(true);
                        gmElement.insertAdjacentElement('afterend', clone);
                        playerElement.remove();
                        lastElement = clone;
                    }
                });
                if(lastElement)
                    lastElement.insertAdjacentHTML('afterend', '<hr style="border: 1px solid '+$(gmElement).find('span').css('background-color')+'"/>');
                else
                    gmElement.insertAdjacentHTML('afterend', '<hr style="border: 1px solid '+$(gmElement).find('span').css('background-color')+'"/>');
            }
        });
    });
    Hooks.on('getUserContextOptions', (html, contextMenu) => {
        contextMenu.push({
            name: "Create Party",
            icon: '<i class="fa-solid fa-users"></i>',
            callback: li => {
                game.user.setFlag("westmarch", "partyId",  game.user.id).then(() => { 
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.users.get(li.data("userId")).isGM && game.user.id == li.data("userId") && game.user.id != game.user.getFlag('westmarch', 'partyId')
        });
        contextMenu.push({
            name: "Join Party",
            icon: '<i class="fa-solid fa-user-plus"></i>',
            callback: li => {
                game.user.setFlag("westmarch", "partyId",  li.data("userId")).then(() => { 
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.users.get(li.data("userId")).isGM && game.users.get(li.data("userId")).getFlag('westmarch', 'partyId') == li.data("userId") && game.user.id != li.data("userId")
        });
        contextMenu.push({
            name: "Leave Party",
            icon: '<i class="fa-solid fa-user-minus"></i>',
            callback: li => {
                if(game.user.isGM && game.user.id == game.user.getFlag('westmarch', 'partyId')) {
                    game.users.forEach(user => { 
                        if(user.getFlag("westmarch", "partyId") == game.user.id) {
                            user.unsetFlag("westmarch", "partyId");
                        }
                    });
                }
                game.user.unsetFlag("westmarch", "partyId").then(() => {
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.user.id == li.data("userId") && game.users.get(li.data("userId")).getFlag('westmarch', 'partyId')
        });
        contextMenu.push({
            name: "Kick Party",
            icon: '<i class="fa-solid fa-users-slash"></i>',
            callback: li => {
                game.users.get(li.data("userId")).unsetFlag("westmarch", "partyId").then(() => { 
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.user.isGM && game.users.get(li.data("userId")).getFlag('westmarch', 'partyId') && game.user.id != li.data("userId")
        });
        contextMenu.push({
            name: "Invite Party",
            icon: '<i class="fa-solid fa-user-tag"></i>',
            callback: li => {
                game.users.get(li.data("userId")).setFlag("westmarch", "partyId", game.user.getFlag('westmarch', 'partyId')).then(() => { 
                    ReloadChat();
                    appPlayerList.render();
                });
            },
            condition: li => game.user.isGM && game.users.get(li.data("userId")).getFlag('westmarch', 'partyId') != game.user.getFlag('westmarch', 'partyId') && game.user.id != li.data("userId")
        });
    });
}
