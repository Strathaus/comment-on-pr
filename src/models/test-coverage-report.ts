import { TestCoverageReportItem } from './test-coverage-report-item'

export type TestCoverageReport = {
  total: TestCoverageReportItem
  [key: string]: TestCoverageReportItem
}
