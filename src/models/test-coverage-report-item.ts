import { TestCoverage } from './test-coverage'

export type TestCoverageReportItem = {
  lines: TestCoverage
  functions: TestCoverage
  statements: TestCoverage
  branches: TestCoverage
}
