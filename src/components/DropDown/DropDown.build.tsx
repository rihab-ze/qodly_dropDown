import { selectResolver, useEnhancedEditor, useEnhancedNode, useWebformPath } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Element } from '@ws-ui/craftjs-core';
import DropDownComponent from './DropDown';
import kebabCase from 'lodash/kebabCase';


import { IDropDownProps } from './DropDown.config';

const DropDown: FC<IDropDownProps> = ({ position, isShown, icone, style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();
  const { resolver } = useEnhancedEditor(selectResolver);
  const path = useWebformPath();
  const dialogRoot = document.querySelector(`#__wf-${kebabCase(path)} .craftjs-renderer`);
  const [iconUrl, setIconUrl] = useState('fa-solid fa-house');
  useEffect(() => {
    const changeIconUrl = () => {
      setIconUrl(icone);
    };
    changeIconUrl();
  }, [icone]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <DropDownComponent
        position={position}
        isShown={isShown}
        handleToggle={() => true}
        dialogRoot={dialogRoot}
        trigger={
          <button>
            <i className={`button_icon ${iconUrl}`}></i>
          </button>
        }
      >
        <Element
          id="PopoverContent"
          is={resolver.StyleBox}
          canvas
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            backgroundColor: 'white',
          }}
        >
          <Element
            is={resolver.Text}
            doc={[
              {
                type: 'paragraph',
                children: [{ text: 'Pop Over Content (you can delete this!).' }],
              },
            ]}
          />
        </Element>
      </DropDownComponent>
    </div>
  );
};

export default DropDown;