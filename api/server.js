import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import {conectarDB} from '../database/db.js'

// Configuracion de paths

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

class Server {
  constructor (config) {
    this._app = express()
    this._port = config.port
    this._hostname = config.hostname
    this._name = config.name
    this._dirname = dirname(fileURLToPath(import.meta.url))
    this.setMiddlewares()
    this.setRoutes()
    conectarDB()
  }

  // Middlewares
  setMiddlewares () {
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))
    this._app.use(cors())
    this._app.use(morgan('dev'))
  }

  setRoutes () {
    // this._app.use('/api/v1/prueba', )
  }

  start () {
    this._app.set('hostname', this._hostname)
    this._app.listen(this._port, () => {
      console.log(`${this._name} is running en http://${this._hostname}:${this._port}`)
    })
  }
}

export default Server