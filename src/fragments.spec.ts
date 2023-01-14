import { describe, expect, it } from 'vitest'

import subject from '@/src/fragments'

describe('fragments DB', () => {
  it('loads without error', () => {
    expect(subject).toHaveProperty('list')
    expect(subject).toHaveProperty('add')
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