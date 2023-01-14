import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import { Fragment } from "../src/types";

interface FragmentDatabase {
  items: Fragment[];
}
const data: Promise<FragmentDatabase> = load();

const dbFileName: string = path.resolve("..", "db", "fragments.json");

async function load(): Promise<FragmentDatabase> {
  try {
    await fs.access(dbFileName);
    const contents: string = await fs.readFile(dbFileName, {
      encoding: "utf8",
    });
    return { items: JSON.parse(contents) };
  } catch {
    return { items: [] };
  }
}

async function save(): Promise<void> {
  const fragments: FragmentDatabase = await data;
  return fs.writeFile(dbFileName, JSON.stringify(fragments.items), {
    encoding: "utf8",
  });
}

async function list(search: string = ""): Promise<Fragment[]> {
  const fragments: FragmentDatabase = await data;

  if (search) {
    return fragments.items.filter((item: Fragment): boolean =>
      item.description.toUpperCase().includes(search.toUpperCase())
    );
  }
  return fragments.items;
}

async function add(fragment: Fragment): Promise<void> {
  const fragments: FragmentDatabase = await data;

  fragments.items.push({
    ...fragment,
    id: nanoid(),
  });

  save();
}

export default {
  list,
  add
}