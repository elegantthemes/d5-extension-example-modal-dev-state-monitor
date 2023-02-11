// External dependencies.
import { FC } from 'react';
import {
  get,
  map,
} from 'lodash';

// Internal dependencies
import {
  dispatch,
  withSelect,
} from '@divi/data';
import { SelectedModules } from '@divi/events';
import {} from '@divi/modal-library';

// Local dependencies.
import { DevStateMonitor } from './component';

export const name = 'divi/dev-state-monitor';
export const type = 'multi';

export const DevStateMonitorContainer = withSelect((selectStore) => {
  const editPostStoreSelectors = selectStore('divi/edit-post');
  const eventsStoreSelectors = selectStore('divi/events');
  const rightClickOptionsSelectors = selectStore('divi/right-click-options');
  const modalSelectors = selectStore('divi/modal-library');
  const moduleSelectors = selectStore('divi/module');

  // Modal state.
  const modalState = modalSelectors.getActiveModal(type);

  // Expanded module ids
  const expandedModuleIds = get(modalState, [name, 'attributes', 'expandedModuleIds']);

  // Module modal state.
  const singleModalState = modalSelectors.getActiveModal('single');

  // Module ids.
  const getModuleIds = (modules: SelectedModules) => map(modules, module => module.id);

  // Right clicks.
  const rightClick = rightClickOptionsSelectors.getState();
  const rightClickedModuleId = rightClick.active
    ? get(rightClick, ['owner', 'id'])
    : '';

  return {
    modules: editPostStoreSelectors.getContent(),
    scripts: moduleSelectors.getScripts(),
    hoveredModule: eventsStoreSelectors.getHoveredModule(),
    selectedModules: getModuleIds(eventsStoreSelectors.getSelectedModules(false)),
    draggedModules: getModuleIds(eventsStoreSelectors.getDraggedModules().asMutable({ deep: true })),
    pressedKeys: selectStore('divi/keyboard-shortcuts').getPressedKeys(),
    currentShortcut: selectStore('divi/keyboard-shortcuts').getCurrentShortcut(),

    // App View.
    view: selectStore('divi/app-ui').getView(),
    breakpoint: selectStore('divi/app-ui').getBreakpoint(),
    attributeState: selectStore('divi/app-ui').getAttributeState(),


    // Module Settings.
    activeModalSetting: 'divi/module' === singleModalState.name && singleModalState.owner,

    // Expanded module prop ids.
    expandedModuleIds,
    setExpandedModuleIds: (moduleIds: string[]) => {
      dispatch('divi/modal-library').setAttributes({
        name: 'divi/dev-state-monitor',
        attributes: {
          expandedModuleIds: moduleIds,
        },
      });
    },

    // @todo (D5) to be updated once new selector has been made.
    lastModuleClipboard: {},

    rightClickedModuleId,
  };
})(DevStateMonitor as FC);
