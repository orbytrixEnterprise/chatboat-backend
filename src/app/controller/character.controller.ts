import { Controller } from './controller';
import { CharacterService } from '../services';
import { applicationLogger, response } from '../../configs';

export class CharacterController extends Controller {

    constructor() {
        super();
    }

    /**
     * Add a new Character
     */
    async add() {
        try {
            // Set creator ID from auth payload if present, default 0 (Admin)
            if (this.req.user && this.req.user.id) {
                this.req.body.createdBy = Number(this.req.user.id);
            }
            const result = await new CharacterService().addCharacter(this.req.body);
            return this.res.status(200).send({ status: 1, message: "Character created successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController add", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Update an existing Character
     */
    async update() {
        try {
            const { characterId } = this.req.body;
            const result = await new CharacterService().updateCharacter(Number(characterId), this.req.body);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Character not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Character updated successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CharacterController update", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Delete a Character
     */
    async delete() {
        try {
            const characterId = Number(this.req.params.characterId);
            const result = await new CharacterService().deleteCharacter(characterId);
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
            const characterId = Number(this.req.params.characterId);
            const result = await new CharacterService().findById(characterId);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Character not found." });
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
            const body = this.req.body;
            body.action = "COUNT";

            const countData = await new CharacterService().searchCharacters(body);
            const total = countData.length > 0 ? countData[0].count : 0;

            if (total > 0) {
                body.action = "SELECT";
                const data = await new CharacterService().searchCharacters(body);
                return this.res.status(200).send({ status: 1, message: "Characters retrieved successfully.", data: { data, page: body.page, noOf: body.noOf, total } });
            } else {
                return this.res.status(200).send({ status: 1, message: "No characters found.", data: { data: [], page: body.page, noOf: body.noOf, total: 0 } });
            }
        } catch (err: any) {
            applicationLogger.error("CharacterController search", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }
}
