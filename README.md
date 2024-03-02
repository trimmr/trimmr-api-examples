# Trimmr API Examples

This repo contains an example of how to use the Trimmr API. The script `examples/full.js` performs the following actions:

- Imports a video from Youtube
- Generates a short-form content idea
- Renders the short video, returning a download link

Find the API documentation at <https://trimmr.ai/docs/api.html>.

## Usage

See `.nvmrc` for the Node version used to develop these examples.

To run the example, populate `env.js` based on `env.js.example` with your Trimmr email and API key.

Then install dependencies and run the example with Node:

```sh
npm ci
npm run example:full
```

## Using Presets

It is possible to specify a preset by UUID when generating an idea or rendering a short. To get a preset's UUID: open the Trimmr preset explorer in your browser, right click the preset's name and hit `"Inspect"`, and find the HTML attribute `data-preset-uuid` on this element.

## Subscription

A paid subscription will be required to perform certain actions. Free accounts can't render videos, and they will hit usage limits.
