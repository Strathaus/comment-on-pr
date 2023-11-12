import { readFile } from 'fs/promises'
import { TestCoverageReport } from './models/test-coverage-report'
import { compile } from 'handlebars'
import { TestCoverageReportItem } from './models/test-coverage-report-item'
import path from 'path'

export const renderToMarkdown = async (
  coverageSummary: TestCoverageReport
): Promise<string> => {
  const template = compile(
    await readFile(path.join(__dirname, 'templates/comment.handlebars'), {
      encoding: 'utf-8'
    })
  )
  const variables = {
    title: 'Test Coverage',
    total: coverageSummary.total,
    files: transformToArray(coverageSummary)
  }
  return template(variables)
}

export const transformToArray = (
  coverageSummary: TestCoverageReport
): { file: string; coverage: TestCoverageReportItem }[] => {
  return Object.entries(coverageSummary)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({ file: key, coverage: value }))
}
