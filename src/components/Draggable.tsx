import { useDraggable } from '@dnd-kit/core';
import { ReactNode } from 'react';

const Draggable = ({ children, id }: { children: ReactNode; id: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        border: '1px solid blue',
        cursor: 'grabbing',
        zIndex: 1000,
        position: 'relative' as const,
      }
    : {
        border: '1px solid green',
        cursor: 'grab',
        position: 'relative' as const,
        zIndex: 1,
      };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default Draggable;
