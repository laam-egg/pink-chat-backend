import { Router } from "express";

const frontendRouter = Router();

frontendRouter.get("/", (req, res) => {
    res.render("index");
});

frontendRouter.get("/signup", (req, res) => {
    res.render("signup");
})

// TODO: Handle 404 in frontend
// frontendRouter.use("*")

export default frontendRouter;
