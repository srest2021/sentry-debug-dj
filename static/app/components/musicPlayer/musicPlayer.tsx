import {useState} from 'react';
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
  IconShuffle,
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
    shuffle,
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
    toggleShuffle,
    selectPlaylist,
    setEnabled,
    setExpanded,
  } = useMusicPlayer();

  const [isHovered, setIsHovered] = useState(false);

  if (!isEnabled) {
    return null;
  }

  const showExpanded = isExpanded || isHovered;
  // Can go back if we're not at the bottom of the stack
  const canGoBack = historyPosition + 1 < listeningHistory.length;

  return (
    <FloatingContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setExpanded(!isExpanded)}
      isExpanded={showExpanded}
      primaryColor={currentPlaylist?.theme?.primaryColor}
      secondaryColor={currentPlaylist?.theme?.secondaryColor}
    >
      {showExpanded ? (
        <ExpandedPlayer>
          <PlayerHeader>
            <PlaylistDropdown>
              <DropdownMenu
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
                trigger={(triggerProps, _isOpen) => (
                  <PlaylistButton
                    {...triggerProps}
                    size="xs"
                    borderless
                    priority="link"
                    aria-label={t('Select playlist')}
                    icon={<IconChevron direction="down" size="xs" />}
                  >
                    {currentPlaylist?.name || t('No Playlist')}
                  </PlaylistButton>
                )}
              />
            </PlaylistDropdown>
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
          </PlayerHeader>

          {currentTrack && (
            <TrackInfo>
              <TrackTitle>{currentTrack.title}</TrackTitle>
              <TrackArtist>{currentTrack.artist}</TrackArtist>
              <ProgressBarContainer>
                <ProgressBarRow>
                  <CurrentTime>{formatTime(currentTime)}</CurrentTime>
                  <ProgressBar>
                    <ProgressFill
                      primaryColor={currentPlaylist?.theme?.primaryColor}
                      style={{
                        width: `${
                          currentTrackDuration > 0
                            ? (currentTime / currentTrackDuration) * 100
                            : 0
                        }%`,
                      }}
                    />
                    <ProgressThumb
                      primaryColor={currentPlaylist?.theme?.primaryColor}
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
              primaryColor={currentPlaylist?.theme?.primaryColor}
            />

            <ControlButton
              size="sm"
              borderless
              icon={<IconNext />}
              onClick={e => {
                e.stopPropagation();
                nextTrack();
              }}
              disabled={!currentTrack}
              aria-label={t('Next track')}
            />

            <ControlButton
              size="sm"
              borderless
              icon={<IconShuffle size="md" />}
              onClick={e => {
                e.stopPropagation();
                toggleShuffle();
              }}
              aria-label={shuffle ? t('Disable shuffle') : t('Enable shuffle')}
              style={{
                opacity: shuffle ? 1 : 0.6,
                backgroundColor: 'transparent',
                color:
                  shuffle && currentPlaylist?.theme?.primaryColor
                    ? currentPlaylist.theme.primaryColor
                    : undefined,
              }}
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
            primaryColor={currentPlaylist?.theme?.primaryColor}
          />
          {currentTrack && (
            <CompactTrackInfo>
              <CompactTitle>{currentTrack.title}</CompactTitle>
              <CompactTime>
                {formatTime(currentTime)} / {formatTime(currentTrackDuration)}
              </CompactTime>
            </CompactTrackInfo>
          )}
        </CompactPlayer>
      )}
    </FloatingContainer>
  );
}

const FloatingContainer = styled('div')<{
  isExpanded: boolean;
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

  /* Solid gradient background using pastel playlist theme colors */
  ${p =>
    p.primaryColor && p.secondaryColor
      ? `
    background: linear-gradient(135deg,
      color-mix(in srgb, ${p.primaryColor} 30%, white),
      color-mix(in srgb, ${p.secondaryColor} 30%, white),
      ${p.theme.backgroundElevated}
    );
    border-color: color-mix(in srgb, ${p.primaryColor} 40%, white);
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${space(0.5)};
`;

const PlaylistDropdown = styled('div')`
  flex: 1;
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

const ProgressThumb = styled('div')<{primaryColor?: string}>`
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: ${p => p.primaryColor || p.theme.purple300};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.1s ease;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
`;

const CompactTitle = styled('div')`
  font-size: ${p => p.theme.fontSize.sm};
  font-weight: ${p => p.theme.fontWeight.normal};
  color: ${p => p.theme.textColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CompactTime = styled('div')`
  font-size: ${p => p.theme.fontSize.xs};
  color: ${p => p.theme.subText};
  margin-top: ${space(0.25)};
`;
