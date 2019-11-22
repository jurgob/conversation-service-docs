const fs = require('fs');

const spec1_content = fs.readFileSync('./openapi_specs/specs.openapi_v1.json')
const spec1 = JSON.parse(spec1_content)

const spec2_content = fs.readFileSync('./openapi_specs/specs.openapi_v2.json')
const spec2 = JSON.parse(spec2_content)

const spec_result = JSON.parse(JSON.stringify(spec1))

//merge
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

console.log(JSON.stringify(spec_result, ' ', ' '))