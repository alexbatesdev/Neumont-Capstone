import json
from util.component_util import generate_component_code

# Example JSON object
component_json = {
    "imports": [],
    "name": "Bubble",
    "props": [
        {
            "name": "children",
            "defaultValue": None,
        },
        {
            "name": "className",
            "defaultValue": "7",
        },
        {
            "name": "imageURL",
            "defaultValue": "https://cataas.com/cat?width=100&height=100",
        },
        {
            "name": "onClick",
            "defaultValue": None,
        },
        {
            "name": "...props",
            "defaultValue": None,
        },
    ],
    "state": [
        {
            "name": "tint",
            "initialValue": "6",
        }
    ],
    "effects": [
        {
            "dependencies": ["members"],
            "body": [
                "console.log('Members changed');",
                "console.log(members);",
                "setMainHeight(`calc(100vh - ${headerHeight} - ${footerHeight} - 2 * ${headerPadding})`);",
                "setHeaderWidth(`calc(100vw - 2 * ${headerPadding})`);",
                "setFooterWidth(`calc(100vw - 2 * ${footerPadding})`);",
            ],
        }
    ],
    "JSX": [
        "<div ",
        '  className={"Bubble"} ',
        "  css={{",
        "      width: '10vh',",
        "      height: '10vh',",
        "      border: '5px solid black',",
        "      borderRadius: '50%',",
        "      backgroundImage: `url(${imageURL})`,",
        "      backgroundSize: 'cover',",
        "      backgroundRepeat: 'no-repeat',",
        "      backgroundPosition: 'center',",
        "  }}",
        "  >",
        "  {children}",
        "  <div ",
        '    className="lens"',
        "    css={{",
        "        width: '100%',",
        "        height: '100%',",
        "        borderRadius: '50%',",
        "        backgroundColor: 'rgba(0, 0, 50, 0.4)',",
        "    }}",
        "    onMouseOver={mouseOverHandler}",
        "  onClick={onClick}",
        "  >",
        "  </div>",
        "</div>",
    ],
    "component_methods": [
        {
            "name": "mouseOverHandler",
            "parameters": [{"name": "event", "defaultValue": None}],
            "body": [
                "console.log('Mouse over');",
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint})`;",
                "console.log(event.target.style.backgroundColor);",
                "event.target.addEventListener('mousedown', mouseDownHandler);",
                "event.target.addEventListener('mouseout', mouseOutHandler);",
            ],
        },
        {
            "name": "mouseOutHandler",
            "parameters": [{"name": "event", "defaultValue": None}],
            "body": [
                "console.log('Mouse out');",
                "console.log(tint - 2);",
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint - 2})`;",
                "event.target.removeEventListener('mousedown', mouseDownHandler);",
                "event.target.removeEventListener('mouseout', mouseOutHandler);",
            ],
        },
        {
            "name": "mouseDownHandler",
            "parameters": [{"name": "event", "defaultValue": None}],
            "body": [
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint + 2})`;",
                "event.target.addEventListener('mouseup', mouseUpHandler);",
            ],
        },
        {
            "name": "mouseUpHandler",
            "parameters": [{"name": "event", "defaultValue": None}],
            "body": [
                "event.target.style.backgroundColor = `rgba(0, 0, 50, 0.${tint})`;",
                "event.target.removeEventListener('mouseup', mouseUpHandler);",
            ],
        },
    ],
}

component_json_2 = {
    "imports": [
        {"from": "react", "import": ["React"], "isNamedImport": False},
        {
            "from": "react",
            "import": ["useState"],
            "isNamedImport": True,
        },
        {
            "from": "../components/bubble.jsx",
            "import": ["Bubble"],
            "isNamedImport": False,
        },
        {
            "from": "../src/components/window.jsx",
            "import": ["Window"],
            "isNamedImport": False,
        },
        {
            "from": "@mui/material",
            "import": ["Button", "ButtonGroup", "Typography"],
            "isNamedImport": True,
        },
    ],
    "name": "Home",
    "props": [],
    "state": [
        {
            "name": "headerHeight",
            "initialValue": "11vh",
        },
        {
            "name": "footerHeight",
            "initialValue": "11vh",
        },
        {
            "name": "mainHeight",
            "initialValue": "",
        },
        {
            "name": "headerPadding",
            "initialValue": "1vh",
        },
        {
            "name": "headerWidth",
            "initialValue": "",
        },
        {
            "name": "footerPadding",
            "initialValue": "1vh",
        },
        {
            "name": "footerWidth",
            "initialValue": "",
        },
        {
            "name": "window",
            "initialValue": "null",
        },
    ],
    "effects": [
        {
            "dependencies": ["members"],
            "body": [
                "console.log('Members changed');",
                "console.log(members);",
                "setMainHeight(`calc(100vh - ${headerHeight} - ${footerHeight} - 2 * ${headerPadding})`);",
                "setHeaderWidth(`calc(100vw - 2 * ${headerPadding})`);",
                "setFooterWidth(`calc(100vw - 2 * ${footerPadding})`);",
            ],
        }
    ],
    "JSX": [
        "<div style={{",
        "    display: 'flex',",
        "    flexDirection: 'column',",
        "    justifyContent: 'space-between',",
        "    alignItems: 'center',",
        "    height: '100vh',",
        "    width: '100vw',",
        "    position: 'absolute',",
        "    top: '0',",
        "    left: '0',",
        "}}>",
        "    <header style={{",
        "        height: state.headerHeight,",
        "        width: state.headerWidth,",
        "        padding: state.headerPadding,",
        "        backgroundColor: '#69f',",
        "    }}>",
        "        {/* Profile */}",
        "        <Bubble",
        "            onClick={profileClickHandler}",
        "            imageURL='https://cataas.com/cat?width=100&height=100'",
        "        />",
        "    </header>",
        "    <main style={{",
        "        height: state.mainHeight,",
        "        width: '100vw',",
        "        backgroundColor: '#58e'",
        "    }}>",
        "        {state.window}",
        "    </main>",
        "    <footer style={{",
        "        height: state.footerHeight,",
        "        width: state.footerWidth,",
        "        padding: state.footerPadding,",
        "        backgroundColor: '#69f',",
        "    }}>",
        "    </footer>",
        "</div>",
    ],
    "component_methods": [
        {
            "name": "profileClickHandler",
            "parameters": [],
            "body": [
                "console.log('Profile clicked');",
                "// add a window-like div that has a profile switcher",
                "state.window = (",
                "    <Window",
                "        width={'200px'}",
                "        height={'400px'}",
                "        className={'TestWindow'}",
                "        doXButton={false}",
                "    >",
                "    </Window>",
                ");",
            ],
        }
    ],
}

component_jason = component_json


# component_code = generate_component_code(
#     component_name,
#     JSX_code,
#     pre_import_code,
#     component_imports,
#     props,
#     state,
#     effects,
#     component_methods,
# )
# print(component_code)

# code = '{\n  "component_name": "ClickCounter",\n  "imports": [\n    {\n      "from": "react",\n      "import": "{ useState }",\n      "isNamedImport": true\n    }\n  ],\n  "component_methods": [\n    {\n      "name": "handleClick",\n      "body": [\n        "setClickCount(clickCount + 1);"\n      ]\n    }\n  ],\n  "JSX": [\n    "<div>",\n    "  <p>Number of clicks: {clickCount}</p>",\n    "  <button onClick={handleClick}>Click me</button>",\n    "</div>"\n  ]\n}'
# code = '{\n  "component_name": "ClickCounter",\n  "state": [\n    {\n      "name": "clickCount",\n      "initialValue": "0"\n    }\n  ],\n  "component_methods": [\n    {\n      "name": "handleClick",\n      "parameters": [],\n      "body": [\n        "setClickCount(clickCount + 1);"\n      ]\n    }\n  ],\n  "JSX": [\n    "<div>",\n    "  <h2>Click Counter</h2>",\n    "  <p>Click Count: {clickCount}</p>",\n    "  <button onClick={handleClick}>Click me</button>",\n    "</div>"\n  ]\n}'
# code = '{\n  "component_name": "ClickCounter",\n  "imports": [\n    {\n      "from": "react",\n      "import": ["useState"],\n      "isNamedImport": true\n    }\n  ],\n  "state": [\n    {\n      "name": "count",\n      "initialValue": "0"\n    }\n  ],\n  "component_methods": [\n    {\n      "name": "handleClick",\n      "parameters": [],\n      "body": ["setCount(count + 1)"]\n    }\n  ],\n  "JSX": [\n    "<button onClick={handleClick} style={{ padding: \'8px 16px\', fontSize: \'16px\' }}>",\n    "  Clicked {count} times",\n    "</button>"\n  ]\n}'
# code = """{\n  \"component_name\": \"MessageComponent\",\n  \"imports\": [\n    {\n      \"from\": \"react\",\n      \"import\": [\"useState\", \"useEffect\"],\n      \"isNamedImport\": true\n    }\n  ],\n  \"props\": [],\n  \"state\": [\n    {\n      \"name\": \"messages\",\n      \"initialValue\": \"[]\"\n    },\n    {\n      \"name\": \"input\",\n      \"initialValue\": \"''\"\n    }\n  ],\n  \"component_methods\": [\n    {\n      \"name\": \"sendMessage\",\n      \"parameters\": [],\n      \"body\": [\n        \"const responses = ['Hello!', 'Wow!', 'Interesting...', 'I see.', 'Cool story bro.', 'What a surprise.', 'Intriguing...'];\",\n        \"const randomResponseIndex = Math.floor(Math.random() * responses.length);\",\n        \"const newMessage = { content: input, isResponse: false };\",\n        \"const newResponse = { content: responses[randomResponseIndex], isResponse: true };\",\n        \"setMessages([...messages, newMessage, newResponse]);\",\n        \"setInput('');\"\n      ]\n    },\n    \n    {\n      \"name\": \"handleChange\",\n      \"parameters\": [\n        {\n          \"name\": \"event\",\n          \"defaultValue\": \"'event'\"\n        }\n      ],\n      \"body\": [\n        \"setInput(event.target.value);\"\n      ]\n    },\n  \n    {\n      \"name\": \"handleKeyPress\",\n      \"parameters\": [\n        {\n          \"name\": \"event\",\n          \"defaultValue\": \"'event'\"\n        }\n      ],\n      \"body\": [\n        \"if (event.key === 'Enter') {\",\n        \"  sendMessage();\",\n        \"}\"\n      ]\n    }\n  ],\n  \"JSX\": [\n    \"<div style={{width: '60%', margin: '0 auto', backgroundColor: '#f3f3f3', padding: '1em', borderRadius: '5px', minHeight: '400px'}}>\",\n    \"  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>\",\n    \"    {messages.map((message, index) => {\",\n    \"      return (\",\n    \"        <li key={index} style={{backgroundColor: message.isResponse ? '#ddf' : '#ffd', padding: '1em', borderRadius: '5px', margin: '1em 0'}}>\",\n    \"          {message.content}\",\n    \"        </li>\",\n    \"      );\",\n    \"    })}\",\n    \"  </ul>\",\n    \"  <input \",\n    \"    style={{width: '100%', padding: '1em', boxSizing: 'border-box'}} \",\n    \"    value={input} \",\n    \"    onChange={handleChange} \",\n    \"    onKeyPress={handleKeyPress} \",\n    \"    placeholder='Type a message and press enter' />\",\n    \"</div>\"\n  ]\n}"""
# code = """{\n  \"component_name\": \"MessageComponent\",\n  \"imports\": [\n    {\n      \"from\": \"react\",\n      \"import\": [\"useState\"],\n      \"isNamedImport\": true\n    }\n  ],\n  \"state\": [\n    {\n      \"name\": \"messages\",\n      \"initialValue\": \"[]\"\n    },\n    {\n      \"name\": \"inputValue\",\n      \"initialValue\": \"\"\n    }\n  ],\n  \"effects\": [\n    {\n      \"dependencies\": [\"messages\"],\n      \"body\": [\n        \"console.log('Messages:', messages)\"\n      ]\n    }\n  ],\n  \"component_methods\": [\n    {\n      \"name\": \"handleInputChange\",\n      \"parameters\": [\n        {\n          \"name\": \"e\",\n          \"defaultValue\": \"React.ChangeEvent<HTMLInputElement>\"\n        }\n      ],\n      \"body\": [\n        \"setInputValue(e.target.value)\"\n      ]\n    },\n    {\n      \"name\": \"handleKeyPress\",\n      \"parameters\": [\n        {\n          \"name\": \"e\",\n          \"defaultValue\": \"React.KeyboardEvent<HTMLInputElement>\"\n        }\n      ],\n      \"body\": [\n        \"if (e.key === 'Enter') {\",\n        \"  e.preventDefault()\",\n        \"  sendMessage()\",\n        \"}\"\n      ]\n    },\n    {\n      \"name\": \"sendMessage\",\n      \"body\": [\n        \"if (inputValue.trim() !== '') {\",\n        \"  const newMessage = {\",\n        \"    id: Date.now(),\",\n        \"    text: inputValue,\",\n        \"    sent: true\",\n        \"  }\",\n        \"  const newMessages = [...messages, newMessage]\",\n        \"  setMessages(newMessages)\",\n        \"  setInputValue('')\",\n        \"  // Send a random response\",\n        \"  const responses = ['I got your message!', 'Thanks for reaching out!', 'Great to hear from you!']\",\n        \"  const randomResponse = responses[Math.floor(Math.random() * responses.length)]\",\n        \"  const newResponse = {\",\n        \"    id: Date.now() + 1,\",\n        \"    text: randomResponse,\",\n        \"    sent: false\",\n        \"  }\",\n        \"  setTimeout(() => {\",\n        \"    const updatedMessages = [...newMessages, newResponse]\",\n        \"    setMessages(updatedMessages)\",\n        \"  }, 1000)\",\n        \"}\"\n      ]\n    }\n  ],\n  \"JSX\": [\n    \"<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '16px', backgroundColor: '#f2f2f2', borderRadius: '8px' }}>\",\n    \"  {messages.map((message) => (\",\n    \"    <div key={message.id} style={{\",\n    \"      display: 'flex',\",\n    \"      flexDirection: 'column',\",\n    \"      alignItems: message.sent ? 'flex-end' : 'flex-start',\",\n    \"      maxWidth: '70%',\",\n    \"      padding: '8px',\",\n    \"      backgroundColor: message.sent ? '#DCF8C6' : '#FFFFFF',\",\n    \"      borderRadius: '8px',\",\n    \"      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'\",\n    \"    }}>\",\n    \"      <p style={{ fontWeight: message.sent ? 600 : 400, margin: 0 }}>{message.text}</p>\",\n    \"    </div>\",\n    \"  ))}\",\n    \"  <input\",\n    \"    type=\\\"text\\\"\",\n    \"    placeholder=\\\"Type a message...\\\"\",\n    \"    value={inputValue}\",\n    \"    onChange={handleInputChange}\",\n    \"    onKeyPress={handleKeyPress}\",\n    \"    style={{\",\n    \"      width: '100%',\",\n    \"      padding: '8px',\",\n    \"      borderRadius: '8px',\",\n    \"      border: '1px solid #ccc'\",\n    \"    }}\",\n    \"  />\",\n    \"</div>\"\n  ]\n}"""
# code = '{  "component_name": "MessageComponent",  "imports": [    { "from": "react", "import": ["useState"], "isNamedImport": true }  ],  "props": [],  "state": [    { "name": "message", "initialValue": "" },    { "name": "messages", "initialValue": "[]" }  ],  "effects": [    {      "dependencies": [],      "body": [        "const responses = [",        "  \'Hello!\',",        "  \'How are you?\',",        "  \'Nice to meet you!\',",        "  \'I am good!\',",        "  \'Thanks!\',",        "];",        "",        "const randomResponse = () => {",        "  const randomIndex = Math.floor(Math.random() * responses.length);",        "  return responses[randomIndex];",        "};"      ]    }  ],  "component_methods": [    {      "name": "handleInputChange",      "parameters": [        { "name": "event", "defaultValue": "null" }      ],      "body": [        "setMessage(event.target.value);"      ]    },    {      "name": "handleKeyPress",      "parameters": [        { "name": "event", "defaultValue": "null" }      ],      "body": [        "if (event.key === \'Enter\' && message !== \'\') {",        "  const newMessage = { text: message, isSent: true };",        "  setMessages([...messages, newMessage]);",        "  setMessage(\'\');",        "  const responseMessage = { text: randomResponse(), isSent: false };",        "  setMessages([...messages, responseMessage]);",        "}"      ]    }  ],  "JSX": [    "<div>",    "  <div style={{",    "    display: \'flex\',",    "    flexDirection: \'column\',",    "    marginBottom: \'10px\'",    "  }}>",    "    {messages.map((message, index) => (",    "      <div",    "        key={index}",    "        style={{",    "          padding: \'5px\',",    "          marginBottom: \'5px\',",    "          background: message.isSent ? \'#e6f7ff\' : \'#f0f0f0\'",    "        }}"    "      >",    "        {message.text}",    "      </div>",    "    ))}",    "  </div>",    "  <input",    "    type=\'text\'",    "    value={message}",    "    onChange={handleInputChange}",    "    onKeyPress={handleKeyPress}",    "    style={{ padding: \'5px\', border: 0, marginBottom: \'10px\' }}"    "  />",    "</div>"  ]}'
# code = '{\n  "component_name": "BMO",\n  "imports": [\n    {\n      "from": "react",\n      "import": ["useState", "useEffect"],\n      "isNamedImport": true\n    },\n    {\n      "from": "./BMOStyles",\n      "import": ["Container"],\n      "isNamedImport": false\n    }\n  ],\n  "props": [\n    {\n      "name": "size",\n      "defaultValue": "\\"medium\\""\n    }\n  ],\n  "state": [\n    {\n      "name": "characterState",\n      "initialValue": "\\"Happy\\""\n    }\n  ],\n  "effects": [\n    {\n      "dependencies": ["characterState"],\n      "body": [\n        "console.log(`BMO feels ${characterState}`);"\n      ]\n    }\n  ],\n  "component_methods": [\n    {\n      "name": "play",\n      "parameters": [\n        {\n          "name": "game",\n          "defaultValue": "\\"Adventure Time\\""\n        }\n      ],\n      "body": [\n        "console.log(`Playing: ${game}`);",\n        "setCharacterState(\'Excited\');"\n      ]\n    }\n  ],\n  "JSX": [\n    "<Container size={size}>",\n    "  <img src=\\"/images/bmo.png\\" alt=\\"BMO\\" />",\n    "  <button onClick={() => play()}>Play a Game</button>",\n    "</Container>"\n  ]\n}'
# code = '{\n"component_name": "BMOComponent",\n"imports": [{\n  "from": "@mui/material",\n  "import": ["Box"],\n  "isNamedImport": true\n}],\n"JSX": [\n  "<Box>",\n  "<Box style={{",\n  "height: \'400px\',",\n  "width: \'250px\',",\n  "backgroundColor: \'lightgreen\',",\n  "borderRadius: \'25px\',",\n  "position: \'relative\',",\n  "}}> </Box>",\n  \n  "<Box style={{",\n  "backgroundColor: \'black\',",\n  "borderRadius: \'15px\',",\n  "height: \'200px\',",\n  "width: \'200px\',",\n  "position: \'absolute\',",\n  "top: \'50px\',",\n  "left: \'25px\',",\n  "}}></Box>",\n  \n  "<Box style={{",\n  "backgroundColor: \'white\',",\n  "borderRadius: \'15px\',",\n  "height: \'40px\',",\n  "width: \'40px\',",\n  "position: \'absolute\',",\n  "top: \'130px\',",\n  "left: \'105px\',",\n  "}}></Box>",\n  \n  "<Box style={{",\n  "backgroundColor: \'white\',",\n  "borderRadius: \'50%\',",\n  "height: \'10px\',",\n  "width: \'10px\',",\n  "position: \'absolute\',",\n  "top: \'155px\',",\n  "left: \'120px\',",\n  "}}></Box>",\n  \n  "<Box style={{",\n  "backgroundColor: \'white\',",\n  "borderRadius: \'50%\',",\n  "height: \'10px\',",\n  "width: \'10px\',",\n  "position: \'absolute\',",\n  "top: \'155px\',",\n  "left: \'150px\',",\n  "}}></Box>",\n  \n  "<Box style={{",\n  "backgroundColor: \'red\',",\n  "borderRadius: \'50%\',",\n  "height: \'15px\',",\n  "width: \'15px\',",\n  "position: \'absolute\',",\n  "top: \'240px\',",\n  "left: \'110px\',",\n  "}}></Box>",\n  \n  "</Box>"\n]\n}'
# code = '{\n  "component_name": "MessageComponent",\n  "imports": [\n    {\n      "from": "react",\n      "import": ["useEffect", "useState", "useRef"],\n      "isNamedImport": true\n    },\n    {\n      "from": "@mui/material",\n      "import": ["TextField", "Box", "Typography"],\n      "isNamedImport": true\n    }\n  ],\n  "state": [\n    {\n      "name": "messages",\n      "initialValue": "[]"\n    },\n    {\n      "name": "responseMessage",\n      "initialValue": "\'\'"\n    }\n  ],\n  "component_methods": [\n    {\n      "name": "pushMessage",\n      "parameters": [\n        {\n          "name": "message",\n          "defaultValue": ""\n        }\n      ],\n      "body": [\n        "setMessages((prevMessages) => [...prevMessages, { message, type: \'sent\', id: Math.random() }]);",\n        "setResponseMessage(randomResponse());"\n      ]\n    },\n    {\n      "name": "randomResponse",\n      "parameters": [],\n      "body": [\n        "const responses = [\'Hello there!\', \'Good day!\', \'Nice to meet you!\', \'How may I help you?\'];",\n        "return responses[Math.floor(Math.random() * responses.length)];"\n      ]\n    }\n  ],\n  "JSX": [\n    "<Box style={{ padding: \'20px\' }}>",\n    "  <Typography variant=\'h4\' style={{ marginBottom: \'20px\' }}>Chat</Typography>",\n    "  <Box style={{ minHeight: \'300px\', overflowY: \'scroll\', border: \'1px solid purple\', padding: \'10px\', marginBottom: \'10px\' }}>",\n    "  {messages.map((message) =>",\n    "    <Typography variant=\'body1\' style={{ backgroundColor: message.type === \'sent\' ? \'lightblue\' : \'lightgreen\', margin: \'10px 0\', padding: \'5px\', borderRadius: \'10px\' }}>{message.message}</Typography>",\n    "  )}",\n    "  <Typography variant=\'body1\' style={{ backgroundColor: \'lightgreen\', margin: \'10px 0\', padding: \'5px\', borderRadius: \'10px\' }}>{responseMessage}</Typography>",\n    "  </Box>",\n    "  <TextField",\n    "    fullWidth",\n    "    variant=\'outlined\'",\n    "    placeholder=\'Type a message..\'",\n    "    onKeyUp={(e) => {",\n    "      if (e.key === \'Enter\' && e.target.value) {",\n    "        pushMessage(e.target.value);",\n    "        e.target.value = \'\';",\n    "    }",\n    "  }}",\n    "</Box>"\n  ]\n}'
code = '{\n  "component_name": "MessageComponent",\n  "imports": [\n    {\n      "from": "react",\n      "import": ["useState"],\n      "isNamedImport": true\n    },\n    {\n      "from": "@mui/material",\n      "import": ["TextField", "Typography"],\n      "isNamedImport": true\n    }\n  ],\n  "props": [],\n  "state": [\n    {\n      "name": "messages",\n      "initialValue": "[]"\n    },\n    {\n      "name": "input",\n      "initialValue": "\'\'"\n    }\n  ],\n  "effects": [],\n  "component_methods": [\n    {\n      "name": "sendMessage",\n      "parameters": [],\n      "body": [\n        "setMessages([...messages, { isUser: true, text: input }]);",\n        "setInput(\'\');",\n        "const responses = [\'Hi\', \'Hello\', \'How are you?\', \'Good to see you\', \'Welcome\'];",\n        "const response = responses[Math.floor(Math.random()*responses.length)];",\n        "setMessages((msgs) => [...msgs, { isUser: false, text: response }]);"\n      ]\n    },\n    {\n      "name": "handleChange",\n      "parameters": [\n        {\n          "name": "event",\n          "defaultValue": "{}"\n        }\n      ],\n      "body": [\n        "setInput(event.target.value);"\n      ]\n    },\n    {\n      "name": "handleKeyUp",\n      "parameters": [\n        {\n          "name": "event",\n          "defaultValue": "{}"\n        }\n      ],\n      "body": [\n        "if(event.key === \'Enter\') {",\n        "  sendMessage();",\n        "}"\n      ]\n    },\n  ],\n  "JSX": [\n    "<div style={{ padding: 20, backgroundColor: \'#fafafa\' }}>",\n    "  <Typography variant=\'h3\'>Chat</Typography>",\n    "  <TextField",\n    "    value={input}",\n    "    onChange={handleChange}",\n    "    onKeyUp={handleKeyUp}",\n    "    fullWidth",\n    "    placeholder=\'Type your message here...\' />",\n    "  <div style={{ marginTop: 20 }}>",\n    "    {messages.map((message, index) => (",\n    "      <div key={index} style={{ padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: message.isUser ? \'#007BFF\' : \'#6c757d\' }}>",\n    "        <Typography variant=\'body1\' style={{ color: \'#FFF\' }}>{message.text}</Typography>",\n    "      </div>",\n    "    ))}",\n    "  </div>",\n    "</div>"\n  ]\n}'

# component_json = json.loads(code)

component_name = ""
component_imports = []
props = []
state = []
effects = []
JSX_code = []
component_methods = []


for key, value in component_json.items():
    if key == "component_name":
        component_name = value
        continue
    if key == "imports":
        component_imports = value
        continue
    if key == "props":
        props = value
        continue
    if key == "state":
        state = value
        continue
    if key == "effects":
        effects = value
        continue
    if key == "JSX":
        JSX_code = value
        continue
    if key == "component_methods":
        component_methods = value
        continue


# component_code = generate_component_code(
#     component_name=component_name,
#     JSX=JSX_code,
#     pre_import_code=["import React from 'react';"],
#     imports=component_imports,
#     props=props,
#     state=state,
#     effects=effects,
#     component_methods=component_methods,
# )

# print(component_code)
import pprint

pp = pprint.PrettyPrinter(indent=4)

code = '{\n  "component_name": "ClickCounter",\n  "imports": [\n    {\n      "from": "react",\n      "import": "{ useState }",\n      "isNamedImport": true\n    }\n  ],\n  "componentMethods": [\n    {\n      "name": "handleClick",\n      "body": [\n        "setClickCount(clickCount + 1);"\n      ]\n    }\n  ],\n  "JSX": [\n    "<div>",\n    "  <p>Number of clicks: {clickCount}</p>",\n    "  <button onClick={handleClick}>Click me</button>",\n    "</div>"\n  ]\n}'

pp.pprint(json.loads(code))
