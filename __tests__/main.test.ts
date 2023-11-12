/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as github from '@actions/github'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('sets a failed status if not run on PR', async () => {
    github.context.eventName = 'push'
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation(key => {
      if (key === 'token') return 'test-token'
      return ''
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Workflow must be run on a Pull Request'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('should fail if "path" variable is not set', async () => {
    github.context.eventName = 'pull_request'

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation(key => {
      if (key === 'token') return 'test-token'
      return ''
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Variable "path" not set')
    expect(errorMock).not.toHaveBeenCalled()
  })
})
