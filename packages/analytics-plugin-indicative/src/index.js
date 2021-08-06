import indicativeNode from './node'
import indicativeBrowser from './browser'

/* This module will shake out unused code and work in browser and node 🎉 */
export default process.browser ? indicativeBrowser : indicativeNode
