'use strict'
const VERSION = '0.1.0'

let http = require('http')
let dns = require('dns')
let port = process.env.PORT || parseInt(process.argv[2], 10) || 3246
let echoes = []
let total = 0
let live = 0
let up = new Date().toUTCString()
//replay a single echo
let getEcho = function (id, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(echoes[id], null, 2))
}
//get metadata for all echoes
let getEchos = function (res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  let ips = {}
  let methods = {}
  let stats = {
    live: live,
    total: total,
    totalLength: 0,
    methods: methods,
    ips: ips
  }
  echoes.forEach(function (echo) {
    let id = echo.domains || echo.ip
    if (!ips[id]) ips[id] = []
    ips[id].push(echo.meta.num)
    if (!methods[echo.method]) methods[echo.method] = 0
    methods[echo.method]++
    stats.totalLength += parseInt(echo.headers['content-length'], 10) || 0
  })
  //compress id lists
  for (let id in ips) {
    let range = null
    ips[id] = ips[id].reduce(function (nums, num, i, arr) {
      let lastIndex = arr.length - 1
      let hasNext = i + 1 <= lastIndex
      let increments = hasNext && arr[i + 1] === num + 1
      if (hasNext && increments) {
        if (!range) range = [num]
        return nums
      } else if (range) {
        range.push(num)
        nums.push(range)
        range = null
        return nums
      }
      nums.push(num)
      return nums
    }, [])
  }
  res.end(JSON.stringify(stats), null, 2)
}
//special endpoint for xdomain
let getProxy = function (xdomain, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  res.end('<!DOCTYPE HTML>\n' + '<script src="' + (xdomain || '//rawgit.com/jpillora/xdomain/gh-pages/dist/0.6/xdomain.js') + '" master="*"></script>')
}
//create the server!
http.createServer(function (req, res) {
  //special actions
  if (req.url === '/favicon.ico') {
    return res.end()
  } else if (/^\/echo\/(\d+)\/?/.test(req.url)) {
    return getEcho(RegExp.$1, res)
  } else if (/^\/echoes/.test(req.url)) {
    return getEchos(res)
  } else if (/^\/proxy\.html(\?src=(.+))?$/.test(req.url)) {
    return getProxy(RegExp.$2, res)
  }
  //do echo
  let num = echoes.length
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  let status = 200
  if (/\/status\/(\d{3})/.test(req.url)) status = parseInt(RegExp.$1, 10)
  let delay = 0
  if (/\/delay\/(\d{1,5})/.test(req.url)) delay = parseInt(RegExp.$1, 10)
  let host = 'http://' + req.headers['host']
  let referer = /^(https?:\/\/[^\/]+)/.test(req.headers['referer']) ? RegExp.$1 : '*'
  let headers = {
    'content-type': 'application/json',
    'echo-server-version': VERSION,
    'cache-control': 'no-cache'
  }
  //apply cors when needed
  if (host !== referer) {
    headers['access-control-allow-credentials'] = true
    headers['access-control-allow-origin'] = referer
    if (req.headers['access-control-request-method']) headers['access-control-allow-methods'] = req.headers['access-control-request-method']
    if (req.headers['access-control-request-headers']) headers['access-control-allow-headers'] = req.headers['access-control-request-headers']
    headers['access-control-max-age'] = 0
  }
  total++
  live++
  //wipe heroku headers
  for (let k in req.headers)
    if (/^x-/.test(k)) delete req.headers[k]
  let data = {
    ip: ip,
    domains: null, //unset
    time: Date.now(),
    method: req.method,
    url: req.url,
    body: '',
    headers: req.headers,
    meta: {
      up: up,
      num: num,
      live: live,
      status: status,
      delay: delay
    }
  }
  //echoes fall off the front
  if (echoes.length >= 100) echoes.unshift()
  //push onto the back
  echoes.push(data)
  req.on('data', function (buffer) {
    data.body += buffer.toString()
  })
  let send = function () {
    //send after has domains AND request ended
    if (data.domains === null || !req.ended) return

    let buff = new Buffer(JSON.stringify(data, null, 2))
    let length = buff.length
    headers['content-length'] = length
    //write header
    res.writeHead(status, headers)

    function end(buff) {
      if (buff) res.write(buff)
      res.end()
      live--
    }
    //write all now
    if (delay === 0) return end(buff)
    //with delay, write out 10 chunks over 10 time intervals
    let d = Math.ceil(delay / 10)
    let l = Math.ceil(length / 10);
    (function sendChunk() {
      let b = buff.slice(0, l)
      if (b.length === 0) return end()
      res.write(b)
      buff = buff.slice(l)
      setTimeout(sendChunk, d)
    }())
  }
  //attempt a reverse lookup on the remote ip
  try {
    dns.reverse(ip, function (err, domains) {
      data.domains = domains ? domains.length === 1 ? domains[0] : domains.length >= 2 ? domains : undefined : undefined
      send()
    })
  } catch (err) {
    data.domains = undefined
    send()
  }
  //
  req.on('end', function () {
    req.ended = true
    send()
  })
}).listen(port, '0.0.0.0', function () {
  console.log('listening on ' + port + '...')
})
