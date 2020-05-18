import { Interface } from '../models'
import { Op } from 'sequelize'

const proxy = require('koa-proxy')
const defaultUrls = []

export class ProxyService {
  public static async checkUrl(ctx) {
    const repositoryId = +ctx.params.repositoryId
    const method = ctx.request.method
    const url = ctx.request.url.replace(/\/app\/mock\/.*?\/v1\//, '/')
    const urlIndex = defaultUrls.findIndex(urlItem => url.indexOf(urlItem) >= 0)
    const interfaceResult = await Interface.findOne({
      where: {
        repositoryId: repositoryId,
        method: method,
        url: {
          [Op.like]: `%${url}%`,
        },
      },
    })
    if (!interfaceResult && urlIndex === -1) {
      return Promise.resolve()
    }
    else {
      return Promise.reject()
    }
  }
  public static async proxyUrl(ctx, next) {
    const url = ctx.request.url.replace(/\/app\/mock\/.*?\//, '/')
    try {
      await proxy({
        url: 'http://192.168.2.20:32400' + url,
      })(ctx, next)
    }
    catch (e) {
      console.log('请求错误', e)
    }
  }
}
