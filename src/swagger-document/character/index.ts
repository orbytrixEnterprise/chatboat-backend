import tags from "../tag-constant";
import components from "./components";

import {
    addCharacter,
    updateCharacter,
    selectByIdCharacter,
    searchCharacter,
    deleteCharacter
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
        "/Character/Update": updateCharacter,
        "/Character/SelectById/{characterId}": selectByIdCharacter,
        "/Character/Search": searchCharacter,
        "/Character/Delete/{characterId}": deleteCharacter
    }

};

export default character;
