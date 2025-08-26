import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Sequelize, DataTypes } from "sequelize";
import { initUserModel, User } from "./user";
import configAll from "../config/config.json";

type DB = {
  User: typeof User;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
} & {
  [key: string]: any;
};

const env = process.env.NODE_ENV ?? "development";
const config = configAll[env];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] || "", config);
} else {
  sequelize = new Sequelize(
    config.database || "",
    config.username || "",
    config.password || "",
    config
  );
}

const db: DB = {
  User: initUserModel(sequelize),
  sequelize,
  Sequelize,
};

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.endsWith(".js"))
  .forEach(async (file) => {
    const mod = await import(path.join(__dirname, file));
    const modelFactory = mod.default ?? mod;
    const model = modelFactory(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((name) => {
  if (typeof db[name].associate === "function") db[name].associate(db);
});

export default db;
