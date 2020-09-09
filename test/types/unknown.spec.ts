jest.mock('uuid')

import { mockUuid } from '../util'

import { $unknown } from '~/index'

import { v4 as uuid } from 'uuid'

describe('unknown', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($unknown).toMatchInlineSnapshot(`[Function]`)
    })

    test('simple', () => {
        expect($unknown()).toMatchInlineSnapshot(`
            Object {
              "type": "unknown",
              "uuid": "0001-000",
            }
        `)
    })
})
