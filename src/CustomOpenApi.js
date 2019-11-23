import React from "react";
import ReactJsonSyntaxHighlighter from 'react-json-syntax-highlighter'
const OpenAPISampler = require('openapi-sampler');


function objectCompactView(openapiObject){
	if(typeof openapiObject !== "object")
		return openapiObject
	else if(openapiObject.type && openapiObject.type !== "object")
		return `<${openapiObject.type}>`
	else if(openapiObject.$ref) 
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
		if(eventRow.type.pattern)
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

function CustomOpenApi({spec}) {
const webhooks_events = spec.components.schemas.callback.oneOf.map(({properties}) =>  properties)
  return (
	<div>
		<h1>CS events</h1>
		<p>CS events, we document those here cuz openapi output may be confusint</p>
		<h2>Webhooks events</h2>
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
	</div>  
	
  );
}


export default CustomOpenApi;