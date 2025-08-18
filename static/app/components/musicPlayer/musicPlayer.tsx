import {useState} from 'react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/core/button';
import {DropdownMenu} from 'sentry/components/dropdownMenu';
import {useMusicPlayer} from 'sentry/components/musicPlayer/musicPlayerContext';
import {
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
                items={playlists.map(playlist => ({
                  key: playlist.id,
                  label: playlist.name,
                  onAction: () => selectPlaylist(playlist),
                }))}
                trigger={() => (
                  <PlaylistName>{currentPlaylist?.name || t('No Playlist')}</PlaylistName>
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
                      style={{
                        width: `${
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
              icon={<IconShuffle />}
              onClick={e => {
                e.stopPropagation();
                toggleShuffle();
              }}
              aria-label={shuffle ? t('Disable shuffle') : t('Enable shuffle')}
              style={{
                opacity: shuffle ? 1 : 0.6,
                backgroundColor: shuffle ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
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

const FloatingContainer = styled('div')<{isExpanded: boolean}>`
  position: fixed;
  bottom: ${space(2)};
  right: ${space(2)};
  background: ${p => p.theme.backgroundElevated};
  border: 1px solid ${p => p.theme.border};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: ${p => p.theme.dropShadowHeavy};
  z-index: 1000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

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

const PlaylistName = styled('span')`
  font-size: ${p => p.theme.fontSize.sm};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.textColor};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  background-color: ${p => p.theme.border};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled('div')`
  height: 100%;
  background-color: ${p => p.theme.purple300};
  border-radius: 2px;
  transition: width 0.1s ease;
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

const PlayPauseButton = styled(Button)`
  /* Primary button styling is handled by priority="primary" */
`;

const CompactPlayer = styled('div')`
  display: flex;
  align-items: center;
  gap: ${space(1)};
`;

const CompactPlayButton = styled(Button)`
  flex-shrink: 0;
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
