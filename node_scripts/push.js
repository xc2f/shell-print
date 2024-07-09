
const argvs = process.argv
const exec = require('child_process').execSync

// const execute = command => {
// 	exec(command, (error, stdout, stderr) => {
// 		if (error) {
// 			console.error(error)
// 		} else {
// 			console.log(stdout)
// 		}
// 	})
// }


const commit = argvs[2]

if (commit) {
	exec('git add -A')
	exec(`git commit -m "${commit}"`)
}
exec('git push')

