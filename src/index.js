// Listen for the 'fetch' event and respond with the result of the 'handleRequest' function
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Define constants for the GitHub and raw GitHub domains
const GITHUB_DOMAIN = 'https://github.com'
const RAW_GITHUB_DOMAIN = 'https://raw.githubusercontent.com'

// Define regular expressions to match allowed paths for GitHub and raw GitHub content
const allowedGithubPath = /^\/[^\/]+\/[^\/]+\/releases\/download\/.*/;
const allowedRawPath = /^\/raw\/[^\/]+\/[^\/]+\/[^\/]+\/.*/;

// Define the 'handleRequest' function to handle incoming requests
async function handleRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname

  let githubDomain;
  // Check if the path matches the allowed paths for GitHub content
  if (allowedGithubPath.test(path)) {
    githubDomain = GITHUB_DOMAI; // Typo: should be 'GITHUB_DOMAIN'
  } else if (allowedRawPath.test(path)) {
    // If the path matches the allowed paths for raw GitHub content, use the raw GitHub domain and remove the '/raw' prefix from the path
    githubDomain = RAW_GITHUB_DOMAIN;
    path = path.replace('/raw', '');
  } else {
    // If the path is invalid, return a '403 Forbidden' response
    return new Response('Invalid path', { status: 403 })
  }

  // Construct the GitHub URL by concatenating the domain and the path
  const githubUrl = githubDomain + path
  // Fetch the GitHub URL using the 'fetch' function
  let githubResponse = await fetch(githubUrl, request)

  // Follow any redirects until a final response is obtained
  while (githubResponse.status >= 300 && githubResponse.status < 400) {
    const location = githubResponse.headers.get('Location')
    githubResponse = await fetch(location, request)
  }

  // Get the response data as an ArrayBuffer
  const data = await githubResponse.arrayBuffer()

  // Construct a 'Response' object using the data from the GitHub response and return it
  const response = new Response(data, {
    status: githubResponse.status,
    statusText: githubResponse.statusText,
    headers: githubResponse.headers
  })

  return response
}