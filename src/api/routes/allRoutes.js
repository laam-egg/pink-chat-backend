import Router from "express";

const allRoutes = Router();

allRoutes.get("/", (req, res) => {
  res.status(200).frontend...
});

allRoutes.use("/api/v1", apiController...);

export default allRoutes;
