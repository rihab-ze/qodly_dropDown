import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { MdOutlineTextSnippet } from 'react-icons/md';

import DropDownSettings, { BasicSettings } from './DropDown.settings';

type Position =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'left-center'
  | 'right-center';

export default {
  craft: {
    displayName: 'DropDown',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(DropDownSettings, BasicSettings),
    },
  },
  info: {
    settings: DropDownSettings,
    displayName: 'DropDown',
    exposed: true,
    icon: MdOutlineTextSnippet,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['string'],
    },
  },
  defaultProps: {
    position: 'bottom-center',
    isShown: false,
    action: 'click',
    style: {
      minWidth: '48px',
      width: 'fit-content',
    },
    icone: 'fa-solid fa-house',
  },
} as T4DComponentConfig<IDropDownProps>;

export interface IDropDownProps extends webforms.ComponentProps {
  position: Position;
  isShown: boolean;
  action: 'click' | 'hover';
  icone: string;
}
