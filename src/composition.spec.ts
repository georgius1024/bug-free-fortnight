import { describe, expect, it, beforeEach, vi } from 'vitest'
import fs from "fs/promises";
import dayjs from 'dayjs'
import subject from '@/src/composition'
import { Composition } from "../src/types";

const composition: Composition = ['101', '102']

fs.access = vi.fn().mockResolvedValue(true)
fs.readFile = vi.fn().mockResolvedValue(JSON.stringify(composition))
fs.writeFile = vi.fn().mockResolvedValue(true)

describe('composition DB', () => {
  beforeEach(async () => {    
    await subject.replace(composition)
  })
  it('loads without error', () => {
    expect(subject).toHaveProperty('show')
    expect(subject).toHaveProperty('update')
  })
  it('shows composition', async () => {
    const list = await subject.show()
    expect(list).toBeDefined()
    expect(list).toHaveLength(composition.length)
  })
  it('updates composition', async () => {
    const changed = [...composition, '109']
    const list = await subject.update(changed)
    expect(list).toBeDefined()
    expect(list).toHaveLength(changed.length)
  })
})