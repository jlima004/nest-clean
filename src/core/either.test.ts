import { left, right } from './either'

test('success result', () => {
  const success = right('success')

  expect(success.value).toEqual('success')
})

test('error result', () => {
  const success = left('error')

  expect(success.value).toEqual('error')
})
