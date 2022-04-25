/**
 * Generated by @zefiros-software/therefore@v0.0.1
 * Do not manually touch this
 */

/* eslint-disable */

import type { ValidateFunction } from 'ajv'

import AjvValidator from 'ajv'

export interface Square {
    size: number
}

export const Square = {
    validate: require('./schemas/square.schema.js') as ValidateFunction<Square>,
    get schema() {
        return Square.validate.schema
    },
    source: `${__dirname}shapes.schema`,
    sourceSymbol: 'square',
    is: (o: unknown): o is Square => Square.validate(o) === true,
    assert: (o: unknown): asserts o is Square => {
        if (!Square.validate(o)) {
            throw new AjvValidator.ValidationError(Square.validate.errors ?? [])
        }
    },
} as const

export interface Rectangle {
    width: number
    height: number
}

export const Rectangle = {
    validate: require('./schemas/rectangle.schema.js') as ValidateFunction<Rectangle>,
    get schema() {
        return Rectangle.validate.schema
    },
    source: `${__dirname}shapes.schema`,
    sourceSymbol: 'rectangle',
    is: (o: unknown): o is Rectangle => Rectangle.validate(o) === true,
    assert: (o: unknown): asserts o is Rectangle => {
        if (!Rectangle.validate(o)) {
            throw new AjvValidator.ValidationError(Rectangle.validate.errors ?? [])
        }
    },
} as const

export interface Circle {
    radius: number
}

export const Circle = {
    validate: require('./schemas/circle.schema.js') as ValidateFunction<Circle>,
    get schema() {
        return Circle.validate.schema
    },
    source: `${__dirname}shapes.schema`,
    sourceSymbol: 'circle',
    is: (o: unknown): o is Circle => Circle.validate(o) === true,
    assert: (o: unknown): asserts o is Circle => {
        if (!Circle.validate(o)) {
            throw new AjvValidator.ValidationError(Circle.validate.errors ?? [])
        }
    },
} as const

export type Shape = Square | Rectangle | Circle

export const Shape = {
    validate: require('./schemas/shape.schema.js') as ValidateFunction<Shape>,
    get schema() {
        return Shape.validate.schema
    },
    source: `${__dirname}shapes.schema`,
    sourceSymbol: 'shape',
    is: (o: unknown): o is Shape => Shape.validate(o) === true,
    assert: (o: unknown): asserts o is Shape => {
        if (!Shape.validate(o)) {
            throw new AjvValidator.ValidationError(Shape.validate.errors ?? [])
        }
    },
} as const
