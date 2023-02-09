// Invoked on the commit-msg git hook by simple-git-hooks.
/**
https://www.notion.so/seedao/commit-b43f69985db345e58c52c147d32610cf
type: subject 是简述不要超过 50 个字元，type 只允许使用以下类别：

feat: 新增/修改功能 (feature)。
fix: 修补 bug (bug fix)。
docs: 文件 (documentation)。
style: 格式 (不影响程式码运行的变动 white-space, formatting, missing semi colons, etc)。
refactor: 重构 (既不是新增功能，也不是修补 bug 的程式码变动)。
perf: 改善效能 (A code change that improves performance)。
test: 增加测试 (when adding missing tests)。
ci: 持续集成 (continues integration, GitHub)。
chore: 建构程序或辅助工具的变动 (maintain)。
wip：移除文件或者代码
revert: 撤销回覆先前的 commit 例如：revert: type(scope): subject (回覆版本：xxxx)
release: 发布版本
 */
import { readFileSync } from 'node:fs'
import colors from 'picocolors' // eslint-disable-line import/no-extraneous-dependencies

// get $1 from commit-msg script
const msgPath = process.argv[2]
const msg = readFileSync(msgPath, 'utf-8').trim()

const releaseRE = /^v\d/
const commitRE = /^(revert: )?(feat|fix|docs|style|refactor|perf|test|ci|chore|wip|revert|release)(\(.+\))?(.{1,10})?: .{1,50}/

if (!releaseRE.test(msg) && !commitRE.test(msg)) {
  console.log() // eslint-disable-line no-console
  console.error(
    `  ${colors.bgRed(colors.white(' ERROR '))} ${colors.red(`invalid commit message format.`)}\n\n${colors.red(
      `  Proper commit message format is required for automated changelog generation. Examples:\n\n`,
    )}    ${colors.green(`feat: add 'comments' option`)}\n` +
      `    ${colors.green(`fix: handle events on blur (close #28)`)}\n\n${colors.red(
        `  See https://www.notion.so/seedao/commit-b43f69985db345e58c52c147d32610cf for more details.\n`,
      )}`,
  ) // eslint-disable-line no-console
  process.exit(1)
}
