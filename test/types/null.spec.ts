jest.mock('uuid')

import { mockUuid } from '../util'

import { $null } from '~/index'

import { v4 as uuid } from 'uuid'

describe('null', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($null).toMatchInlineSnapshot(`[Function]`)
    })

    test('simple', () => {
        expect($null()).toMatchInlineSnapshot(`
            Object {
              "type": "null",
              "uuid": "0001-000",
            }
        `)
    })
})
