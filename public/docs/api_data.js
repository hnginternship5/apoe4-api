define({ "api": [
  {
    "type": "post",
    "url": "/answers/",
    "title": "Create an Answer",
    "name": "answers_",
    "version": "1.0.0",
    "group": "Answers",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>Answers registered successfully!</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>An internal Server error has occured!</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>Question ID to assign relationship and link to its answer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "owner",
            "description": "<p>Generated from Auth Token in Authorization Header</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>The selected option from the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "created",
            "description": "<p>Generated by Server</p>"
          }
        ]
      }
    },
    "filename": "src/components/answers/answerController.js",
    "groupTitle": "Answers"
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login a user",
    "name": "auth_login",
    "version": "1.0.0",
    "group": "Auth",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>User access token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"accessToken\": \"oqueoqiniodq...\",\n   \"userId\": \"ueuoripio3oij5oj3o5jp3\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>for invalid input data</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidCredentials",
            "description": "<p>For wrong email or password.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>For Invalid data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ValidationError-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n   \"message\": \"You must provide email and password\",\n    ...\n}",
          "type": "json"
        },
        {
          "title": "InvalidCredentials-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": \"error\",\n   \"message\": \"Incorrect email or password.\",\n    ...\n}",
          "type": "json"
        },
        {
          "title": "UserNotFound-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n   \"message\": \"User not found\",\n    ...\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n   \"message\": \"...\",\n    ...\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          }
        ]
      }
    },
    "filename": "src/components/auth/AuthController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "Register a user",
    "name": "auth_register",
    "version": "1.0.0",
    "group": "Auth",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>User access token.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"accessToken\": \"oqueoqiniodq...\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>For Invalid data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ValidationError-Response:",
          "content": " HTTP/1.1 400 OK\n{\n  \"status\": \"error\",\n   \"message\": \"...\",\n    \"data\": []\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's First name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's lastname</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>user's password</p>"
          }
        ]
      }
    },
    "filename": "src/components/auth/AuthController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/questions/",
    "title": "Creating a question",
    "name": "questions_createQuestion",
    "version": "1.0.0",
    "group": "Questions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>Questions registered successfully!</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>An internal Server error has occured!</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>String of text to represent the question. e.g How was your day?</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Morning, Noon, Night, Register</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "options",
            "description": "<p>Array of the User's Options</p>"
          }
        ]
      }
    },
    "filename": "src/components/questions/questionController.js",
    "groupTitle": "Questions"
  },
  {
    "type": "post",
    "url": "/questions/getQuestion",
    "title": "Get a Question",
    "name": "questions_getQuestion",
    "version": "1.0.0",
    "group": "Questions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>Question which hasnt been answere or message stating all questions answered</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "Response",
            "description": "<p>An internal Server error has occured!</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Morning, Noon, Night, Register</p>"
          }
        ]
      }
    },
    "filename": "src/components/questions/questionController.js",
    "groupTitle": "Questions"
  },
  {
    "type": "get",
    "url": "/user/:userId",
    "title": "Get a user details",
    "name": "user__userId",
    "version": "1.0.0",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>userdetails.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n   \"status\": \"success\",\n    \"message\": \"User retrieved successfully.\",\n     \"code\": 200,\n     \"data\": {\n         \"active\": true,\n         \"isVerified\": false,\n         \"_id\": \"5cacc39d97273e4d779d8310\",\n         \"email\": \"johndoe@example.com\",\n         \"firstName\": \"John\",\n         \"lastName\": \"doe\",\n         \"updatedAt\": \"2019-04-09T16:09:01.969Z\",\n         \"createdAt\": \"2019-04-09T16:09:01.969Z\",\n         \"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>User's Id</p>"
          }
        ]
      }
    },
    "filename": "src/components/user/UserController.js",
    "groupTitle": "User"
  }
] });
