import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/core/button';
import {DropdownMenu} from 'sentry/components/dropdownMenu';
import {useMusicPlayer} from 'sentry/components/musicPlayer/musicPlayerContext';
import {
  IconChevron,
  IconClose,
  IconNext,
  IconPause,
  IconPlay,
  IconPrevious,
} from 'sentry/icons';
import {t} from 'sentry/locale';
import {space} from 'sentry/styles/space';

// Helper function to format time in MM:SS format
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const {
    isPlaying,
    currentTrack,
    currentPlaylist,
    currentProduct,
    isEnabled,
    isLoading,
    isExpanded,
    playlists,
    listeningHistory,
    historyPosition,
    currentTime,
    currentTrackDuration,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    selectPlaylist,
    setEnabled,
    setExpanded,
  } = useMusicPlayer();

  const [isHovered, setIsHovered] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [justFinishedScrubbing, setJustFinishedScrubbing] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const calculateTimeFromMouseEvent = useCallback(
    (clientX: number) => {
      if (!progressBarRef.current || !currentTrackDuration) return null;

      const rect = progressBarRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
      return percentage * currentTrackDuration;
    },
    [currentTrackDuration]
  );

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrackDuration) return;

    e.stopPropagation(); // Prevent triggering the FloatingContainer onClick

    const newTime = calculateTimeFromMouseEvent(e.clientX);
    if (newTime !== null) {
      seek(newTime);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent text selection
    e.stopPropagation(); // Prevent triggering the FloatingContainer onClick
    setIsScrubbing(true);
    handleProgressBarClick(e);
  };

  // Global mouse move handler for scrubbing
  useEffect(() => {
    if (isScrubbing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        e.preventDefault(); // Prevent text selection during drag
        const newTime = calculateTimeFromMouseEvent(e.clientX);
        if (newTime !== null) {
          seek(newTime);
        }
      };

      const handleGlobalMouseUp = () => {
        setIsScrubbing(false);
        setJustFinishedScrubbing(true);
        // Clear the flag after a short delay to prevent onClick from toggling
        setTimeout(() => setJustFinishedScrubbing(false), 100);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }

    return undefined;
  }, [isScrubbing, currentTrackDuration, seek, calculateTimeFromMouseEvent]);

  if (!isEnabled) {
    return null;
  }

  const showExpanded = isExpanded || isHovered || isScrubbing;
  // Can go back if we're not at the bottom of the stack
  const canGoBack = historyPosition + 1 < listeningHistory.length;

  // Use product theme if available, otherwise fall back to playlist theme
  // Handle cases where currentProduct might be null due to router context issues
  const theme = currentProduct?.theme || currentPlaylist?.theme;

  return (
    <FloatingContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!justFinishedScrubbing) {
          setExpanded(!isExpanded);
        }
      }}
      isExpanded={showExpanded}
      primaryColor={theme?.primaryColor}
      secondaryColor={theme?.secondaryColor}
      isScrubbing={isScrubbing}
    >
      {showExpanded ? (
        <ExpandedPlayer>
          <PlayerHeader>
            {currentProduct?.name && (
              <ProductInfo>
                <ProductIcon>{currentProduct.icon}</ProductIcon>
                <ProductName>{currentProduct.name}</ProductName>
              </ProductInfo>
            )}
            <PlaylistDropdown>
              <DropdownMenu
                size="xs"
                triggerProps={{
                  'aria-label': t('Select playlist'),
                  size: 'xs',
                  borderless: true,
                }}
                items={playlists
                  .filter(playlist => playlist.id !== currentPlaylist?.id)
                  .map(playlist => ({
                    key: playlist.id,
                    label: playlist.name,
                    onAction: () => selectPlaylist(playlist),
                  }))}
                trigger={(triggerProps, isOpen) => (
                  <PlaylistButton
                    {...triggerProps}
                    size="xs"
                    borderless
                    priority="link"
                    aria-label={t('Select playlist')}
                    icon={
                      <IconChevron
                        direction="down"
                        size="xs"
                        style={{
                          transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    }
                  >
                    {currentPlaylist?.name || t('No Playlist')}
                  </PlaylistButton>
                )}
              />
              <CloseButton
                size="xs"
                borderless
                icon={<IconClose />}
                onClick={e => {
                  e.stopPropagation();
                  setEnabled(false);
                }}
                aria-label={t('Disable music player')}
              />
            </PlaylistDropdown>
          </PlayerHeader>

          {currentTrack && (
            <TrackInfo>
              <TrackTitle>{currentTrack.title}</TrackTitle>
              <TrackArtist>{currentTrack.artist}</TrackArtist>
              <ProgressBarContainer>
                <ProgressBarRow>
                  <CurrentTime>{formatTime(currentTime)}</CurrentTime>
                  <ProgressBar
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                    onMouseDown={handleMouseDown}
                    style={{cursor: 'pointer'}}
                  >
                    <ProgressFill
                      primaryColor={theme?.primaryColor}
                      style={{
                        width: `${
                          currentTrackDuration > 0
                            ? (currentTime / currentTrackDuration) * 100
                            : 0
                        }%`,
                      }}
                    />
                    <ProgressThumb
                      primaryColor={theme?.primaryColor}
                      isScrubbing={isScrubbing}
                      style={{
                        left: `${
                          currentTrackDuration > 0
                            ? (currentTime / currentTrackDuration) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </ProgressBar>
                  <TotalTime>{formatTime(currentTrackDuration)}</TotalTime>
                </ProgressBarRow>
              </ProgressBarContainer>
            </TrackInfo>
          )}

          <Controls>
            <ControlButton
              size="sm"
              borderless
              icon={<IconPrevious />}
              onClick={e => {
                e.stopPropagation();
                previousTrack();
              }}
              disabled={!canGoBack}
              aria-label={t('Previous track')}
            />

            <PlayPauseButton
              size="sm"
              icon={isPlaying ? <IconPause /> : <IconPlay />}
              onClick={e => {
                e.stopPropagation();
                togglePlayPause();
              }}
              disabled={isLoading || !currentTrack}
              aria-label={isPlaying ? t('Pause') : t('Play')}
              priority="primary"
              primaryColor={theme?.primaryColor}
            />

            <ControlButton
              size="sm"
              borderless
              icon={<IconNext />}
              onClick={e => {
                e.stopPropagation();
                nextTrack();
              }}
              disabled={!currentTrack || (currentPlaylist?.tracks.length || 0) <= 1}
              aria-label={t('Next track')}
            />
          </Controls>
        </ExpandedPlayer>
      ) : (
        <CompactPlayer>
          <CompactPlayButton
            size="sm"
            icon={isPlaying ? <IconPause /> : <IconPlay />}
            onClick={e => {
              e.stopPropagation();
              togglePlayPause();
            }}
            disabled={isLoading || !currentTrack}
            aria-label={isPlaying ? t('Pause') : t('Play')}
            priority="primary"
            primaryColor={theme?.primaryColor}
          />
          <CompactTrackInfo>
            {currentTrack && (
              <React.Fragment>
                <CompactTitle>{currentTrack.title}</CompactTitle>
                <CompactTime>
                  {formatTime(currentTime)} / {formatTime(currentTrackDuration)}
                </CompactTime>
              </React.Fragment>
            )}
          </CompactTrackInfo>
        </CompactPlayer>
      )}
    </FloatingContainer>
  );
}

const FloatingContainer = styled('div')<{
  isExpanded: boolean;
  isScrubbing?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}>`
  position: fixed;
  bottom: ${space(2)};
  right: ${space(2)};
  border: 1px solid ${p => p.theme.border};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: ${p => p.theme.dropShadowHeavy};
  z-index: 1000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  /* Disable text selection when scrubbing */
  ${p =>
    p.isScrubbing &&
    `
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  `}

  /* Solid gradient background using pastel playlist theme colors */
  ${p =>
    p.primaryColor && p.secondaryColor
      ? `
    background: linear-gradient(135deg,
      color-mix(in srgb, ${p.primaryColor} 20%, ${p.theme.backgroundElevated}),
      color-mix(in srgb, ${p.secondaryColor} 20%, ${p.theme.backgroundElevated}),
      ${p.theme.backgroundElevated}
    );
    border-color: color-mix(in srgb, ${p.primaryColor} 50%, ${p.theme.backgroundElevated});
  `
      : `
    background: ${p.theme.backgroundElevated};
  `}

  ${p =>
    p.isExpanded
      ? `
    width: 280px;
    padding: ${space(1.5)};
  `
      : `
    width: auto;
    min-width: 200px;
    padding: ${space(1)};
  `}

  &:hover {
    box-shadow: ${p => p.theme.dropShadowHeavy};
    transform: translateY(-2px);
  }
`;

const ExpandedPlayer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${space(1)};
`;

const PlayerHeader = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${space(0.5)};
  margin-bottom: ${space(0.5)};
`;

const ProductInfo = styled('div')`
  display: flex;
  align-items: center;
  gap: ${space(0.5)};
  justify-content: center;
  padding: ${space(0.5)} 0;
  border-bottom: 1px solid ${p => p.theme.border};
`;

const ProductIcon = styled('div')`
  font-size: ${p => p.theme.fontSize.lg};
  color: ${p => p.theme.textColor};
`;

const ProductName = styled('div')`
  font-size: ${p => p.theme.fontSize.md};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.textColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const PlaylistDropdown = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaylistButton = styled(Button)`
  font-size: ${p => p.theme.fontSize.sm};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.textColor} !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:hover:not(:disabled) {
    color: ${p => p.theme.textColor} !important;
    text-decoration: underline;
  }

  &:focus:not(:disabled),
  &:active:not(:disabled),
  &:focus-visible:not(:disabled) {
    color: ${p => p.theme.textColor} !important;
    text-decoration: none;
    background-color: transparent !important;
    border-color: transparent !important;
  }
`;

const CloseButton = styled(Button)`
  color: ${p => p.theme.subText};
  &:hover {
    color: ${p => p.theme.textColor};
  }
`;

const TrackInfo = styled('div')`
  text-align: center;
  margin-bottom: ${space(1)};
`;

const TrackTitle = styled('div')`
  font-size: ${p => p.theme.fontSize.md};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.textColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: ${space(0.25)};
`;

const TrackArtist = styled('div')`
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.subText};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ProgressBarContainer = styled('div')`
  margin-top: ${space(0.5)};
`;

const ProgressBarRow = styled('div')`
  display: flex;
  align-items: center;
  gap: ${space(1)};
`;

const CurrentTime = styled('div')`
  font-size: ${p => p.theme.fontSize.xs};
  color: ${p => p.theme.subText};
  min-width: 32px;
  text-align: left;
`;

const TotalTime = styled('div')`
  font-size: ${p => p.theme.fontSize.xs};
  color: ${p => p.theme.subText};
  min-width: 32px;
  text-align: right;
`;

const ProgressBar = styled('div')`
  flex: 1;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  position: relative;
  margin: 4px 0; /* Add vertical margin to accommodate the thumb */
`;

const ProgressFill = styled('div')<{primaryColor?: string}>`
  height: 100%;
  background-color: ${p => p.primaryColor || p.theme.purple300};
  border-radius: 2px;
  transition: width 0.1s ease;
  overflow: hidden; /* Keep the fill properly rounded */
`;

const ProgressThumb = styled('div')<{isScrubbing?: boolean; primaryColor?: string}>`
  position: absolute;
  top: 50%;
  width: ${p => (p.isScrubbing ? '16px' : '12px')};
  height: ${p => (p.isScrubbing ? '16px' : '12px')};
  background-color: ${p => p.primaryColor || p.theme.purple300};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: ${p =>
    p.isScrubbing
      ? 'width 0.1s ease, height 0.1s ease'
      : 'left 0.1s ease, width 0.1s ease, height 0.1s ease'};
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const Controls = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${space(0.5)};
`;

const ControlButton = styled(Button)`
  color: ${p => p.theme.subText};
  &:hover:not(:disabled) {
    color: ${p => p.theme.textColor};
  }
  &:disabled {
    opacity: 0.3;
  }
`;

const PlayPauseButton = styled(Button)<{primaryColor?: string}>`
  /* Override primary button color with playlist theme */
  ${p =>
    p.primaryColor &&
    `
    background-color: ${p.primaryColor};
    border-color: ${p.primaryColor};

    &:hover:not(:disabled) {
      background-color: ${p.primaryColor}dd; /* Slightly transparent on hover */
      border-color: ${p.primaryColor}dd;
    }

    &:active:not(:disabled) {
      background-color: ${p.primaryColor}bb; /* More transparent when pressed */
      border-color: ${p.primaryColor}bb;
    }
  `}
`;

const CompactPlayer = styled('div')`
  display: flex;
  align-items: center;
  gap: ${space(1)};
`;

const CompactPlayButton = styled(Button)<{primaryColor?: string}>`
  flex-shrink: 0;

  /* Override primary button color with playlist theme */
  ${p =>
    p.primaryColor &&
    `
    background-color: ${p.primaryColor};
    border-color: ${p.primaryColor};

    &:hover:not(:disabled) {
      background-color: ${p.primaryColor}dd; /* Slightly transparent on hover */
      border-color: ${p.primaryColor}dd;
    }

    &:active:not(:disabled) {
      background-color: ${p.primaryColor}bb; /* More transparent when pressed */
      border-color: ${p.primaryColor}bb;
    }
  `}
`;

const CompactTrackInfo = styled('div')`
  flex: 1;
  min-width: 0; /* Allow text to shrink */
  display: flex;
  flex-direction: column;
  gap: ${space(0.25)};
`;

const CompactTitle = styled('div')`
  font-size: ${p => p.theme.fontSize.sm};
  font-weight: ${p => p.theme.fontWeight.normal};
  color: ${p => p.theme.textColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 120px; /* Force ellipsis for long titles */
`;

const CompactTime = styled('div')`
  font-size: ${p => p.theme.fontSize.xs};
  color: ${p => p.theme.subText};
  margin-top: ${space(0.25)};
`;
