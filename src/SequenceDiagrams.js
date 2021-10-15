
import React from "react";
import flow_exec from "./flow_exec";
import SequenceDiagramPrivate from 'react-sequence-diagram';
const {execTemplateWebSeqDiagram} = flow_exec
const { templates } =  require("./sequence_diagram_templates");
const wsModule = require("./rtc_websequencediagram")

const {createConversation, getPSTNinboundRinging,createUser, 
  fullPSTNinboundIVRwithTTS} = wsModule()


const template_rendered = templates.map(template => {
  return {
    template,
    template_seq_diagram:execTemplateWebSeqDiagram(template)
  }
})

const SequenceDiagram =({input,onError}) =>  <SequenceDiagramPrivate 
	input={input} 
	options={{
  		theme: 'simple'
	}} 
	onError={onError} 
/>


const diagramsSimple = [
  {
    title:"Create conversations",
    description:"Create conversations",
    diagram:createConversation().diagram
  },
  {
    title:"Get PSTN inbound ringing",
    description:"Receive a PSTN inbound call from a client calling an LVN",
    diagram:getPSTNinboundRinging().diagram
  },
  {
    title:"create user",
    description:"create a user",
    diagram: createUser().diagram
  }

]

const diagramsFullScenarios = [

  {
    title:"PSTN inbound IVR use case, aka VAPI hello world",
    description:"Receive a PSTN inbound call from a client calling an LVN, respond with an text to speech, close the call ",
    diagram:fullPSTNinboundIVRwithTTS().diagram
  }

]

const TemplateList = ({onTemplateClick, diagrams}) => {
  return (
    <div>
      {diagrams.map(({diagram, title, description}, idx) => {
          return (
          <p key={idx} >
            <h3>{title}</h3>
            <p>{description}</p>
            <SequenceDiagram input={diagram} />
          </p>
          )
      })}
    </div>
  )
}

function SequenceDiagrams(){
	return (
		<div>
			<h1>RTC Flow Diagrams - Atomic ones</h1>
			<TemplateList diagrams={diagramsSimple} />
      <h1>RTC Flow Diagrams - Full scenarios</h1>
			<TemplateList diagrams={diagramsFullScenarios} />
		</div>
	)
}

export default SequenceDiagrams;