import { Tabs, Tab, IconButton, styled, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { T } from '@tolgee/react';

import { ControlsEditor } from './cell/ControlsEditor';
import { Editor } from 'tg.component/editor/Editor';
import { components } from 'tg.service/apiSchema.generated';
import { StateType, translationStates } from 'tg.constants/translationStates';
import { Comments } from './comments/Comments';
import { getMeta } from 'tg.fixtures/isMac';
import { useTranslationsDispatch } from './context/TranslationsContext';
import { ToolsPopup } from './TranslationTools/ToolsPopup';
import { useTranslationTools } from './TranslationTools/useTranslationTools';
import { useProject } from 'tg.hooks/useProject';
import { EditMode } from './context/types';
import { History } from './history/History';

type LanguageModel = components['schemas']['LanguageModel'];
type TranslationViewModel = components['schemas']['TranslationViewModel'];
type State = components['schemas']['TranslationViewModel']['state'];

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 300px;
  background: ${({ theme }) => theme.palette.cellSelected2.main};
`;

const StyledEditorContainer = styled('div')`
  padding: 12px 12px 0px 12px;
  flex-grow: 1;
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

const StyledEditorControls = styled('div')`
  display: flex;
  position: relative;
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const StyledTabsWrapper = styled('div')`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider1.main};
  justify-content: space-between;
  align-items: center;
`;

const StyledTabs = styled(Tabs)`
  max-width: 100%;
  overflow: hidden;
  min-height: 0px;
  margin-bottom: -1px;

  & .scrollButtons {
    width: 30px;
  }
`;

const StyledTab = styled(Tab)`
  min-height: 0px;
  min-width: 60px;
  margin: 0px 0px;
  padding: 9px 12px;
`;

const StyledCloseButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  margin-right: 12px;
`;

type Props = {
  value: string;
  keyId: number;
  language: LanguageModel;
  translation: TranslationViewModel | undefined;
  onChange: (val: string) => void;
  onSave: () => void;
  onCmdSave: () => void;
  onCancel: (force: boolean) => void;
  onStateChange: (state: StateType) => void;
  state: State;
  autofocus: boolean;
  className?: string;
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
  editEnabled: boolean;
  cellRef: React.RefObject<HTMLDivElement>;
  cellPosition?: string;
};

export const TranslationOpened: React.FC<Props> = ({
  value,
  keyId,
  language,
  translation,
  onChange,
  onSave,
  onCmdSave,
  onCancel,
  onStateChange,
  state,
  autofocus,
  className,
  mode,
  onModeChange,
  editEnabled,
  cellRef,
  cellPosition,
}) => {
  const project = useProject();
  const dispatch = useTranslationsDispatch();
  const theme = useTheme();

  const nextState = translationStates[state]?.next;

  const handleStateChange = () => {
    if (nextState) {
      dispatch({
        type: 'SET_TRANSLATION_STATE',
        payload: {
          state: nextState,
          keyId,
          translationId: translation!.id,
          language: language.tag,
        },
      });
    }
  };

  const data = useTranslationTools({
    projectId: project.id,
    keyId,
    targetLanguageId: language.id,
    enabled: !language.base,
    onValueUpdate: (value) => {
      dispatch({
        type: 'UPDATE_EDIT',
        payload: {
          value,
        },
      });
    },
  });

  return (
    <StyledContainer className={className}>
      <StyledTabsWrapper>
        <StyledTabs
          indicatorColor="primary"
          value={mode}
          onChange={(_, value) => onModeChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          classes={{ scrollButtons: 'scrollButtons' }}
        >
          {editEnabled && (
            <StyledTab
              label={<T>translations_cell_tab_edit</T>}
              value="editor"
              data-cy="translations-cell-tab-edit"
            />
          )}
          <StyledTab
            label={
              <T parameters={{ count: String(translation?.commentCount || 0) }}>
                translations_cell_tab_comments
              </T>
            }
            value="comments"
            data-cy="translations-cell-tab-comments"
          />
          <StyledTab
            label={<T>translations_cell_tab_history</T>}
            value="history"
            data-cy="translations-cell-tab-history"
          />
        </StyledTabs>
        <StyledCloseButton
          size="small"
          onClick={() => onCancel(true)}
          data-cy="translations-cell-close"
        >
          <Close />
        </StyledCloseButton>
      </StyledTabsWrapper>
      {mode === 'editor' ? (
        <>
          <StyledEditorContainer>
            <Editor
              background={theme.palette.cellSelected2.main}
              value={value}
              onChange={onChange}
              onCancel={() => onCancel(true)}
              onSave={onSave}
              autofocus={autofocus}
              shortcuts={{
                [`${getMeta()}-E`]: handleStateChange,
                [`${getMeta()}-Enter`]: onCmdSave,
              }}
            />
          </StyledEditorContainer>
          <StyledEditorControls>
            <ControlsEditor
              state={state}
              onSave={onSave}
              onCancel={() => onCancel(true)}
              onStateChange={onStateChange}
            />
          </StyledEditorControls>
          {!language.base && (
            <ToolsPopup
              anchorEl={cellRef.current || undefined}
              cellPosition={cellPosition}
              data={data}
            />
          )}
        </>
      ) : mode === 'comments' ? (
        <Comments
          keyId={keyId}
          language={language}
          translation={translation}
          onCancel={() => onCancel(true)}
          editEnabled={editEnabled}
        />
      ) : mode === 'history' ? (
        <History
          keyId={keyId}
          language={language}
          translation={translation}
          onCancel={() => onCancel(true)}
          editEnabled={editEnabled}
        />
      ) : null}
    </StyledContainer>
  );
};
