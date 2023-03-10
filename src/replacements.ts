import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import { Replacement } from "./types";

interface ReplacementDatabase {
  items: Replacement[];
}

const dbFileName: string = path.resolve("db", "replacements.json");

const data: Promise<ReplacementDatabase> = load();
async function loadAndParse(): Promise<Replacement[]> {
  try {
    await fs.access(dbFileName);
    const contents: string = await fs.readFile(dbFileName, {
      encoding: "utf8",
    });
    return JSON.parse(contents) as Replacement[];
  } catch {
    return [];
  }
}
async function load(): Promise<ReplacementDatabase> {
  return { items: await loadAndParse() };
}

async function save(): Promise<void> {
  const Replacements: ReplacementDatabase = await data;
  return fs.writeFile(dbFileName, JSON.stringify(Replacements.items), {
    encoding: "utf8",
  });
}

async function reload() {
  const Replacements: ReplacementDatabase = await data;
  Replacements.items = await loadAndParse();
}

async function replace(items: Replacement[]) {
  const Replacements: ReplacementDatabase = await data;
  Replacements.items = [...items.map((e) => ({ ...e }))];
}

async function index(search: string = ""): Promise<Replacement[]> {
  const Replacements: ReplacementDatabase = await data;
  if (search) {
    return Replacements.items.filter(
      (item: Replacement): boolean =>
        item.code.toUpperCase().includes(search.toUpperCase()) ||
        item.replacement.toUpperCase().includes(search.toUpperCase())
    );
  }
  return Replacements.items;
}

async function show(id: string): Promise<Replacement | undefined> {
  const Replacements: ReplacementDatabase = await data;
  return Replacements.items.find(
    (item: Replacement): Boolean => item.id === id
  );
}

async function create(replacement: Replacement): Promise<Replacement> {
  const Replacements: ReplacementDatabase = await data;
  const id: string = nanoid();
  const payload = {
    ...replacement,
    id,
    createdAt: new Date(),
  };
  Replacements.items.push(payload);
  save();
  return payload;
}

async function update(
  id: string,
  replacement: Replacement
): Promise<Replacement> {
  const Replacements: ReplacementDatabase = await data;
  const payload = { ...replacement, updatedAt: new Date() };
  Replacements.items = Replacements.items.map(
    (item: Replacement): Replacement => {
      if (item.id === id) {
        return { ...item, ...payload };
      }
      return item;
    }
  );
  save();
  return payload;
}

async function destroy(id: string): Promise<string | null> {
  const Replacements: ReplacementDatabase = await data;
  const length = Replacements.items.length;
  Replacements.items = Replacements.items.filter(
    (item: Replacement): Boolean => item.id !== id
  );
  save();
  if (length > Replacements.items.length) {
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
