
function wsModule(options={}){

    let {SHOW_VAPI} = options
    SHOW_VAPI = typeof SHOW_VAPI === 'booleand' ? SHOW_VAPI : true

    const CBE = `CustomerBackend`
    const CS = `CS`
    const MB = `MB`
    const LVN = `CustomerLVN`
    const VAPI = "VAPI"
    const CS_URL = `api.nexmo.com`
    const CS_INT_URL = `conversation.local`
    const MB_URL = `mediabridge.local`
    const VAPI_INT_URL = `vapi.local`

    function partecipants(props){

    //     const check = {
    // VAPI: typeof props.VAPI === 'boolean' ? props.VAPI : true
    // }

        return `
    participant "${VAPI}"
    participant "${CS}"
    participant "${MB}"
    participant "${LVN}"
    `
    }

    function indentData(data){
        const res = JSON.stringify(data, '  ', '  ').split('\n').map(line => {
        const whiteNum = line.search(/\S|$/)
        return new Array(whiteNum+1).join(".") + line.trim()
        }).join('\\n')
        return res
    }

    function httpRequest({from, to, method, url, data}){
        return `
        ${from}->${to}: ${method} ${url}
        Note right of ${from}: ${indentData(data)}
        `
    }

    function httpResponse({from, to, status, res}){
        return `
        Note left of ${to}: ${indentData(res)}
        ${to}->${from}: ${status}
        
        `
    }

    function createConversation(props={}){
        const {name} = props
        const request = {
            name:"CONV",

        }
        const response = {
            name:"CONV",
            id:"CON-CONV_ID"
        }

        const requestMB = {}
        const requestMBResponse = {
            id:"MIXER-ID"
        }

        const diagram =`
            ${httpRequest({from: CBE, to: CS, method: "POST", url: `${CS_URL}/v0.3/conversations`, data: request})}
                ${httpRequest({from: CS, to: MB, method: "POST", url: `${MB_URL}/api/mixers`, data: requestMB})}
                ${httpResponse({from: CS, to: MB, status: 200, res: requestMBResponse})}
            ${httpResponse({from: CBE, to: CS, status: 201, res: response})}
        `

        return {
            diagram
        }

    }

    function getPSTNinboundRinging(props = {}){
        const {lvn='666'} = props
        const mbEvent = {
            "event":"ringing",
            "call_id": "LEG_ID",
            "direction": "inbound",
            "from": "CLIENT_NUBER",
            "to": "CUSTOMER_LVN",
        }

        const csEventKnocking = {
            type:"app:knocking",
            body:{
                user:{
                    id:"USR-1"
                }
            }
        }

        const csEventRinging = {
            type:"sip:ringing"
        }

        const diagram =`

        ${LVN}->${MB}: inbound call from ${lvn}
        ${MB}->${CS}: POST ${CS_INT_URL}/v1/mediaEvent
        Note right of ${MB}: ${indentData(mbEvent)}
        
        ${CS}->${VAPI}: ${VAPI_INT_URL}/event/conversation
        Note right of ${CS}: ${indentData(csEventRinging)}
        
        ${CS}->${VAPI}: ${VAPI_INT_URL}/event/conversation
        Note right of ${CS}: ${indentData(csEventKnocking)}

    ` 

        return {
            diagram
        }
    }


    function createUser(props={}, meta={}){
        const {name} = props
        let {from}= meta
        if(!from) from = CBE
        
        let response = {
            name:"USER_NAME",
            id:"USR-ID"
        }

        const diagram =`
        ${from}->${CS}: POST ${CS_INT_URL}/v0.3/users
        Note right of ${from}:  ${indentData(props)}
        Note left of ${CS}:  ${indentData(response)}
        ${CS}->${from}: 201
    `

        return {
            diagram
        }
    }


    function fullPSTNinboundIVRwithTTS(){
        const lvn ="777"
    const diagram = `
        ${getPSTNinboundRinging({lvn}).diagram}
`
        return {
            diagram
        }
    }

    return {
        createConversation,
        createUser,
        getPSTNinboundRinging,
        fullPSTNinboundIVRwithTTS
    }

}


module.exports = wsModule