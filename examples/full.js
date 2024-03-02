/* eslint-disable no-await-in-loop */
import axios from 'axios'

import {
  TRIMMR_EMAIL,
  TRIMMR_API_KEY,
  TRIMMR_BASE_URL,
  PRESET_UUID,
} from '../env.js'

const headers = {
  'x-trimmr-email': TRIMMR_EMAIL,
  'x-trimmr-api-key': TRIMMR_API_KEY,
}

const youtubeURL = 'https://www.youtube.com/watch?v=kFDaG9pAA1w'

/**
 * This script demonstrates the full process of importing a video from YouTube,
 * creating a content idea, and rendering the video. Polling is used for the
 * asynchronous importing and rendering tasks.
 */
async function main() {
  try {
    console.log('Creating import job...')

    let importJob = (
      await axios.post(
        `${TRIMMR_BASE_URL}import-jobs`,
        {
          youtubeURL,
        },
        { headers },
      )
    ).data

    console.log('Import job created with uuid', importJob.uuid)

    while (!importJob.completed && !importJob.failed) {
      await sleep(5000)
      importJob = (
        await axios.get(`${TRIMMR_BASE_URL}import-jobs/${importJob.uuid}`, {
          headers,
        })
      ).data
      console.log('Import job running...')
    }

    console.log('Import job finished')

    if (importJob.failed) {
      throw new Error(
        `Import job failed with reason ${importJob.failedReason || 'undefined'}`,
      )
    }

    console.log('Creating content idea...')

    const contentIdea = (
      await axios.post(
        `${TRIMMR_BASE_URL}import-jobs/${importJob.uuid}/content-ideas`,
        {
          numberOfIdeas: 1,
          importJobUuid: importJob.uuid,
          presetUuid: PRESET_UUID, // optionally specify preset to associate with content idea
        },
        { headers },
      )
    ).data[0]

    // AI can be unpredictable, so sometimes zero ideas end up being generated
    if (!contentIdea) throw new Error('Failed to generate any content ideas')

    console.log('Content idea created with uuid', contentIdea.uuid)

    console.log('Rendering content idea...')

    let renderJob = (
      await axios.post(
        `${TRIMMR_BASE_URL}render-jobs`,
        {
          contentIdeaUuid: contentIdea.uuid,
          importJobUuid: importJob.uuid,
          // presetUuid: PRESET_UUID, // optionally override preset from content idea
        },
        { headers },
      )
    ).data

    console.log('Render job created with uuid', renderJob.uuid)

    while (!renderJob.completed && !renderJob.failed) {
      await sleep(5000)
      renderJob = (
        await axios.get(`${TRIMMR_BASE_URL}render-jobs/${renderJob.uuid}`, {
          headers,
        })
      ).data
      console.log('Render job running...')
    }

    if (renderJob.failed) {
      throw new Error(
        `Render job failed with reason ${renderJob.failedReason || 'undefined'}`,
      )
    }

    console.log('Render job finished, video available at:', renderJob.videoURL)
  } catch (err) {
    console.error('Error in script:', err.message)
    if (err.response && err.response.status) {
      console.error('HTTP status', err.response.status)
      console.error('Response data:', err.response.data)
    } else {
      console.error(err)
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

main()
