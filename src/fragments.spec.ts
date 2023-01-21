import { describe, expect, it, beforeEach, vi } from 'vitest'
import fs from "fs/promises";
import dayjs from 'dayjs'
import subject from '@/src/fragments'
import { Fragment } from "../src/types";

const fragments: Fragment[] = [
  {
    id: '101',
    name: 'Item1',
    description: 'desc1',
    createdAt: dayjs('2022-01-01T12:30:00').toDate()
  },
  {
    id: '102',
    name: 'Item2',
    description: 'desc2',
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
    const list:Fragment[] = await subject.index()
    expect(list).toHaveLength(fragments.length)
    expect(list).toHaveProperty("0.name", fragments[0].name)
    expect(list).toHaveProperty("1.name", fragments[1].name)
  })
  it('lists can search fragments', async () => {
    const list:Fragment[] = await subject.index('1')
    expect(list).toHaveLength(1)
  })
  it('shows fragment', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    const item:Fragment|undefined = await subject.show(id)
    expect(item).toBeDefined()
    expect(item?.id).toBe(id)
  })
  it('creates fragment', async () => {
    const item:Fragment = {
      name: 'New',
      description: 'added'
    }
    const created = await subject.create(item)
    expect(created).toBeDefined()
    const list:Fragment[] = await subject.index()
    expect(list).toHaveLength(fragments.length + 1)

    const found = await subject.show(created?.id || '')
    expect(found).toBeDefined()
    expect(found?.id).toBe(created.id)
  })
  it('updates fragment', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    const item:Fragment = {...fragments[0] as Fragment,
      name: 'Updated',
    }
    await subject.update(id, item)

    const updated = await subject.show(id)
    expect(updated).toBeDefined()
    expect(updated?.id).toBe(id)
    expect(updated?.name).toBe(item.name)
    expect(updated?.updatedAt).toBeDefined()
  })
  it('destroys fragment', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    await subject.destroy(id)
    const list = await subject.index()
    expect(list).toHaveLength(fragments.length - 1)
  })
})