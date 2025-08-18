import {useState} from 'react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/core/button';
import {DropdownMenu} from 'sentry/components/dropdownMenu';
import {useMusicPlayer} from 'sentry/components/musicPlayer/musicPlayerContext';
import {
  IconNext,
  IconPause,
  IconPlay,
  IconPrevious,
  IconRefresh,
  IconSound,
} from 'sentry/icons';
import {t} from 'sentry/locale';
import {space} from 'sentry/styles/space';

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
  const canGoBack = listeningHistory.length > 0;

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
              icon={<IconSound />}
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
              icon={<IconRefresh />}
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
