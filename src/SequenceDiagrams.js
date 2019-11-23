
import React from "react";
import flow_exec from "./flow_exec";
import SequenceDiagramPrivate from 'react-sequence-diagram';
const {execTemplateWebSeqDiagram} = flow_exec
const { templates } =  require("./sequence_diagram_templates");

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


const TemplateList = ({onTemplateClick}) => {
  return (
    <div>
      {template_rendered.map(({template,template_seq_diagram}, idx) => {
        return (
          <div key={idx} onClick={() => { onTemplateClick(template) }} >
              <h2>{template.title}</h2>
			  <p>{template.description}</p>
              <SequenceDiagram input={template_seq_diagram} />
          </div>
        );
      })}
    </div>
  )

}

function SequenceDiagrams(){
	return (
		<div>
			<h1>Conversation Service Diagrams</h1>
			<TemplateList />
		</div>
	)
}

export default SequenceDiagrams;