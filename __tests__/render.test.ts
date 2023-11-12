import { readFile } from 'fs/promises'
import { TestCoverageReport } from '../src/models/test-coverage-report'
import { renderToMarkdown, transformToArray } from '../src/render'

describe('render', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return markdown', async () => {
    const testData: TestCoverageReport = JSON.parse(
      await readFile('./__tests__/example-data/test-data1.json', {
        encoding: 'utf-8'
      })
    ) as TestCoverageReport

    const expected: string = await readFile(
      './__tests__/example-data/test-data1-expected.md',
      { encoding: 'utf-8' }
    )

    const markdown = await renderToMarkdown(testData)

    expect(markdown).toBe(expected)
  })

  it('Should transform object to array', async () => {
    const testData: TestCoverageReport = {
      total: {
        lines: { total: 356, covered: 199, skipped: 0, pct: 55.89 },
        statements: { total: 373, covered: 209, skipped: 0, pct: 56.03 },
        functions: { total: 129, covered: 45, skipped: 0, pct: 34.88 },
        branches: { total: 42, covered: 2, skipped: 0, pct: 4.76 }
      },
      file1: {
        lines: { total: 21, covered: 17, skipped: 0, pct: 80.95 },
        functions: { total: 6, covered: 3, skipped: 0, pct: 50 },
        statements: { total: 21, covered: 17, skipped: 0, pct: 80.95 },
        branches: { total: 3, covered: 0, skipped: 0, pct: 0 }
      }
    }

    const transformed = transformToArray(testData)
    expect(transformed).toEqual([
      {
        file: 'file1',
        coverage: {
          lines: { total: 21, covered: 17, skipped: 0, pct: 80.95 },
          functions: { total: 6, covered: 3, skipped: 0, pct: 50 },
          statements: { total: 21, covered: 17, skipped: 0, pct: 80.95 },
          branches: { total: 3, covered: 0, skipped: 0, pct: 0 }
        }
      }
    ])
  })

  it('should omit "total" key', async () => {
    const testData: TestCoverageReport = {
      total: {
        lines: { total: 356, covered: 199, skipped: 0, pct: 55.89 },
        statements: { total: 373, covered: 209, skipped: 0, pct: 56.03 },
        functions: { total: 129, covered: 45, skipped: 0, pct: 34.88 },
        branches: { total: 42, covered: 2, skipped: 0, pct: 4.76 }
      },
      file1: {
        lines: { total: 21, covered: 17, skipped: 0, pct: 80.95 },
        functions: { total: 6, covered: 3, skipped: 0, pct: 50 },
        statements: { total: 21, covered: 17, skipped: 0, pct: 80.95 },
        branches: { total: 3, covered: 0, skipped: 0, pct: 0 }
      }
    }
    const transformed = transformToArray(testData)
    expect(transformed.find(it => it.file === 'Total')).toBeUndefined()
  })
})
