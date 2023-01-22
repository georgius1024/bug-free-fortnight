import fs from "fs/promises";
import path from "path";

import { Fragment, Composition } from "../src/types";

const dbFileName: string = path.resolve("db", "composition.json");

const data: Promise<Composition> = load();
async function loadAndParse(): Promise<Composition> {
  try {
    await fs.access(dbFileName);
    const contents: string = await fs.readFile(dbFileName, {
      encoding: "utf8",
    });
    return JSON.parse(contents) as Composition;
  } catch {
    return [];
  }
}
async function load(): Promise<Composition> {
  return loadAndParse();
}

async function save(): Promise<void> {
  const composition: Composition = await data;
  return fs.writeFile(dbFileName, JSON.stringify(composition), {
    encoding: "utf8",
  });
}

async function replace(items: Composition) {
  const composition: Composition = await data;
  composition.length = items.length
  items.forEach((item, index) => {
    composition[index] = item
  })
}

async function show(): Promise<Composition> {
  return data;
}

async function update(items: Composition): Promise<Composition> {
  await replace(items)
  save();
  return data;
}


export default {
  replace,
  show,
  update
};
