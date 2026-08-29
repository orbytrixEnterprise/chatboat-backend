import tags from "../tag-constant";
import components from "./components";

import {
    loginUser,
    selectByIdUser,
    searchUser,
    passwordUpdateUser,
    adminPasswordUpdateUser,
    forgotPasswordUser,
    resetPasswordUser
} from "./api";

const user = {

    ...components,

    tags: [
        {
            name: tags.user,
            description: "User & Company Management API"
        }
    ],

    paths: {
        "/User/Login": loginUser,
        "/User/SelectById/{userId}": selectByIdUser,
        "/User/Search": searchUser,
        "/User/PasswordUpdate": passwordUpdateUser,
        "/User/AdminPasswordUpdate": adminPasswordUpdateUser,
        "/User/ForgotPassword": forgotPasswordUser,
        "/User/ResetPassword": resetPasswordUser
    }

};

export default user;