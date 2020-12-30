/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { config } from './shared';
import isTrackingEnabled from './isTrackingEnabled';
import track from './track';

/**
 * Send an Analytics tracking error.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/exceptions
 *
 * @param {string} eventCategory The event category (e.g. 'editor'). GA defaults this to 'engagement'.
 * @param {string} [description] The error description of backtrack info.
 * @param {boolean} [fatal] Report whether there is a fatal error.
 * @param {Object<*>} [additionalData] Additional event data to send.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackError(
  eventCategory,
  description,
  fatal = false,
  additionalData = {}
) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }
  // Put the app version in the analytics log.
  description = `Error in app version: ${config.appVersion}, ${description}`;
  const eventData = {
    send_to: config.trackingId,
    event_category: eventCategory,
    description,
    fatal,
    ...additionalData,
  };

  return track('exception', eventData);
}

export default trackError;
