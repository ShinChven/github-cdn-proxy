# GitHub CDN Proxy

This repository contains a Cloudflare Worker script that proxies requests to two types of GitHub URLs:

1. Release download URLs, which follow the pattern `https://github.com/:user/:repo/releases/download/*`.
2. Raw file URLs, which follow the pattern `https://raw.githubusercontent.com/:user/:repo/:branch/:file_path`.

The GitHub CDN Proxy can be used to circumvent network restrictions that prevent direct access to these GitHub URLs.

## How It Works

The GitHub CDN Proxy listens for incoming HTTP requests. When a request is received, it checks if the request path matches one of the allowed GitHub URL patterns. If the path matches, the Proxy forwards the request to the appropriate GitHub URL and returns the response.

If the request path does not match any of the allowed GitHub URL patterns, the Proxy returns a 403 error.

## Usage

To use the GitHub CDN Proxy, follow these steps:

1. Create a new Cloudflare Worker in your Cloudflare dashboard.
2. Copy the worker script from `index.js` and paste it into the Cloudflare Worker editor.
3. Click "Save and Deploy" to deploy your worker.
4. Bind a custom domain to your worker. This step is crucial if you're in a region where the default worker domain is restricted.

You can now send requests to your custom domain with the path of the GitHub URL you want to proxy. 

For example, if your custom domain is `https://my-custom-domain.com`, and you want to proxy a request to a release download URL like `https://github.com/user/repo/releases/download/v1.0.0/file.zip`, you would send a request to `https://my-custom-domain.com/user/repo/releases/download/v1.0.0/file.zip`.

Similarly, if you want to proxy a request to a raw file URL like `https://raw.githubusercontent.com/user/repo/branch/file.txt`, you would send a request to `https://my-custom-domain.com/raw/user/repo/branch/file.txt`.

## Limitations

The GitHub CDN Proxy does not handle GitHub API requests. It only proxies requests to GitHub release download URLs and raw file URLs.
