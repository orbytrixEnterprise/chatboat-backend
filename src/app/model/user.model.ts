/* eslint-disable camelcase */
import { User } from "./mongodb/user.schema";
import { getNextSequenceValue } from "./mongodb/counter.schema";
import { MongoHelperService } from "../../services";

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
        return MongoHelperService.search(
            User,
            body,
            mapUserToSql,
            {
                filterFields: {
                    "u`.`name": "name",
                    "u`.`email_id": "emailId",
                    "u`.`mobile_no": "mobileNo",
                    "u`.`user_type": "userType",
                    "u`.`status": "status",
                    "u`.`admin_id": "adminId"
                },
                sortFields: {
                    name: "name",
                    email_id: "emailId",
                    mobile_no: "mobileNo",
                    user_type: "userType",
                    status: "status"
                }
            }
        );
    }
}
