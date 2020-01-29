const fs = require('fs');

const spec1_content = fs.readFileSync('./src/openapi_specs/specs.openapi_v1.json')
const spec1 = JSON.parse(spec1_content)

const spec2_content = fs.readFileSync('./src/openapi_specs/specs.openapi_v2.json')
const spec2 = JSON.parse(spec2_content)

const spec_result = JSON.parse(JSON.stringify(spec1))

//merge
if (!spec_result.servers[0]) spec_result.servers[0] = {};

spec_result.servers[0].url = "https://api.nexmo.com"

Object.entries(spec_result.paths)
	.filter(([path, path_verbs]) => !path.includes('/applications'))
	.forEach(([path, path_verbs]) => {
		spec_result.paths[`/beta${path}`] = path_verbs
		//delete spec_result.paths[path]
		const path2_verbs = spec2.paths[path]
		if( typeof(path2_verbs) === "object")
			spec_result.paths[`/beta2${path}`] = path2_verbs

		delete  spec_result.paths[path]
	})

// //add tags
// function fromPathToTag(path){
// 		let tag = "misc"
// 		if(path.includes('/applications'))
// 			tag = "webhooks"
// 		else if(path.includes('/members'))
// 			tag = "conversations members"
// 		else if(path.split && path.split('/')[2])
// 			tag = path.split('/')[2]
// 		return tag
// }


// Object.entries(spec_result.paths)
// 	//.map(([path, path_verbs]) => path)
// 	.forEach(([path, path_verbs]) => {
	
// 		const tag = fromPathToTag(path);

// 		Object.keys(path_verbs)
// 			.forEach(verb => {
// 				spec_result.paths[path][verb].tags = [tag]	
// 			})
// 		// spec_result.paths[path]
// 		// console.log(path, tag)
// 	})



// console.log(JSON.stringify(spec_result, ' ', ' '))
fs.writeFileSync('./src/openapi_specs/specs.openapi_all.json', JSON.stringify(spec_result, ' ', ' '));
