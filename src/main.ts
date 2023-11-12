import * as core from '@actions/core'
import * as github from '@actions/github'
import { readFile } from 'fs/promises'
import { TestCoverageReport } from './models/test-coverage-report'
import { renderToMarkdown } from './render'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('token', { required: true })
    if (!token) {
      core.setFailed("'token' is missing")
      return
    }

    if (github.context.eventName !== 'pull_request') {
      core.setFailed('Workflow must be run on a Pull Request')
    }

    const path = core.getInput('path', { required: true })
    core.debug(path)
    if (!path) {
      core.setFailed('Variable "path" not set')
    }

    const file = JSON.parse(
      await readFile(path, { encoding: 'utf8' })
    ) as TestCoverageReport

    const client = github.getOctokit(token)
    await client.rest.issues.createComment({
      issue_number: github.context.payload.pull_request?.number || 0,
      body: await renderToMarkdown(file),
      ...github.context.repo
    })

    core.setOutput('TotalLinesCoveredPercentage', file.total.lines.pct)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
