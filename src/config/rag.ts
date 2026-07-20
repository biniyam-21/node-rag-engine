import path from "path";

export const paths = {
  root: process.cwd(),

  knowledge: path.join(process.cwd(), "knowledge"),

  vectorDatabase: path.join(process.cwd(), "database"),

  logs: path.join(process.cwd(), "logs"),
};
