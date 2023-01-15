import { describe, expect, it, beforeEach } from 'vitest'
import fs from "fs/promises";
import path from "path";
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

describe('fragments DB', () => {
  beforeEach(async () => {    
    await fs.writeFile(subject.dbFileName, JSON.stringify(fragments), {
      encoding: "utf8",
    })
    await subject.reset()
  })
  it('loads without error', () => {
    expect(subject).toHaveProperty('list')
    expect(subject).toHaveProperty('add')
  })
  it('lists fragments', async () => {
    const list:Fragment[] = await subject.list()
    expect(list).toHaveLength(fragments.length)
    expect(list).toHaveProperty("0.name", fragments[0].name)
    expect(list).toHaveProperty("1.name", fragments[1].name)
  })
  it('shows fragment', async () => {
    const id: string = fragments.at(0)?.id ?? ''
    const item:Fragment|undefined = await subject.show(id)
    expect(item).toBeDefined()
    expect(item?.id).toBe(id)
  })
  it('adds fragment', async () => {
    const item:Fragment = {
      name: 'New',
      description: 'added'
    }
    const id = await subject.add(item)
    expect(id).toBeDefined()

    // |undefined = await subject.show(fragments[0].id)
    // expect(item).toBeDefined()
    // expect(item?.id).toBe(fragments[0].id)
    // expect(item?.name).toBe(fragments[0].name)
  })

})
// import { setup, $fetch } from '@nuxt/test-utils'
// describe('My test', async () => {
//   await setup({
//     // test context options
//   })
//   test('my test', () => {
//     // ...
//   })
// })