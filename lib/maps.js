const Fs = require('fs')  
const Path = require('path')  
const Util = require('util')  
const _ = require('underscore')
const Puppeteer = require('puppeteer')  
const Handlebars = require('handlebars')  
const ReadFile = Util.promisify(Fs.readFile)
const emoji = require('./emoji');
const emojiC = require('./emoji-custom');

class Maps {

  async html(emoji_list) {
    try {
      const img_base = 'https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-64'

      const data = {
        emoji: emoji_list
      }
      Handlebars.registerHelper('findImage', function(short_name) {
          // setup defaults
          let emoji_obj = _.findWhere(emoji,{short_name:'hash'})
          let img_file = emoji_obj.image

          // lookup short_name in the stock list
          emoji_obj = _.findWhere(emoji,{short_name:short_name})
          if( emoji_obj !== undefined ) {
              img_file = img_base + '/' + emoji_obj.image
          } else {
              // go look in the custom emoji list
              img_file = emojiC.emoji[short_name];
          }
          return img_file;
      })

      const templatePath = Path.resolve('lib','templates','emoji-map.html')
      const content = await ReadFile(templatePath, 'utf8')

      // compile and render the template with handlebars
      const template = Handlebars.compile(content)

      return template(data)
    } catch (error) {
      throw new Error('Snap. Something broke in the HTML generator')
    }
  }

  async png(user, emoji_list) {
    const file_name = './results/' + user + '.png';
    const html = await this.html(emoji_list)

    const browser = await Puppeteer.launch({
      headless:false,
      slowMo: 500,
      timeout: 10000
    })
    const page = await browser.newPage()
    await page.setViewport({width:480,height:260})
    await page.setContent(html)
    const title = await page.title()
    await page.screenshot({path: file_name})
    await browser.close()
  }
}

module.exports = Maps;