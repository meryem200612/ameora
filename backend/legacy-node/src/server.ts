import app from "./app"; import config from "./config"; app.listen(config.PORT,()=>console.log(`Ameora API listening on ${config.PORT}`));
