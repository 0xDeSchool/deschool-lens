import React from 'react'
import renderer from 'react-test-renderer'
import { expect } from 'vitest'
import Link from '../../src/components/link'

function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  return result as renderer.ReactTestRendererJSON
}

test('Link changes the class when hovered', () => {
  const component = renderer.create(<Link page="https://deschool.app/landing">Deschool</Link>)
  const tree = toJson(component)
  expect(tree).toMatchSnapshot()
})
