#!/usr/bin/env node

// DO NOT PUT ANY CREDENTIAL INFORMATION

// const shell = require('shelljs')
const argv = require('yargs').argv
const moment = require('moment')

const FORMAT = ['=========== + ', ' + ===========\n']

const commands = {
  ssh: '',
  scp: '',
  'docker build': '',
  git: '',
  vim: ''
}

// 预定义的ssh host
const ssh = {
  '56': 'ssh -p 12015 root@61.174.52.56',
  '57': 'ssh -p 12015 root@61.174.52.57',
  ec2: 'ssh -p 22 ubuntu@ec2-18-179-204-42.ap-northeast-1.compute.amazonaws.com'
}

const scp = {
  '56': 'scp -P 12015 -r ./case_media.zip root@61.174.52.56:/root/case_media',
  ec2:
    'scp -P 22 -r ./case_media.zip ubuntu@18.179.204.42:/home/ubuntu/case_media',
  lite_fun:
    'scp -P 22 -r ./lite_fun.zip ubuntu@18.179.204.42:/home/ubuntu/lite_fun'
}

const git = {
  'Delete remote branch': 'git push origin -d `branchName`'
}

const vim = {
  'Delete inside `tag`': `di\`tag\` \n - For html tag => \`dit\``,
}

// log argvs
// console.log(argv)

// handle command line argvs
const argvs = argv._
let showText = ''

// now
const NOW = Date.now()

switch (argvs[0]) {
  case 'ssh':
    const sshHost = argvs[1]

    // Find target
    showText = `${FORMAT[0]} SSH host ${sshHost} ${FORMAT[1]}`
    showText += ssh[sshHost]

    // No target
    if (!ssh[sshHost]) {
      showText = `No SSH host \`${sshHost}\` exists.\n`
      showText += `Avaliable SSH hosts: ${Object.keys(ssh)}`
    }

    // List all
    if (!sshHost) {
      showText = `${FORMAT[0]} List all SSH hosts ${FORMAT[1]}`
      showText += Object.keys(ssh)
        .map(h => `${h}: ${ssh[h]}`)
        .join('\n')
    }
    break

  case 'scp':
    const scpHost = argvs[1]

    // Find target
    showText = `${FORMAT[0]} SCP host ${scpHost} ${FORMAT[1]}`
    showText += scp[scpHost]

    // No target
    if (!scp[scpHost]) {
      showText = `No SCP host \`${scpHost}\` exists.\n`
      showText += `Avaliable SCP hosts: ${Object.keys(scp)}`
    }

    // List all
    if (!scpHost) {
      showText = `${FORMAT[0]} List all SCP hosts ${FORMAT[1]}`
      showText += Object.keys(scp)
        .map(h => `${h}: ${scp[h]}`)
        .join('\n')
    }
    break

  case 'docker':
    const caseMediaContainerName = `case_media:${moment().format(
      'YYMMDD'
    )}_${NOW}`
    showText = `${FORMAT[0]} Docker build command ${FORMAT[1]}`
    showText += `docker build -t ${caseMediaContainerName} .\n`
    showText += `docker run -d -p 3453:3000 ${caseMediaContainerName}\n`
    showText += `Portainer.io: http://61.174.52.56:9000/#/home`
    break

  case 'git':
    showText = `${FORMAT[0]} Git command ${FORMAT[1]}`
    Object.keys(git).map(key => {
      showText += `${key}: ${git[key]}`
    }).join('\n')
    break

  case 'vim':
    showText = `${FORMAT[0]} Vim command ${FORMAT[1]}`
    Object.keys(vim).map(key => {
      showText += `${key}: ${vim[key]}`
    }).join('\n')
    break

  default:
    showText = `Avaliable commands: ${Object.keys(commands)}`
    break
}

console.log(showText)
