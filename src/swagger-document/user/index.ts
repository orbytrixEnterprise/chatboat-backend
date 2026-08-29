import tags from "../tag-constant";
import components from "./components";

import {
    guestUser,
    socialLoginUser,
    signupUser,
    loginUser,
    profileUser,
    updateProfileUser
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
        "/User/SocialLogin": socialLoginUser,
        "/User/Signup": signupUser,
        "/User/Login": loginUser,
        "/User/Profile": profileUser,
        "/User/UpdateProfile": updateProfileUser
    }

};

export default user;