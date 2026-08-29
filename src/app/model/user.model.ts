/* eslint-disable camelcase */
import { User } from "./mongodb/user.schema";
import { getNextSequenceValue } from "./mongodb/counter.schema";

function mapUserToSql(user: any) {
    if (!user) {
        return null;
    }
    return {
        user_id: user.userId,
        admin_id: user.adminId,
        name: user.name,
        email_id: user.emailId,
        mobile_no: user.mobileNo,
        user_type: user.userType,
        address: user.address,
        profile_image: user.profileImage,
        status: user.status,
        created_updated_by: user.createdUpdatedBy,
        creating_date: user.creatingDate,
        updating_date: user.updatingDate
    };
}

function extractRegexFromSql(sql: string, field: string): RegExp | null {
    if (!sql) {
        return null;
    }
    // Match LIKE "%value%"
    const likeRegex = new RegExp(`\`${field}\`\\s+LIKE\\s+["']%([^%']+)%["']`, 'i');
    let match = sql.match(likeRegex);
    if (match) {
        return new RegExp(match[1].trim(), 'i');
    }
    // Match = "value"
    const eqRegex = new RegExp(`\`${field}\`\\s*=\\s*["']([^'"]+)["']`, 'i');
    match = sql.match(eqRegex);
    if (match) {
        return new RegExp('^' + match[1].trim() + '$', 'i');
    }
    return null;
}

export class UserModel {

    async user(body: any) {
        switch (body.action) {
            case "SELECTBYID": {
                const user = await User.findOne({ userId: body.userId }).lean();
                return user ? [mapUserToSql(user)] : [];
            }

            case "CHECK": {
                const users = await User.find({
                    $or: [
                        { emailId: body.emailId },
                        { mobileNo: body.mobileNo }
                    ]
                }).lean();
                return users.map(mapUserToSql);
            }

            case "CHECK_PASSWORD": {
                const user = await User.findOne({ userId: body.userId, password: body.password }).lean();
                return user ? [mapUserToSql(user)] : [];
            }

            case "CHECK_USER_STATUS": {
                const user = await User.findOne({ userId: body.userId, status: "ACTIVE" }).lean();
                return user ? [mapUserToSql(user)] : [];
            }

            case "FORGOT_PASSWORD": {
                const user = await User.findOne({ emailId: body.emailId }).lean();
                return user ? [mapUserToSql(user)] : [];
            }

            case "PASSWORD_UPDATE":
            case "ADMIN_PASSWORD_UPDATE": {
                await User.updateOne(
                    { userId: body.userId },
                    {
                        password: body.password,
                        createdUpdatedBy: body.createdUpdatedBy,
                        updatingDate: new Date()
                    }
                );
                return 1;
            }

            case "INSERT": {
                const userId = await getNextSequenceValue("userId");
                const newUser = await User.create({
                    userId,
                    adminId: body.adminId || 0,
                    name: body.name,
                    emailId: body.emailId,
                    mobileNo: body.mobileNo,
                    password: body.password,
                    userType: body.userType,
                    address: body.address || "",
                    profileImage: body.profileImage || "",
                    status: body.status || "ACTIVE",
                    createdUpdatedBy: body.createdUpdatedBy || 0
                });
                return [mapUserToSql(newUser)];
            }

            case "UPDATE": {
                await User.updateOne(
                    { userId: body.userId },
                    {
                        name: body.name,
                        emailId: body.emailId,
                        mobileNo: body.mobileNo,
                        address: body.address,
                        profileImage: body.profileImage,
                        status: body.status,
                        createdUpdatedBy: body.createdUpdatedBy,
                        updatingDate: new Date()
                    }
                );
                return 1;
            }

            default:
                return 0;
        }
    }

    async login(body: any) {
        const user = await User.findOne({
            $or: [
                { emailId: body.identifier },
                { mobileNo: body.identifier }
            ],
            password: body.password
        }).lean();

        if (user) {
            if (user.status !== "ACTIVE") {
                return [{ status: 0, message: "Your account is inactive. Please contact admin." }];
            }
            return [{ status: 1, ...mapUserToSql(user) }];
        } else {
            return [{ status: 0, message: "Invalid login details." }];
        }
    }

    async userSearch(body: any) {
        const query: any = {};

        // Extract filters from SQL strings built by controller
        const nameFilter = extractRegexFromSql(body.fieldSearch, "u`.`name") || extractRegexFromSql(body.filter, "u`.`name");
        if (nameFilter) {
            query.name = nameFilter;
        }

        const emailFilter = extractRegexFromSql(body.fieldSearch, "u`.`email_id") || extractRegexFromSql(body.filter, "u`.`email_id");
        if (emailFilter) {
            query.emailId = emailFilter;
        }

        const mobileFilter = extractRegexFromSql(body.fieldSearch, "u`.`mobile_no") || extractRegexFromSql(body.filter, "u`.`mobile_no");
        if (mobileFilter) {
            query.mobileNo = mobileFilter;
        }

        const userTypeFilter = extractRegexFromSql(body.fieldSearch, "u`.`user_type") || extractRegexFromSql(body.filter, "u`.`user_type");
        if (userTypeFilter) {
            query.userType = userTypeFilter;
        }

        const statusFilter = extractRegexFromSql(body.fieldSearch, "u`.`status") || extractRegexFromSql(body.filter, "u`.`status");
        if (statusFilter) {
            query.status = statusFilter;
        }

        if (body.action === "COUNT") {
            const count = await User.countDocuments(query);
            return [{ count }];
        } else {
            const page = Number(body.page) || 1;
            const noOf = Number(body.noOf) || 10;

            const sort: any = {};
            if (body.orderBy && body.orderBy.trim().length > 0) {
                const parts = body.orderBy.split(",");
                for (const part of parts) {
                    const [col, dir] = part.trim().split(/\s+/);
                    if (col) {
                        const colMap: Record<string, string> = {
                            name: "name",
                            email_id: "emailId",
                            mobile_no: "mobileNo",
                            user_type: "userType",
                            status: "status"
                        };
                        const mongoCol = colMap[col] || col;
                        sort[mongoCol] = dir?.toUpperCase() === "DESC" ? -1 : 1;
                    }
                }
            } else {
                sort.creatingDate = -1;
            }

            const users = await User.find(query)
                .sort(sort)
                .skip((page - 1) * noOf)
                .limit(noOf)
                .lean();

            return users.map(mapUserToSql);
        }
    }
}
