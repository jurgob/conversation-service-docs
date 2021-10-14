
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
    ${CBE}->${CS}: POST ${CS_URL}/v0.3/conversations
    Note right of ${CBE}: ${indentData(request)}
    ${CS}->${MB}: POST ${MB_URL}/api/mixers
    Note right of ${CS}: ${indentData(requestMB)}
    Note left of ${MB}: ${indentData(requestMBResponse)}
    ${MB}->${CS}: 200
    Note left of ${CS}: ${indentData(response)}
    ${CS}->${CBE}: 200
    `

        return {
            diagram
        }

    }

    function PSTNInboundCall(lvn='666'){
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

    return {
        createConversation,
        createUser,
        PSTNInboundCall
    }

}


module.exports = wsModule