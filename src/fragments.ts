import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import { Fragment } from "../src/types";

interface FragmentDatabase {
  items: Fragment[];
}

const fileName = process.env.NODE_ENV === 'test' ? "fragments.test.json" : "fragments.json"
const dbFileName: string = path.resolve(__dirname, "..", "db", fileName);

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

async function reset() {
  const fragments: FragmentDatabase = await data;
  fragments.items = await loadAndParse();
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

async function show(id: string): Promise<Fragment | undefined> {
  const fragments: FragmentDatabase = await data;
  return fragments.items.find((item: Fragment): Boolean => item.id === id)
}

async function add(fragment: Fragment): Promise<string> {
  const fragments: FragmentDatabase = await data;
  const id: string = nanoid()
  fragments.items.push({
    ...fragment,
    id,
    createdAt: new Date()
  });
  save();
  return id
}

async function update(id: string, fragment: Fragment): Promise<void> {
  const fragments: FragmentDatabase = await data;
  fragments.items = fragments.items.map((item: Fragment): Fragment => {
    if (item.id === id) {
      return { ...fragment, updatedAt: new Date() }
    }
    return item
  });
  save();
}

async function destroy(id: string): Promise<void> {
  const fragments: FragmentDatabase = await data;
  fragments.items = fragments.items.filter((item: Fragment): Boolean => {
    return (item.id === id)
  })
  save();
}

export default {
  dbFileName,
  reset,
  list,
  show,
  add,
  update,
  destroy
}