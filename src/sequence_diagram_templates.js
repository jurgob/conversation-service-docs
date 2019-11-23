
const cs_url_beta = `api.nexmo.com/beta`
const cs_url_beta2 = `api.nexmo.com/beta2`

const CREATE_USER = {
  "title": "create user",
  "description": "create a conversation. You need to create an application first",
  "partecipants": [{"id":"My_BackEnd"}, {"id":"CS"}, {"id":"MB"}],
  "steps": [
    {
      "from_partecipant":"My_BackEnd",
      "to_partecipant": "CS",
      "request": {
        "method": "post",
        "url": `${cs_url_beta}/users`,
        "data": {
        }
      },
      "response": {
        "data": {
          "id": "<USR-A_ID>"
        },
        "status": 200
      }
    }
  ]
}


const CREATE_CONVERSATION = {
  "title": "create conversation",
  "description": "create a conversation. You need to create an application, and a user first",
  "partecipants": [{"id":"My_BackEnd"}, {"id":"CS"}, {"id":"MB"}],
  "steps": [
    {
      "from_partecipant":"My_BackEnd",
      "to_partecipant": "CS",
      "request": {
        "method": "post",
        "url": `${cs_url_beta}/conversations`,
        "data": {
          "name": "<CONV_NAME>",
        }
      },
      "steps_to": [
        {
          "to_partecipant": "MB",
          "request": {
            "method": "post",
            "url": "/mixers",
            "data": {
              "mixer_id": "<MIXER_ID>"
            }
          }
        }
      ],
      "response": {
        "status": 200,
        "data": {
          "conversation_id": "<CONV_ID>",
          "mixer_id": "<MIXER_ID>"
        }

      }
    }
  ]
}


module.exports = {
  templates: [CREATE_USER, CREATE_CONVERSATION]
}
