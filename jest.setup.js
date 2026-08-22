const { TextEncoder, TextDecoder } = require('util')
const streamWeb = require('stream/web')
const buffer = require('buffer')
const workerThreads = require('worker_threads')
const crypto = require('crypto')

global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder
if (streamWeb) {
  global.ReadableStream = global.ReadableStream || streamWeb.ReadableStream
  global.WritableStream = global.WritableStream || streamWeb.WritableStream
  global.TransformStream = global.TransformStream || streamWeb.TransformStream
  global.ByteLengthQueuingStrategy = global.ByteLengthQueuingStrategy || streamWeb.ByteLengthQueuingStrategy
  global.CountQueuingStrategy = global.CountQueuingStrategy || streamWeb.CountQueuingStrategy
}
if (buffer.Blob) {
  global.Blob = global.Blob || buffer.Blob
  global.File = global.File || buffer.File
}
if (workerThreads) {
  global.MessagePort = global.MessagePort || workerThreads.MessagePort
  global.MessageChannel = global.MessageChannel || workerThreads.MessageChannel
  global.BroadcastChannel = global.BroadcastChannel || workerThreads.BroadcastChannel
}
if (crypto.webcrypto) {
  global.crypto = global.crypto || crypto.webcrypto
}

const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

configure({
  adapter: new Adapter(),
})
