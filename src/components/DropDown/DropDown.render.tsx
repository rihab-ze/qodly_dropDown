import { selectResolver, useEnhancedEditor, useRenderer } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useState } from 'react';
import DropDownComponent from './DropDown';
import { Element } from '@ws-ui/craftjs-core';

import { IDropDownProps } from './DropDown.config';

const DropDown: FC<IDropDownProps> = ({ position, action, style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const { resolver } = useEnhancedEditor(selectResolver);
  const dialogRoot = document.getElementById('dialogs-root');
  const [isShown, setIsShown] = useState(false);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <DropDownComponent
        position={position}
        trigger={
          <button>
            <i className="button_icon fa-solid fa-house"></i>
          </button>
        }
        isShown={isShown}
        action={action}
        handleToggle={setIsShown}
        dialogRoot={dialogRoot}
      >
        <Element id="PopoverContent" is={resolver.StyleBox} canvas />
      </DropDownComponent>
    </div>
  );
};

export default DropDown;
