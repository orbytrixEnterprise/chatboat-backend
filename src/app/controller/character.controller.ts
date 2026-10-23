import { Controller } from './controller';
import { CharacterService } from '../services';
import { applicationLogger, response, Global } from '../../configs';

export class CharacterController extends Controller {

    constructor() {
        super();
    }

    /**
     * Add a new Character (Admin or App User)
     */
    async add() {
        try {
            const userId = Number(await Global.getTokenValue(this.req, "id")) || 0;
            this.req.body.createdBy = userId;

            const result = await new CharacterService().addCharacter(this.req.body);
            return this.res.status(200).send({ status: 1, message: "Character created successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController add", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Update an existing Character (Admin or Character Creator)
     */
    async update() {
        try {
            const userId = Number(await Global.getTokenValue(this.req, "id")) || 0;
            const role = (await Global.getTokenValue(this.req, "role")) || "USER";
            const { characterId } = this.req.body;

            const result: any = await new CharacterService().updateCharacter(Number(characterId), this.req.body, userId, role);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Character not found." });
            }
            if (result.permissionDenied) {
                return this.res.status(200).send({ status: 0, message: "You do not have permission to modify this character." });
            }
            return this.res.status(200).send({ status: 1, message: "Character updated successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController update", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Delete a Character (Admin or Character Creator)
     */
    async delete() {
        try {
            const userId = Number(await Global.getTokenValue(this.req, "id")) || 0;
            const role = (await Global.getTokenValue(this.req, "role")) || "USER";
            const characterId = Number(this.req.params.characterId);

            const result: any = await new CharacterService().deleteCharacter(characterId, userId, role);
            if (result.permissionDenied) {
                return this.res.status(200).send({ status: 0, message: "You do not have permission to delete this character." });
            }
            if (result.deletedCount === 0) {
                return this.res.status(200).send({ status: 0, message: "Character not found or already deleted." });
            }
            return this.res.status(200).send({ status: 1, message: "Character deleted successfully." });
        } catch (err: any) {
            applicationLogger.error("CharacterController delete", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Select Character by characterId
     */
    async selectById() {
        try {
            const userId = Number(await Global.getTokenValue(this.req, "id")) || 0;
            const role = (await Global.getTokenValue(this.req, "role")) || "USER";
            const characterId = Number(this.req.params.characterId);

            const result: any = await new CharacterService().findById(characterId, userId, role);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Character not found." });
            }
            if (result.permissionDenied) {
                return this.res.status(200).send({ status: 0, message: "This character is private to its creator." });
            }
            return this.res.status(200).send({ status: 1, message: "Character details retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController selectById", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Search Characters with pagination, filters and sorting
     */
    async search() {
        try {
            const userId = Number(await Global.getTokenValue(this.req, "id")) || 0;
            const role = (await Global.getTokenValue(this.req, "role")) || "USER";

            const body = this.req.body;
            body.action = "COUNT";

            const countData = await new CharacterService().searchCharacters(body, userId, role);
            const total = countData.length > 0 ? countData[0].count : 0;

            if (total > 0) {
                body.action = "SELECT";
                const data = await new CharacterService().searchCharacters(body, userId, role);
                return this.res.status(200).send({ status: 1, message: "Characters retrieved successfully.", data: { data, page: body.page, noOf: body.noOf, total } });
            } else {
                return this.res.status(200).send({ status: 1, message: "No characters found.", data: { data: [], page: body.page, noOf: body.noOf, total: 0 } });
            }
        } catch (err: any) {
            applicationLogger.error("CharacterController search", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Free AI Character Avatar Image Generator (Pollinations.ai zero-cost engine)
     */
    async generateAvatar() {
        try {
            const result = await new CharacterService().generateAvatarImage(this.req.body);
            return this.res.status(200).send({ status: 1, message: "Avatar generated successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController generateAvatar", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: "Failed to generate character avatar. Please try again.", error: err.toString() });
        }
    }

    /**
     * Get characters created by the current authenticated user
     */
    async myCustomCharacters() {
        try {
            const userId = Number(await Global.getTokenValue(this.req, "id"));
            if (!userId) {
                return this.res.status(200).send({ status: 0, message: "User not identified." });
            }

            const { page = 1, noOf = 20, search = "", visibility = "ALL" } = this.req.body;
            const result = await new CharacterService().getMyCustomCharacters(userId, Number(page), Number(noOf), search, visibility);
            return this.res.status(200).send({ status: 1, message: "Your custom characters retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController myCustomCharacters", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }
}
