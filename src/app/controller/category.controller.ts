import { Controller } from './controller';
import { CategoryService } from '../services';
import { applicationLogger, response } from '../../configs';

export class CategoryController extends Controller {

    constructor() {
        super();
    }

    /**
     * Add a new Category
     */
    async add() {
        try {
            const isExist = await new CategoryService().findByName(this.req.body.name);
            if (isExist) {
                return this.res.status(200).send({ status: 0, message: "Category with this name already exists." });
            }
            const result = await new CategoryService().addCategory(this.req.body);
            return this.res.status(200).send({ status: 1, message: "Category created successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CategoryController add", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Update an existing Category
     */
    async update() {
        try {
            const { categoryId, name } = this.req.body;
            if (name) {
                const isExist = await new CategoryService().findByName(name, Number(categoryId));
                if (isExist) {
                    return this.res.status(200).send({ status: 0, message: "Category with this name already exists." });
                }
            }
            const result = await new CategoryService().updateCategory(Number(categoryId), this.req.body);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Category not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Category updated successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CategoryController update", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Delete a Category
     */
    async delete() {
        try {
            const categoryId = Number(this.req.params.categoryId);
            const result = await new CategoryService().deleteCategory(categoryId);
            if (result.deletedCount === 0) {
                return this.res.status(200).send({ status: 0, message: "Category not found or already deleted." });
            }
            return this.res.status(200).send({ status: 1, message: "Category deleted successfully." });
        } catch (err: any) {
            applicationLogger.error("CategoryController delete", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Select Category by categoryId
     */
    async selectById() {
        try {
            const categoryId = Number(this.req.params.categoryId);
            const result = await new CategoryService().findById(categoryId);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Category not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Category details retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("CategoryController selectById", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Search Categories with pagination, filters and sorting
     */
    async search() {
        try {
            const body = this.req.body;
            body.action = "COUNT";

            const countData = await new CategoryService().searchCategories(body);
            const total = countData.length > 0 ? countData[0].count : 0;

            if (total > 0) {
                body.action = "SELECT";
                const data = await new CategoryService().searchCategories(body);
                return this.res.status(200).send({ status: 1, message: "Categories retrieved successfully.", data: { data, page: body.page, noOf: body.noOf, total } });
            } else {
                return this.res.status(200).send({ status: 1, message: "No categories found.", data: { data: [], page: body.page, noOf: body.noOf, total: 0 } });
            }
        } catch (err: any) {
            applicationLogger.error("CategoryController search", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }
}
