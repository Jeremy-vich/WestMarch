(() => {
})();

import { ChatHooks, ReloadChat } from './modules/chat.js';

Hooks.on("init", () => {
    ChatHooks();
});

function AddPlayerOptions(caracterOption) {
    if (!caracterOption) {
        console.error("L'élément avec l'ID spécifié n'existe pas.");
        return;
    }

    const playerLayer = caracterOption.children[1];

    if (!playerLayer) {
        console.error("Le deuxième enfant de 'caracterOption' n'existe pas.");
        return;
    }

    const gms = game?.users;
    if (!gms) {
        console.error("'game.users' est introuvable.");
        return;
    }

    let fullyHtml = `
        <fieldset>
            <legend>Party</legend>
            <div class="form-group stacked character">
                <div class="form-fields">
                    <select name="gms">
                        <option value=""></option>
    `;
    gms.forEach((user) => {
        if (user.isGM) {
            if(game.user.getFlag('westmarch', 'partyId') === user.id) {
                fullyHtml += `<option selected value="${user.id}">${user.name}</option>`;
            } else {
                fullyHtml += `<option value="${user.id}">${user.name}</option>`;
            }       
        }
    });
    fullyHtml += `
                    </select>
                </div>
                <p class="hint">Select you'r DM and join party.</p>
            </div>
        </fieldset>
    `;

    playerLayer.insertAdjacentHTML('afterend', fullyHtml);

    const selectElement = document.getElementsByName("gms")[0];
    selectElement.addEventListener('change', (event) => {
        if (!event.target.value) {
            game.user.unsetFlag("westmarch", "partyId").then(() => {
                ReloadChat();
            });
        } else {
            game.user.setFlag("westmarch", "partyId",  event.target.value).then(() => { 
                ReloadChat();
            });
        }
    });
}

Hooks.on("renderUserConfig", (app, html, data) => {
    AddPlayerOptions(html.children[2].children[0]);
});

//----------------------------------------------

Hooks.on("getImagePopoutHeaderButtons", (application, buttons) => {
    if (!game.user.isGM)
        return;
    buttons.unshift({
        label: "Show Party",
        class: "share-image-party",
        icon: "fas fa-user",
        onclick: () => {
            let users = game.users.filter(user => user.id != game.user.id && user.getFlag("westmarch", "partyId") == game.user.getFlag("westmarch", "partyId"));
            if(users.length > 0) {
                application.shareImage({users: users.map(user => user.id)});
            }
        },
        condition: li => game.user.isGM
    });
});

//----------------------------------------------

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

function GoWithParty(destination){
    game.users.forEach(user => { 
        if (user.getFlag("westmarch", "partyId") == game.user.getFlag("westmarch", "partyId")) {
            game.socket.emit("pullToScene", destination.id, user.id);
        }
    });
}