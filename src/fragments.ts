import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import { Fragment } from "../src/types";
import { isTemplateNode } from "@vue/compiler-core";

interface FragmentDatabase {
  items: Fragment[];
}

const dbFileName: string = path.resolve("db", "fragments.json");

const data: Promise<FragmentDatabase> = load();
async function loadAndParse(): Promise<Fragment[]> {
  try {
    await fs.access(dbFileName);
    const contents: string = await fs.readFile(dbFileName, {
      encoding: "utf8",
    });
    return JSON.parse(contents) as Fragment[];
  } catch {
    return [];
  }
}
async function load(): Promise<FragmentDatabase> {
  return { items: await loadAndParse() };
}

async function save(): Promise<void> {
  const fragments: FragmentDatabase = await data;
  return fs.writeFile(dbFileName, JSON.stringify(fragments.items), {
    encoding: "utf8",
  });
}

async function reload() {
  const fragments: FragmentDatabase = await data;
  fragments.items = await loadAndParse();
}

async function replace(items: Fragment[]) {
  const fragments: FragmentDatabase = await data;
  fragments.items = [...items.map((e) => ({ ...e }))];
}

async function index(search: string = ""): Promise<Fragment[]> {
  const fragments: FragmentDatabase = await data;
  if (search) {
    return fragments.items.filter((item: Fragment): boolean =>
      item.description.toUpperCase().includes(search.toUpperCase())
    );
  }
  return fragments.items;
}

async function show(id: string): Promise<Fragment | undefined> {
  const fragments: FragmentDatabase = await data;
  return fragments.items.find((item: Fragment): Boolean => item.id === id);
}

async function create(fragment: Fragment): Promise<Fragment> {
  const fragments: FragmentDatabase = await data;
  const id: string = nanoid();
  const payload = {
    ...fragment,
    id,
    createdAt: new Date(),
  };
  fragments.items.push(payload);
  save();
  return payload;
}

async function update(id: string, fragment: Fragment): Promise<Fragment> {
  const fragments: FragmentDatabase = await data;
  const payload = { ...fragment, updatedAt: new Date() };
  fragments.items = fragments.items.map((item: Fragment): Fragment => {
    if (item.id === id) {
      return {...item, ...payload};
    }
    return item;
  });
  save();
  return payload;
}

async function destroy(id: string): Promise<string | null> {
  const fragments: FragmentDatabase = await data;
  const length = fragments.items.length;
  fragments.items = fragments.items.filter(
    (item: Fragment): Boolean => item.id !== id
  );
  save();
  if (length > fragments.items.length) {
    return id;
  }
  return null;
}

export default {
  dbFileName,
  reload,
  replace,
  index,
  show,
  create,
  update,
  destroy,
};
