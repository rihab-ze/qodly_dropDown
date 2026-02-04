import { FC, useState, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DropDownProps {
  children: ReactNode;
  trigger: ReactNode;
  position?: Position;
  isShown?: boolean;
  handleToggle?: (arg0: boolean) => void;
  dialogRoot?: Element | null;
  action?: 'click' | 'hover';
}
type Position =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'left-center'
  | 'right-center';
const DropDown: FC<DropDownProps> = ({
  children,
  trigger,
  position = 'bottom-center',
  isShown = false,
  handleToggle = () => { },
  dialogRoot,
  action = 'click',
}) => {
  const [coords, setCoords] = useState({
    left: 0,
    top: 0,
  });
  const [triggerOffset, setTriggerOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [display, setDisplay] = useState<string>('hidden');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  let qodlyCanva: any = document.getElementsByClassName('fd-canvas')[0];

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setTriggerOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const updateDropDownPosition = () => {
    if (isShown && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const DropDownRect = contentRef.current.getBoundingClientRect();
      let calculatedCoords = getDropDownCoords(triggerRect, DropDownRect, position);
      calculatedCoords = adjustDropDownPosition(calculatedCoords, DropDownRect);
      setCoords(calculatedCoords);
    }

    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      // Check if the trigger is out of view (above or below viewport)
      if (triggerRect.top < 0 || triggerRect.bottom > window.innerHeight) {
        setDisplay('hidden'); //out of view
      } else {
        setDisplay('block'); //in view
      }
    }
  };

  //fix bug change webform display => dialog position not updated
  useEffect(() => {
    const observer = new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((mutation) => {
        if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
          updateDropDownPosition(); // Update the DropDown position when style or class changes
        }
      });
    });

    if (qodlyCanva) {
      observer.observe(qodlyCanva, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
      });
    }

    return () => {
      if (qodlyCanva) {
        observer.disconnect();
      }
    };
  }, [qodlyCanva]);

  useEffect(() => {
    if (isShown) {
      updateDropDownPosition();
      window.addEventListener('scroll', updateDropDownPosition, true);
      window.addEventListener('resize', updateDropDownPosition);
    }

    return () => {
      window.removeEventListener('scroll', updateDropDownPosition);
      window.removeEventListener('resize', updateDropDownPosition);
    };
  }, [isShown, position, dialogRoot, triggerRef.current, contentRef.current]);

  useEffect(() => {
    if (action !== 'click') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleToggle(false);
      }
    };
    if (isShown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    // Cleanup event listener on unmount or when isShown changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [action, isShown, handleToggle]);

  return (
    <div className="DropDown">
      <button
        className="trigger"
        ref={triggerRef}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && action === 'click' && handleToggle(!isShown)}
        onMouseEnter={() => action === 'hover' && handleToggle(true)}
        style={{
          transform: `translate(${triggerOffset.x}px, ${triggerOffset.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
          border: 'none',
          padding: '8px 16px',
          width: ' 40px',
          height: '40px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '50%',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
      >
        {trigger}
      </button>
      {dialogRoot &&
        isShown &&
        createPortal(
          <div
            onMouseLeave={() => action === 'hover' && handleToggle(false)}
            ref={contentRef}
            className={`DropDown-content fixed ${display} ${position} z-10`}
            style={{ ...coords, minWidth: '48px' }}
          >
            {children}
          </div>,
          dialogRoot,
        )}
    </div>
  );
};

export default DropDown;

const getDropDownCoords = (triggerRect: DOMRect, DropDownRect: DOMRect, position: Position) => {
  const coords = { top: 0, left: 0 };

  switch (position) {
    case 'bottom-center':
      coords.top = triggerRect.bottom;
      coords.left = triggerRect.left + (triggerRect.width - DropDownRect.width) / 2;
      break;
    case 'bottom-left':
      coords.top = triggerRect.bottom;
      coords.left = triggerRect.left;
      break;
    case 'bottom-right':
      coords.top = triggerRect.bottom;
      coords.left = triggerRect.right - DropDownRect.width;
      break;
    case 'top-center':
      coords.top = triggerRect.top - DropDownRect.height;
      coords.left = triggerRect.left + (triggerRect.width - DropDownRect.width) / 2;
      break;
    case 'top-left':
      coords.top = triggerRect.top - DropDownRect.height;
      coords.left = triggerRect.left;
      break;
    case 'top-right':
      coords.top = triggerRect.top - DropDownRect.height;
      coords.left = triggerRect.right - DropDownRect.width;
      break;
    case 'left-center':
      coords.top = triggerRect.top + (triggerRect.height - DropDownRect.height) / 2;
      coords.left = triggerRect.left - DropDownRect.width;
      break;
    case 'right-center':
      coords.top = triggerRect.top + (triggerRect.height - DropDownRect.height) / 2;
      coords.left = triggerRect.right;
      break;
    default:
      break;
  }

  return coords;
};

const adjustDropDownPosition = (coords: { top: number; left: number }, DropDownRect: DOMRect) => {
  const adjustedCoords = { ...coords };
  // Adjust if the DropDown is position not good
  if (coords.left < 0) {
    adjustedCoords.left = 0;
  }
  if (coords.left + DropDownRect.width > window.innerWidth) {
    adjustedCoords.left = window.innerWidth - DropDownRect.width;
  }
  if (coords.top < 0) {
    adjustedCoords.top = 0;
  }
  if (coords.top + DropDownRect.height > window.innerHeight) {
    adjustedCoords.top = window.innerHeight - DropDownRect.height;
  }

  return adjustedCoords;
};
