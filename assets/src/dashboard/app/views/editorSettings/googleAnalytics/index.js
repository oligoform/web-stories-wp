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
 * External dependencies
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { validateGoogleAnalyticsIdFormat } from '../../../../utils';
import { TranslateWithMarkup } from '../../../../../i18n';
import {
  ErrorText,
  FormContainer,
  SettingsTextInput,
  InlineLink,
  InlineForm,
  SaveButton,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
  VisuallyHiddenLabel,
  HelperText,
} from '../components';

export const TEXT = {
  CONTEXT: __(
    "The story editor will append a default, configurable AMP analytics configuration to your story. If you're interested in going beyond what the default configuration is, read this article on<a>analytics for your Web Stories</a>.",
    'web-stories'
  ),
  CONTEXT_LINK:
    'https://blog.amp.dev/2019/08/28/analytics-for-your-amp-stories/',
  SECTION_HEADING: __('Google Analytics', 'web-stories'),
  PLACEHOLDER: __(
    'Enter your Google Analytics Tracking ID or Measurement ID',
    'web-stories'
  ),
  ARIA_LABEL: __(
    'Enter your Google Analytics Tracking ID or Measurement ID',
    'web-stories'
  ),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
  SITE_KIT_NOT_INSTALLED: __(
    'Install<a>Site Kit by Google</a> to easily enable Google Analytics for Web Stories.',
    'web-stories'
  ),
  SITE_KIT_INSTALLED: __(
    'Use Site Kit by Google to easily<a>activate Google Analytics</a> for Web Stories.',
    'web-stories'
  ),
  SITE_KIT_IN_USE: __(
    'Site Kit by Google has already enabled Google Analytics for your Web Stories, all changes to your analytics tracking should occur there.',
    'web-stories'
  ),
};

function GoogleAnalyticsSettings({
  googleAnalyticsId,
  handleUpdate,
  siteKitStatus = {},
}) {
  const [analyticsId, setAnalyticsId] = useState(googleAnalyticsId);
  const [inputError, setInputError] = useState('');
  const canSave = analyticsId !== googleAnalyticsId && !inputError;
  const disableSaveButton = !canSave;

  const { analyticsActive, installed, link } = siteKitStatus;

  useEffect(() => {
    setAnalyticsId(googleAnalyticsId);
  }, [googleAnalyticsId]);

  const handleUpdateId = useCallback((event) => {
    const { value } = event.target;
    setAnalyticsId(value);

    if (value.length === 0 || validateGoogleAnalyticsIdFormat(value)) {
      setInputError('');

      return;
    }

    setInputError(TEXT.INPUT_ERROR);
  }, []);

  const handleOnSave = useCallback(() => {
    if (canSave) {
      handleUpdate(analyticsId);
    }
  }, [canSave, analyticsId, handleUpdate]);

  const handleOnKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOnSave();
      }
    },
    [handleOnSave]
  );

  const siteKitDisplayText = useMemo(() => {
    if (analyticsActive) {
      return TEXT.SITE_KIT_IN_USE;
    }

    return (
      <TranslateWithMarkup
        mapping={{
          a: <InlineLink href={link} rel="noreferrer" target="_blank" />,
        }}
      >
        {installed ? TEXT.SITE_KIT_INSTALLED : TEXT.SITE_KIT_NOT_INSTALLED}
      </TranslateWithMarkup>
    );
  }, [analyticsActive, installed, link]);

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading htmlFor="gaTrackingID">
          {TEXT.SECTION_HEADING}
        </SettingHeading>
        <HelperText>{siteKitDisplayText}</HelperText>
      </div>
      <FormContainer>
        <InlineForm>
          <VisuallyHiddenLabel htmlFor="gaTrackingId">
            {TEXT.ARIA_LABEL}
          </VisuallyHiddenLabel>
          <SettingsTextInput
            label={TEXT.ARIA_LABEL}
            id="gaTrackingId"
            value={analyticsId}
            onChange={handleUpdateId}
            onKeyDown={handleOnKeyDown}
            placeholder={TEXT.PLACEHOLDER}
            error={inputError}
            disabled={analyticsActive}
          />
          <SaveButton isDisabled={disableSaveButton} onClick={handleOnSave}>
            {TEXT.SUBMIT_BUTTON}
          </SaveButton>
        </InlineForm>
        {inputError && <ErrorText>{inputError}</ErrorText>}
        <TextInputHelperText>
          <TranslateWithMarkup
            mapping={{
              a: (
                <InlineLink
                  href={TEXT.CONTEXT_LINK}
                  rel="noreferrer"
                  target="_blank"
                />
              ),
            }}
          >
            {TEXT.CONTEXT}
          </TranslateWithMarkup>
        </TextInputHelperText>
      </FormContainer>
    </SettingForm>
  );
}
GoogleAnalyticsSettings.propTypes = {
  handleUpdate: PropTypes.func,
  googleAnalyticsId: PropTypes.string,
  siteKitStatus: PropTypes.shape({
    installed: PropTypes.bool,
    active: PropTypes.bool,
    analyticsActive: PropTypes.bool,
    link: PropTypes.string,
  }),
};

export default GoogleAnalyticsSettings;
