const exec = require('child_process').execSync
const argvs = process.argv
const packageNames = [...argvs.slice(2)]
const command = `npm install --legacy-peer-deps ${packageNames.join(' ')}`
exec(command, { stdio: 'inherit' })
