import { describe, expect, it, beforeEach, vi } from 'vitest'
import fs from "fs/promises";
import dayjs from 'dayjs'
import subject from '@/src/replacements'
import { Replacement } from "./types";

const fragments: Replacement[] = [
  {
    id: '1',
    code: 'CODE1',
    replacement: 'REPL1',
    createdAt: dayjs('2022-01-01T12:30:00').toDate()
  },
  {
    id: '2',
    code: 'CODE2',
    replacement: 'REPL3',
    createdAt: dayjs('2022-01-01T12:35:00').toDate()
  }
]

fs.access = vi.fn().mockResolvedValue(true)
fs.readFile = vi.fn().mockResolvedValue(JSON.stringify(fragments))
fs.writeFile = vi.fn().mockResolvedValue(true)

describe('Replacement DB', () => {
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
  it('lists Replacement', async () => {
    const list:Replacement[] = await subject.index()
    expect(list).toHaveLength(fragments.length)
    expect(list).toHaveProperty("0.id", fragments[0].id)
    expect(list).toHaveProperty("1.id", fragments[1].id)
  })
  it('lists can search Replacement', async () => {
    const list:Replacement[] = await subject.index('1')
    expect(list).toHaveLength(1)
  })
  it('shows Replacement', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    const item:Replacement|undefined = await subject.show(id)
    expect(item).toBeDefined()
    expect(item?.id).toBe(id)
  })
  it('creates Replacement', async () => {
    const item:Replacement = {
      code: 'New',
      replacement: 'added'
    }
    const created = await subject.create(item)
    expect(created).toBeDefined()
    expect(created).toHaveProperty('id')
    expect(created).toHaveProperty('createdAt')
    const list = await subject.index()
    expect(list).toHaveLength(fragments.length + 1)
    const found = await subject.show(created?.id || '')
    expect(found).toBeDefined()
    expect(created).toHaveProperty('code', item.code)
  })
  it('updates replacement', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    const item:Replacement = {...fragments[0] as Replacement,
      replacement: 'Updated',
    }
    await subject.update(id, item)

    const updated = await subject.show(id)
    expect(updated).toBeDefined()
    expect(updated).toHaveProperty('id')
    expect(updated).toHaveProperty('replacement', item.replacement)
    expect(updated).toHaveProperty('updatedAt')
  })
  it('destroys replacement', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    const result = await subject.destroy(id)
    expect(result).toBeTruthy()
    const list = await subject.index()
    expect(list).toHaveLength(fragments.length - 1)
  })
})