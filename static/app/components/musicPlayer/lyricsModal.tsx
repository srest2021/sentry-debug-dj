import {useCallback, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/core/button';
import type {Track} from 'sentry/components/musicPlayer/musicPlayerContext';
import {IconClose} from 'sentry/icons/iconClose';
import {t} from 'sentry/locale';
import {space} from 'sentry/styles/space';

interface LyricsPanelProps {
  onClose: () => void;
  track: Track;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function LyricsPanel({
  track,
  onClose,
  primaryColor,
  secondaryColor,
}: LyricsPanelProps) {
  const [showFade, setShowFade] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = contentRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1; // 1px tolerance
      setShowFade(!isAtBottom);
    }
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();

      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
    return undefined;
  }, [handleScroll]);

  if (!track.lyrics) {
    return null;
  }

  return (
    <LyricsContainer primaryColor={primaryColor} secondaryColor={secondaryColor}>
      <LyricsHeader primaryColor={primaryColor}>
        <LyricsTitle>{t('Lyrics')}</LyricsTitle>
        <CloseButton
          size="xs"
          borderless
          icon={<IconClose />}
          onClick={onClose}
          aria-label={t('Close lyrics')}
        />
      </LyricsHeader>
      <LyricsContent ref={contentRef}>
        <LyricsText>{track.lyrics}</LyricsText>
      </LyricsContent>
      {showFade && <FadeOverlay />}
    </LyricsContainer>
  );
}

const LyricsContainer = styled('div')<{primaryColor?: string; secondaryColor?: string}>`
  position: absolute;
  bottom: 100%;
  right: 0;
  width: 100%;
  background: ${p =>
    p.primaryColor && p.secondaryColor
      ? `linear-gradient(135deg,
          color-mix(in srgb, ${p.primaryColor} 10%, ${p.theme.backgroundElevated}),
          color-mix(in srgb, ${p.secondaryColor} 10%, ${p.theme.backgroundElevated}),
          ${p.theme.backgroundElevated}
        )`
      : p.theme.backgroundElevated};
  border: 1px solid
    ${p =>
      p.primaryColor
        ? `color-mix(in srgb, ${p.primaryColor} 50%, ${p.theme.border})`
        : p.theme.border};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: ${p => p.theme.dropShadowHeavy};
  overflow: hidden;
  z-index: 1001;
  margin-bottom: ${space(1)};
`;

const LyricsHeader = styled('div')<{primaryColor?: string}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${space(1.5)} ${space(2)};
`;

const LyricsTitle = styled('h3')`
  font-size: ${p => p.theme.fontSize.sm};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.textColor};
  margin: 0;
`;

const CloseButton = styled(Button)`
  color: ${p => p.theme.subText};
  &:hover {
    color: ${p => p.theme.textColor};
  }
`;

const LyricsContent = styled('div')`
  max-height: 200px;
  overflow-y: auto;
  padding: 0 ${space(2)} ${space(2)} ${space(2)};
  background: transparent;
  position: relative;
`;

const FadeOverlay = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(transparent, ${p => p.theme.backgroundElevated});
  pointer-events: none;
  z-index: 1;
`;

const LyricsText = styled('pre')`
  font-family: ${p => p.theme.text.familyMono};
  font-size: ${p => p.theme.fontSize.xs};
  line-height: 1.5;
  color: ${p => p.theme.textColor};
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
  background: transparent;

  /* Ensure proper spacing between sections */
  & > * {
    margin-bottom: ${space(0.5)};
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${p => p.theme.subText};
  }
`;
