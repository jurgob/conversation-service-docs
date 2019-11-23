
function *executeTemplateSteps(template){
  var curStepIdx = 0
  while(curStepIdx < template.steps.length){
    let curStep =template.steps[curStepIdx];
    yield curStep;
    curStepIdx = curStepIdx + 1;
  }
}



function indentData(data){
  const res = JSON.stringify(data, '  ', '  ').split('\n').map(line => {
    const whiteNum = line.search(/\S|$/)
    return new Array(whiteNum+1).join("_") + line.trim()
  }).join('\\n')
  return res
}

function stepHttpGenWebSeqDiagram(step,from_partecipant){
  if(!from_partecipant )
    from_partecipant = step.from_partecipant;

  const {request, to_partecipant, steps_to, response} = step
  const {data, url, method} = request


// const from_steps_string=''

  let from_steps_string = ''
  if(steps_to){
    from_steps_string = steps_to.map(step_to => stepHttpGenWebSeqDiagram(step_to, to_partecipant))
  }


  let statusCodeString=""
  let responseString=""
  if(response){
    statusCodeString=response.status
    responseString=`Note left of ${to_partecipant}: ${indentData(response.data)}`
  }


  return `
${from_partecipant}->${to_partecipant}: ${method.toUpperCase()} ${url}
Note right of ${from_partecipant}: ${indentData(data)}
${from_steps_string}
${responseString}
${to_partecipant}-->${from_partecipant}: ${statusCodeString}
`
}

function execTemplateWebSeqDiagram(template){
  let graphString = ""
  const appendGraphString = str => { graphString += (str + `\n`)  }

  //appendGraphString(`title ${template.title}`)
  template.partecipants.map(part => appendGraphString(`participant ${part.id}`))

  var templateExec = executeTemplateSteps(template);
  let nextStep = templateExec.next()
  while(!nextStep.done){
    appendGraphString(stepHttpGenWebSeqDiagram(nextStep.value))
    nextStep = templateExec.next()
    //stepHttpGenDiagram
  }
  return graphString;
  //console.log(graphString)
}

const flow_exec = {
  execTemplateWebSeqDiagram
};
export default flow_exec;

