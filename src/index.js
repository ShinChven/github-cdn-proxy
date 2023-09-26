addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const GITHUB_DOMAIN = 'https://github.com'
const RAW_GITHUB_DOMAIN = 'https://raw.githubusercontent.com'

const allowedGithubPath = /^\/[^\/]+\/[^\/]+\/releases\/download\/.*/;
const allowedRawPath = /^\/raw\/[^\/]+\/[^\/]+\/[^\/]+\/.*/;

async function handleRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname  // change const to let

  // Determine the correct GitHub domain and check path
  let githubDomain;
  if (allowedGithubPath.test(path)) {
    githubDomain = GITHUB_DOMAI;
  } else if (allowedRawPath.test(path)) {
    githubDomain = RAW_GITHUB_DOMAIN;
    path = path.replace('/raw', ''); // remove the /raw prefix from the path
  } else {
    return new Response('Invalid path', { status: 403 })
  }

  // proxy request to GitHub.com
  const githubUrl = githubDomain + path
  let githubResponse = await fetch(githubUrl, request)

  // if the GitHub response is a redirect, follow it
  while (githubResponse.status >= 300 && githubResponse.status < 400) {
    const location = githubResponse.headers.get('Location')
    githubResponse = await fetch(location, request)
  }

  // get the data from the GitHub response
  const data = await githubResponse.arrayBuffer()

  // create a new response with the GitHub data
  const response = new Response(data, {
    status: githubResponse.status,
    statusText: githubResponse.statusText,
    headers: githubResponse.headers
  })

  return response
}
