/* eslint-disable camelcase */
import { Category, getNextSequenceValue } from '../model';
import { MongoHelperService } from '../../services';

export class CategoryService {

    /**
     * Create a new Category
     */
    async addCategory(data: any) {
        const categoryId = await getNextSequenceValue("categoryId");
        const newCategory = await Category.create({
            categoryId,
            name: data.name,
            priority: data.priority ?? 0,
            status: data.status || "ACTIVE"
        });
        return newCategory.toObject();
    }

    /**
     * Update an existing Category
     */
    async updateCategory(categoryId: number, data: any) {
        const updated = await Category.findOneAndUpdate(
            { categoryId },
            {
                $set: {
                    name: data.name,
                    priority: data.priority,
                    status: data.status,
                    updatingDate: new Date()
                }
            },
            { returnDocument: 'after' }
        ).lean();
        return updated;
    }

    /**
     * Fetch Category by numeric ID
     */
    async findById(categoryId: number) {
        return Category.findOne({ categoryId }).lean();
    }

    /**
     * Fetch Category by name (case-insensitive), optionally excluding a categoryId
     */
    async findByName(name: string, excludeCategoryId?: number) {
        const query: any = { name: new RegExp(`^${name.trim()}$`, 'i') };
        if (excludeCategoryId) {
            query.categoryId = { $ne: excludeCategoryId };
        }
        return Category.findOne(query).lean();
    }

    /**
     * Delete a Category
     */
    async deleteCategory(categoryId: number) {
        return Category.deleteOne({ categoryId });
    }

    /**
     * Search Categories with pagination, filters and sorting
     */
    async searchCategories(body: any) {
        return MongoHelperService.search(
            Category,
            body,
            (c) => ({
                category_id: c.categoryId,
                name: c.name,
                priority: c.priority,
                status: c.status,
                creating_date: c.creatingDate,
                updating_date: c.updatingDate
            }),
            {
                filterFields: {
                    status: "status"
                },
                sortFields: {
                    name: "name",
                    priority: "priority",
                    creatingDate: "creatingDate",
                    updatingDate: "updatingDate"
                }
            }
        );
    }
}
