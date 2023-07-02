import { Router } from "express";

import env from "../../env";

const frontendRouter = Router();

frontendRouter.get("/", (req, res) => {
    res.render("index", env);
});

frontendRouter.get("/login", (req, res) => {
    res.render("index", env);
})

frontendRouter.get("/signup", (req, res) => {
    res.render("signup", env);
});

frontendRouter.get("/chat", (req, res) => {
    res.render("chat", env);
})

// TODO: Handle 404 in frontend
// frontendRouter.use("*")

export default frontendRouter;
