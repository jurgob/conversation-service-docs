import React from "react";
import ReactJsonSyntaxHighlighter from 'react-json-syntax-highlighter'
const OpenAPISampler = require('openapi-sampler');


function objectCompactView(openapiObject){
	if(typeof openapiObject !== "object")
		return openapiObject
	else if(openapiObject.type && openapiObject.type !== "object") {
		const format = openapiObject.format ? `(${openapiObject.format})` : ``;
		return `<${openapiObject.type}${format}>`
	} else if(openapiObject.$ref)
		return `<${openapiObject.$ref}>`
	else if(openapiObject.properties)
		return objectCompactView(openapiObject.properties)
	else if(openapiObject.type && openapiObject.type === "object" && !openapiObject.properties)
		return {}
	else if(Array.isArray(openapiObject))
		return openapiObject.map(val =>objectCompactView(val) )
	else {
		let res = {}
		Object.keys(openapiObject)
			.forEach(propKey => {
				res[propKey] = objectCompactView(openapiObject[propKey])
			})
		return res
	}

}

// eslint-disable-next-line no-unused-vars
function propCompectView(prop){
	if(prop.$ref)
		return `<${prop.$ref}>`

	else if(prop.type === "object")
		return {...prop.properties}

	return prop;
}

function eventCompactView(eventRow){
	const event = {...eventRow}
	//set type
	let type = "notype!"
	if(event && event.type){
		if(eventRow.type.pattern && eventRow.type.pattern.includes("custom") )
			type = "custom:*"
		if(eventRow.type.enum)
			type = eventRow.type.enum[0]

	}
	//event.type = type
	delete event.type
	const eventRes = objectCompactView(event)
	const newBody =eventRes.body
	delete event.body


	eventRes.type = type;
	eventRes.body = newBody;


	// Object.keys(event)
	// 	.filter(key =>key !== "type")
	// 	.forEach(key => {
	// 		event[key] = propCompectView(event[key])
	// 	})
	//set body

	// if(event.body && event.body.properties){
	// 	event.body = event.body.properties
	// }

	// eventRes.originalEvent = eventRow
	return eventRes;
}

function getRefs(specs){
	if(typeof specs !== "object" )
		return undefined
	if(specs["$ref"])
		return { [specs["$ref"]] : true }
	return Object.values(specs)
		.reduce(
			(acc, spec) => ({
				...acc,
				...getRefs(spec)
			}),
			{}
		)
}

function getSchemaSpec(resource, schema){
	const res_name = resource.split('/').slice(-1).pop()
	return schema['components']['schemas'][res_name ]
	//path = "#/components/schemas/session_id".split('/').splice(1)
}

function CustomOpenApi({spec}) {
	const webhooks_events = spec.components.schemas.callback.oneOf.map(({properties}) =>  properties)

  	const refs = Object.keys(getRefs(webhooks_events))
//   return (
// 		<pre>{JSON.stringify(getSchemaSpec(refs[0], spec), null, ' ')}</pre>
//   )
  return (
	<div>
		<h1>CS events</h1>
		<p>CS events, we document those here cuz openapi output may be confusint</p>
		<p>there are two sections: <b>Webhooks events list</b> and <b>Object legend</b> (scroll down) </p>
		<h2>Webhooks events list</h2>
		<p>if you enable the rtc capability in your application, you will start to receive the following events:</p>
		<div>
			{webhooks_events
				.filter(event => event && event.type)
				.map(event => {
					const compactEvent = eventCompactView(event)
					const exampleJson = OpenAPISampler.sample({type:"object", properties: event}, {skipReadOnly: false}, spec)

					return (
						<div>
							<h3 style={{borderBottom: "1px solid #ddd"}}>{compactEvent.type}</h3>
							<div style = {{display: "inline-block",verticalAlign:"top", marginRight: "30px"}} >
								<h4>Event </h4>
								<ReactJsonSyntaxHighlighter obj={compactEvent} />
							</div>
							<div style = {{display: "inline-block",verticalAlign:"top", marginRight: "60px"}} >
								<h4>Example </h4>
								<ReactJsonSyntaxHighlighter obj={exampleJson} />
							</div>
							<div style = {{display: "inline-block"}} >
								<h4>OpenApi </h4>
								<ReactJsonSyntaxHighlighter obj={event} />
							</div>

						</div>
					)
			})}
		</div>
		<h2>Object legend</h2>
		<div>
			{refs.map(refpath => {
				return (
					<div>
						<h3>{refpath}</h3>
						<ReactJsonSyntaxHighlighter obj={getSchemaSpec(refpath, spec)} />
					</div>
				)
				
			})}
		</div>
	</div>

  );
}


export default CustomOpenApi;