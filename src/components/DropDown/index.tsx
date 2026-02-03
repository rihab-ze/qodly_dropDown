import config, { IDropDownProps } from './DropDown.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './DropDown.build';
import Render from './DropDown.render';

const DropDown: T4DComponent<IDropDownProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

DropDown.craft = config.craft;
DropDown.info = config.info;
DropDown.defaultProps = config.defaultProps;

export default DropDown;
