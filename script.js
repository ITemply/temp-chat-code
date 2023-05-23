let globalusername = 'StartingUsername'
let muted = false
let pubip = ''

let roomid = 'home.html'

getannouncement()

async function getip() {
  const ipawait = await fetch('https://api.ipify.org/?format=json')
  const ipform = await ipawait.json()
  const newipjson = JSON.stringify(ipform)
  const lip = JSON.parse(newipjson)
  const ip = lip.ip
  pubip = ip
}

getip()

async function sendmessage() {
  if (muted == false) {
    let message = document.getElementById('message').value
    let data = { username: globalusername, message: message, room: roomid }
    document.getElementById('message').value = ''
    try {
      const senddata = await fetch('https://temp-chat-server.itemply.repl.co/api/getmessages', {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'default'
      })
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function changeroom() {
  let roominput = document.getElementById('changeroom').value
  roomid = roominput + '.html'
}

async function senduserdata() {
  const senduserdata = await fetch('https://temp-chat-server.itemply.repl.co/api/userlog', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({username: globalusername, ip: pubip})
  })
}

function inputusername() {
  let username = document.getElementById('username').value
  if (username == '') {
    document.getElementById('usernameerror').style.display = 'block'
    return
  } else {
    checkipban()
    checkuban()
    globalusername = username
    senduserdata()
  }
  document.getElementById('appholder').style.display = 'block'
  document.getElementById('usernameinput').style.display = 'none'
  document.getElementById('globalusername').innerHTML = 'Username: <b>' + globalusername + '</b>'
}

async function loadmessages() {
  const getmessages = await fetch('https://temp-chat-server.itemply.repl.co/api/log', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({room: roomid})
  })
  const respondjson = await getmessages.json()
  const newjson = JSON.stringify(respondjson)
  const loadmsgs = JSON.parse(newjson)
  document.getElementById('chat').innerHTML = loadmsgs.messages
  document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight
}

async function checkmute() {
  const getmessages = await fetch('https://temp-chat-server.itemply.repl.co/api/check', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({checktype: 'checkm'})
  })
  const respondjson = await getmessages.json()
  const newjson = JSON.stringify(respondjson)
  const userstring = JSON.parse(newjson)
  if (userstring.users.includes(globalusername)) {
    muted = true
  } else {
    muted = false
  }
}

async function checkuban() {
  const getmessages = await fetch('https://temp-chat-server.itemply.repl.co/api/check', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({checktype: 'checku'})
  })
  const respondjson = await getmessages.json()
  const newjson = JSON.stringify(respondjson)
  const userstring = JSON.parse(newjson)
  if (userstring.users.includes(globalusername)) {
    window.location.reload()
  }
}

async function checkipban() {
  const getmessages = await fetch('https://temp-chat-server.itemply.repl.co/api/check', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({checktype: 'checki'})
  })
  const respondjson = await getmessages.json()
  const newjson = JSON.stringify(respondjson)
  const ipstring = JSON.parse(newjson)
  if (ipstring.users.includes(pubip)) {
    window.location.reload()
  }
}

async function getannouncement() {
  const getmessages = await fetch('https://temp-chat-server.itemply.repl.co/api/getannouncement', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain"
    },
  })
  const respondjson = await getmessages.json()
  const newjson = JSON.stringify(respondjson)
  const announcement = JSON.parse(newjson)
  if (announcement.announcement !== ' ') {
    document.getElementById('bigannouncement').style.display = 'block'
    document.getElementById('bigannouncespan').innerHTML = announcement.announcement
  } else {
    document.getElementById('bigannouncement').style.display = 'none'
  }
}

function loadloop() {
  setTimeout(function() {
    loadmessages()
    loadloop()
  }, 500)
}

loadloop()

function checkloop() {
  setTimeout(function() {
    checkmute()
    checkuban()
    checkipban()
    getannouncement()
    checkloop()
  }, 5000)
}

checkloop()

function questionclick() {
  if (window.confirm('Would you like to view the info page?')) {
    window.open('info.html', '_blank')
  }
}

document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendmessage()
  } 
});