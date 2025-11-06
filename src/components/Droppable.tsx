import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

const Droppable = ({ children, id }: { children: ReactNode; id: string }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    backgroundColor: isOver ? '#f1f1f1' : undefined,
    borderRadius: 4,
    width: '100%',
    height: '100%',
    zIndex: 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default Droppable;
