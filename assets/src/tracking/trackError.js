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
 * @typedef {import('react').ErrorInfo} ErrorInfo
 * Send an Analytics tracking error.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/exceptions
 *
 * @param {Error} error The error message.
 * @param {ErrorInfo} [errorInfo] The React info object.
 * @param {boolean} [fatal] Report whether there is a fatal error.
 * @param {Object<*>} [additionalData] Additional event data to send.
 * @return {Promise<void>} Promise that always resolves.
 */
//eslint-disable-next-line require-await
async function trackError(
  error,
  errorInfo = null,
  fatal = false,
  additionalData = {}
) {
  if (!isTrackingEnabled()) {
    return Promise.resolve();
  }
  const description = errorInfo
    ? `${error.toString()}\n\n${errorInfo.componentName}\n${
        errorInfo.componentStack
      }`
    : error.toString();
  const eventData = {
    send_to: config.trackingId,
    event_category: 'error',
    description,
    fatal,
    ...additionalData,
  };
  return track('exception', eventData);
}

export default trackError;
