import { Router } from "express";
import {
    addurl,
    geturls,
    increaseViewer
} from "../controllers/redirect.controller.js";

import { checkForUserAuthentication } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/loggedin/:user_id/redirect").patch(checkForUserAuthentication, addurl);
router.route("/loggedin/:user_id/urls").get(checkForUserAuthentication, geturls);
router.route("/linkly/:web_id").patch(increaseViewer);

export default router;