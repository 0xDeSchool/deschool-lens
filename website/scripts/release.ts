// @ts-ignore
import { prompt } from 'enquirer' // eslint-disable-line import/no-extraneous-dependencies
import { execa } from 'execa' // eslint-disable-line import/no-extraneous-dependencies
import colors from 'picocolors' // eslint-disable-line import/no-extraneous-dependencies

const args = require('minimist')(process.argv.slice(2)) // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs')
const path = require('path')
const semver = require('semver') // eslint-disable-line import/no-extraneous-dependencies
const currentVersion = require('../package.json').version

const preId = args.preid || (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])

const versionIncrements = ['patch', 'minor', 'major', ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])]

const inc = i => semver.inc(currentVersion, i, preId)
const run = (bin, argsParams, opts = {}) => execa(bin, argsParams, { stdio: 'inherit', ...opts })
const runIfNotDry = run
const step = msg => console.log(colors.green(msg))

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

function updateVersions(version) {
  updatePackage(path.resolve(__dirname, '..'), version)
}

async function main() {
  let targetVersion = args._[0]

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom']),
    })

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1] // eslint-disable-line prefer-destructuring
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!yes) {
    return
  }

  // update all package versions and inter-dependencies
  step('\nUpdating cross dependencies...')
  updateVersions(targetVersion)

  // generate changelog
  step('\nGenerating changelog...')
  await run(`pnpm`, ['run', 'changelog'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }

  // push to GitHub
  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['tag', `v${targetVersion}`])
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await runIfNotDry('git', ['push'])
}

main().catch(err => {
  updateVersions(currentVersion)
  console.error(err)
})
