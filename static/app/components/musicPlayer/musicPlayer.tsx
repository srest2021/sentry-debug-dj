import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/core/button';
import {DropdownMenu} from 'sentry/components/dropdownMenu';
import {
  ACTIVE_OPACITY,
  HOVER_OPACITY,
  PLAYER_MIN_WIDTH_COMPACT,
  PLAYER_WIDTH_EXPANDED,
  PROGRESS_THUMB_SIZE_DEFAULT,
  PROGRESS_THUMB_SIZE_SCRUBBING,
  PROGRESS_TRANSITION_DURATION,
  SCRUBBING_FINISHED_TIMEOUT,
  THEME_BACKGROUND_OPACITY,
  TIME_DISPLAY_MIN_WIDTH,
} from 'sentry/components/musicPlayer/constants';
import LyricsPanel from 'sentry/components/musicPlayer/lyricsModal';
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
    productQueue,
    regularQueue,
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
  const [showLyrics, setShowLyrics] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Helper function to calculate progress percentage
  const getProgressPercentage = useCallback(() => {
    return currentTrackDuration > 0 ? (currentTime / currentTrackDuration) * 100 : 0;
  }, [currentTime, currentTrackDuration]);

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
        setTimeout(() => setJustFinishedScrubbing(false), SCRUBBING_FINISHED_TIMEOUT);
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

  const showExpanded = isExpanded || isHovered || isScrubbing || showLyrics;
  // Can go back if we're not at the bottom of the stack OR if we're on a queue track (can always go back to playlist)
  const canGoBack = historyPosition + 1 < listeningHistory.length;
  // Can go forward if there are tracks in either queue, if we're in history, or if playlist has tracks to shuffle
  const canGoForward =
    productQueue.length > 0 ||
    regularQueue.length > 0 ||
    historyPosition > 0 ||
    (currentPlaylist?.tracks.length || 0) > 0;

  // New theme logic: use product theme for product tracks, default purple for non-product tracks
  const getTheme = () => {
    // If we have a current product and the current track is a product track, use product theme
    if (currentProduct?.theme && currentTrack?.isProductTrack) {
      return currentProduct.theme;
    }

    // For non-product tracks, use default purple theme
    return {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
    };
  };

  const theme = getTheme();

  return (
    <FloatingContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!showLyrics) {
          setIsHovered(false);
        }
      }}
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
            <PlaylistDropdown>
              <PlaylistInfo>
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
                            transition: `transform 0.15s ease`,
                          }}
                        />
                      }
                    >
                      {currentPlaylist?.name || t('No Playlist')}
                    </PlaylistButton>
                  )}
                />
                {currentProduct?.name && currentTrack?.isProductTrack && (
                  <PlaylistProductLabel>
                    on {currentProduct.icon} {currentProduct.name}
                  </PlaylistProductLabel>
                )}
              </PlaylistInfo>
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
                        width: `${getProgressPercentage()}%`,
                      }}
                    />
                    <ProgressThumb
                      primaryColor={theme?.primaryColor}
                      isScrubbing={isScrubbing}
                      style={{
                        left: `${getProgressPercentage()}%`,
                      }}
                    />
                  </ProgressBar>
                  <TotalTime>{formatTime(currentTrackDuration)}</TotalTime>
                </ProgressBarRow>
              </ProgressBarContainer>

              {/* Suno AI Music Link */}
              {currentTrack.sunoLink && (
                <SunoLink
                  href={currentTrack.sunoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  primaryColor={theme?.primaryColor}
                >
                  🎵 Like this song? Upvote it! →
                </SunoLink>
              )}
            </TrackInfo>
          )}

          <Controls>
            <div
              style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              {currentTrack?.lyrics && (
                <LyricsButton
                  size="sm"
                  borderless
                  onClick={e => {
                    e.stopPropagation();
                    setShowLyrics(!showLyrics);
                  }}
                  aria-label={showLyrics ? t('Hide lyrics') : t('View lyrics')}
                >
                  T
                </LyricsButton>
              )}
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: space(0.5)}}>
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
                  // Only allow clicking if not loading and we have a track
                  if (!isLoading && currentTrack) {
                    togglePlayPause();
                  }
                }}
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
                disabled={!currentTrack || !canGoForward}
                aria-label={t('Next track')}
              />
            </div>

            <div style={{flex: '1', display: 'flex', alignItems: 'center'}} />
          </Controls>
        </ExpandedPlayer>
      ) : (
        <CompactPlayer>
          <CompactPlayButton
            size="sm"
            icon={isPlaying ? <IconPause /> : <IconPlay />}
            onClick={e => {
              e.stopPropagation();
              // Only allow clicking if not loading and we have a track
              if (!isLoading && currentTrack) {
                togglePlayPause();
              }
            }}
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

      {showLyrics && currentTrack && (
        <LyricsPanel
          track={currentTrack}
          onClose={() => setShowLyrics(false)}
          primaryColor={theme?.primaryColor}
          secondaryColor={theme?.secondaryColor}
        />
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
      color-mix(in srgb, ${p.primaryColor} ${THEME_BACKGROUND_OPACITY}, ${p.theme.backgroundElevated}),
      color-mix(in srgb, ${p.secondaryColor} ${THEME_BACKGROUND_OPACITY}, ${p.theme.backgroundElevated}),
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
    width: ${PLAYER_WIDTH_EXPANDED}px;
    padding: ${space(1.5)};
  `
      : `
    width: auto;
    min-width: ${PLAYER_MIN_WIDTH_COMPACT}px;
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

const PlaylistDropdown = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaylistInfo = styled('div')`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* Allow text to shrink */
`;

const PlaylistProductLabel = styled('span')`
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.subText};
  margin-left: ${space(0.5)};
  white-space: nowrap;
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

const LyricsButton = styled(Button)`
  font-size: ${p => p.theme.fontSize.lg};
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: bold;
  color: ${p => p.theme.subText};
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover:not(:disabled) {
    color: ${p => p.theme.textColor};
  }
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
  min-width: ${TIME_DISPLAY_MIN_WIDTH}px;
  text-align: left;
`;

const TotalTime = styled('div')`
  font-size: ${p => p.theme.fontSize.xs};
  color: ${p => p.theme.subText};
  min-width: ${TIME_DISPLAY_MIN_WIDTH}px;
  text-align: right;
`;

const ProgressBar = styled('div')`
  flex: 1;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  position: relative;
  margin: 4px 0; /* Add vertical margin to accommodate the thumb */
`;

const ProgressFill = styled('div')<{primaryColor?: string}>`
  height: 100%;
  background-color: ${p => p.primaryColor || p.theme.purple300};
  border-radius: 2px;
  transition: width ${PROGRESS_TRANSITION_DURATION} ease;
  overflow: hidden; /* Keep the fill properly rounded */
`;

const ProgressThumb = styled('div')<{isScrubbing?: boolean; primaryColor?: string}>`
  position: absolute;
  top: 50%;
  width: ${p =>
    p.isScrubbing
      ? `${PROGRESS_THUMB_SIZE_SCRUBBING}px`
      : `${PROGRESS_THUMB_SIZE_DEFAULT}px`};
  height: ${p =>
    p.isScrubbing
      ? `${PROGRESS_THUMB_SIZE_SCRUBBING}px`
      : `${PROGRESS_THUMB_SIZE_DEFAULT}px`};
  background-color: ${p => p.primaryColor || p.theme.purple300};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: ${p =>
    p.isScrubbing
      ? `width ${PROGRESS_TRANSITION_DURATION} ease, height ${PROGRESS_TRANSITION_DURATION} ease`
      : `left ${PROGRESS_TRANSITION_DURATION} ease, width ${PROGRESS_TRANSITION_DURATION} ease, height ${PROGRESS_TRANSITION_DURATION} ease`};
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

// Shared styling for buttons with primary color theming
const primaryColorButtonStyles = (primaryColor?: string) =>
  primaryColor &&
  `
    background-color: ${primaryColor};
    border-color: ${primaryColor};

    &:hover:not(:disabled) {
      background-color: ${primaryColor}${HOVER_OPACITY}; /* Slightly transparent on hover */
      border-color: ${primaryColor}${HOVER_OPACITY};
    }

    &:active:not(:disabled) {
      background-color: ${primaryColor}${ACTIVE_OPACITY}; /* More transparent when pressed */
      border-color: ${primaryColor}${ACTIVE_OPACITY};
    }
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
  ${p => primaryColorButtonStyles(p.primaryColor)}
`;

const CompactPlayer = styled('div')`
  display: flex;
  align-items: center;
  gap: ${space(1)};
`;

const CompactPlayButton = styled(Button)<{primaryColor?: string}>`
  flex-shrink: 0;

  /* Override primary button color with playlist theme */
  ${p => primaryColorButtonStyles(p.primaryColor)}
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

const SunoLink = styled('a')<{primaryColor?: string}>`
  font-size: ${p => p.theme.fontSize.xs};
  color: ${p => p.theme.subText};
  margin-top: ${space(0.5)};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${space(0.25)};
  cursor: pointer;
  font-style: italic;

  &:hover {
    color: ${p => p.primaryColor || p.theme.textColor};
    text-decoration: underline;
  }
`;
