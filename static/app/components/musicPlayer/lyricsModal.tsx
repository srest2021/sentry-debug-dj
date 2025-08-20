import React from 'react';
import styled from '@emotion/styled';

import {Button} from 'sentry/components/core/button';
import type {Track} from 'sentry/components/musicPlayer/musicPlayerContext';
import {IconClose} from 'sentry/icons/iconClose';
import {t} from 'sentry/locale';
import {space} from 'sentry/styles/space';

interface LyricsModalProps {
  onClose: () => void;
  track: Track;
}

export default function LyricsModal({track, onClose}: LyricsModalProps) {
  if (!track.lyrics) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{track.title}</ModalTitle>
          <ModalSubtitle>{track.artist}</ModalSubtitle>
          <CloseButton
            size="xs"
            borderless
            icon={<IconClose />}
            onClick={onClose}
            aria-label={t('Close lyrics')}
          />
        </ModalHeader>
        <ModalBody>
          <LyricsText>{track.lyrics}</LyricsText>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: ${space(3)};

  /* Ensure the modal is always visible */
  @media (max-height: 600px) {
    align-items: flex-start;
    padding-top: ${space(2)};
  }
`;

const ModalContent = styled('div')`
  background: ${p => p.theme.backgroundElevated};
  border: 1px solid ${p => p.theme.border};
  border-radius: ${p => p.theme.borderRadius};
  box-shadow: ${p => p.theme.dropShadowHeavy};
  max-width: 600px;
  width: 100%;
  max-height: 70vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Ensure content doesn't overflow on smaller screens */
  @media (max-height: 600px) {
    max-height: calc(100vh - ${space(4)});
  }
`;

const ModalHeader = styled('div')`
  padding: ${space(3)} ${space(3)} ${space(2)} ${space(3)};
  border-bottom: 1px solid ${p => p.theme.border};
  position: relative;
`;

const ModalTitle = styled('h2')`
  font-size: ${p => p.theme.fontSize.xl};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.textColor};
  margin: 0 0 ${space(0.5)} 0;
  line-height: 1.2;
`;

const ModalSubtitle = styled('div')`
  font-size: ${p => p.theme.fontSize.md};
  color: ${p => p.theme.subText};
  margin: 0;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: ${space(2)};
  right: ${space(2)};
  color: ${p => p.theme.subText};
  &:hover {
    color: ${p => p.theme.textColor};
  }
`;

const ModalBody = styled('div')`
  padding: ${space(3)};
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const LyricsText = styled('pre')`
  font-family: ${p => p.theme.text.familyMono};
  font-size: ${p => p.theme.fontSize.sm};
  line-height: 1.6;
  color: ${p => p.theme.textColor};
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 0;

  /* Ensure proper spacing between sections */
  & > * {
    margin-bottom: ${space(1)};
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${p => p.theme.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.border};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${p => p.theme.subText};
  }
`;
