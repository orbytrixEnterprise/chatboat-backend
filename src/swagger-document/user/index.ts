import tags from "../tag-constant";
import components from "./components";

import {
    guestUser,
    checkSocialUser,
    socialLoginUser,
    signupUser,
    loginUser,
    profileUser,
    updateProfileUser,
    searchUser,
    deleteAccountUser
} from "./api";

const user = {

    ...components,

    tags: [
        {
            name: tags.user,
            description: "User Authentication & Management API"
        }
    ],

    paths: {
        "/User/Guest": guestUser,
        "/User/CheckSocial": checkSocialUser,
        "/User/SocialLogin": socialLoginUser,
        "/User/Signup": signupUser,
        "/User/Login": loginUser,
        "/User/Profile": profileUser,
        "/User/UpdateProfile": updateProfileUser,
        "/User/Search": searchUser,
        "/User/DeleteAccount": deleteAccountUser
    }

};

export default user;