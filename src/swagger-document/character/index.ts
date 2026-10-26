import tags from "../tag-constant";
import components from "./components";

import {
    addCharacter,
    createMyCharacter,
    updateCharacter,
    selectByIdCharacter,
    searchCharacter,
    deleteCharacter,
    generateAvatarCharacter,
    myCustomCharacters
} from "./api";

const character = {

    ...components,

    tags: [
        {
            name: tags.character,
            description: "AI Character Persona Management APIs"
        }
    ],

    paths: {
        "/Character/Add": addCharacter,
        "/Character/CreateMyCharacter": createMyCharacter,
        "/Character/Update": updateCharacter,
        "/Character/SelectById/{characterId}": selectByIdCharacter,
        "/Character/Search": searchCharacter,
        "/Character/Delete/{characterId}": deleteCharacter,
        "/Character/GenerateAvatar": generateAvatarCharacter,
        "/Character/MyCustomCharacters": myCustomCharacters
    }

};

export default character;
