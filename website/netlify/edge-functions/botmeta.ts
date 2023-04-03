// eslint-disable-next-line no-unused-vars
// deno-lint-ignore require-await
export default async (request: Request) => {
  const us = request.headers.get('user-agent')
  // eslint-disable-next-line no-console
  console.log(`user-agent: ${us}`)
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|NotionEmbedder|Embedly|axios/i.test(us!)
  if (isBot) {
    try {
      // eslint-disable-next-line no-console
      console.log('is bot')
      const url = new URL(request.url)
      const target = new URL(`/html-meta${url.pathname}`, 'http://ec2-54-211-102-5.compute-1.amazonaws.com')
      target.search = url.search
      // eslint-disable-next-line no-console
      console.log(`fetching: ${target.href}`)
      const content = await fetch(target.href)
      return content
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }
}
