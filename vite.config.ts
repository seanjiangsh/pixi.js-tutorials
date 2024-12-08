import process from "process";

if (process.env.NODE_ENV !== "development") {
  console.log(process.env);
}

export default {
  base: process.env.VITE_BASE || "/",
};
