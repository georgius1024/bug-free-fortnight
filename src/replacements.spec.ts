import { describe, expect, it, beforeEach, vi } from 'vitest'
import fs from "fs/promises";
import dayjs from 'dayjs'
import subject from '@/src/replacements'
import { Replacement } from "./types";

const fragments: Replacement[] = [
  {
    code: 'CODE1',
    replacement: 'REPL1',
    createdAt: dayjs('2022-01-01T12:30:00').toDate()
  },
  {
    code: 'CODE2',
    replacement: 'REPL3',
    createdAt: dayjs('2022-01-01T12:35:00').toDate()
  }
]

fs.access = vi.fn().mockResolvedValue(true)
fs.readFile = vi.fn().mockResolvedValue(JSON.stringify(fragments))
fs.writeFile = vi.fn().mockResolvedValue(true)

describe('fragments DB', () => {
  beforeEach(async () => {    
    await subject.reload()
  })
  it('loads without error', () => {
    expect(subject).toHaveProperty('index')
    expect(subject).toHaveProperty('show')
    expect(subject).toHaveProperty('create')
    expect(subject).toHaveProperty('update')
    expect(subject).toHaveProperty('destroy')
  })
  it('lists fragments', async () => {
    const list:Replacement[] = await subject.index()
    expect(list).toHaveLength(fragments.length)
    expect(list).toHaveProperty("0.code", fragments[0].code)
    expect(list).toHaveProperty("1.code", fragments[1].code)
  })
  it('lists can search fragments', async () => {
    const list:Replacement[] = await subject.index('1')
    expect(list).toHaveLength(1)
  })
  it('shows replacement', async () => {
    const code: string = fragments.at(0)?.code ?? ''
    const item:Replacement|undefined = await subject.show(code)
    expect(item).toBeDefined()
    expect(item?.code).toBe(code)
  })
  it('creates replacement', async () => {
    const item:Replacement = {
      code: 'New',
      replacement: 'added'
    }
    const created = await subject.create(item)
    expect(created).toBeDefined()
    const list:Replacement[] = await subject.index()
    expect(list).toHaveLength(fragments.length + 1)
    const found = await subject.show(item.code)
    expect(found).toBeDefined()
    expect(found?.code).toBe(item.code)
  })
  it('updates replacement', async () => {
    const code: string = fragments.at(0)?.code ?? ''
    const item:Replacement = {...fragments[0] as Replacement,
      replacement: 'Updated',
    }
    await subject.update(code, item)

    const updated = await subject.show(code)
    expect(updated).toBeDefined()
    expect(updated?.code).toBe(code)
    expect(updated?.code).toBe(item.code)
    expect(updated?.updatedAt).toBeDefined()
  })
  it('destroys replacement', async () => {
    const code: string = fragments.at(0)?.code ?? ''
    await subject.destroy(code)
    const list = await subject.index()
    expect(list).toHaveLength(fragments.length - 1)
  })
})