export function ScenesHooks() {
    Hooks.on('getSceneNavigationContext', (html, contextMenu) => {
        contextMenu.push({
            name: "Go With Party",
            icon: '<i class="fa-solid fa-people-arrows"></i>',
            callback: li => {
                var destination = game.scenes.get(li.data("sceneId"));
                GoWithParty(destination);
            },
            condition: li => game.user.isGM
        });
    });
    Hooks.on('getSceneDirectoryEntryContext', (html, contextMenu) => {
        contextMenu.push({
            name: "Go With Party",
            icon: '<i class="fa-solid fa-people-arrows"></i>',
            callback: li => {
                var destination = game.scenes.get(li.data("documentId"));
                GoWithParty(destination);
            },
            condition: li => game.user.isGM
        });
    });
}

function GoWithParty(destination){
    game.users.forEach(user => { 
        if (user.getFlag("westmarch", "partyId") == game.user.getFlag("westmarch", "partyId")) {
            game.socket.emit("pullToScene", destination.id, user.id);
        }
    });
}