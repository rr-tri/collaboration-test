import { getRandCol } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { MousePointer2 } from 'lucide-react';
import { Fragment, useCallback, useMemo } from 'react';
interface Cursor {
  x: number;
  y: number;
  name: string;
}

interface UserCursorsProps {
  cursors: { [userId: string]: Cursor };
  curId: string;
  userColors: Record<string, string>;
}

const UserCursors: React.FC<UserCursorsProps> = ({
  cursors,
  curId,
  userColors,
}) => {
  return (
    <>
      {/* TODO: Fix cursors location across multiple devices. Cursors are shared accurately expecting everyone is running app on fullscreen web browser  */}
      {Object.entries(cursors)?.map(([userId, cursor]) => {
        return (
          userId !== curId && (
            <Fragment key={userId}>
              <div
                className={cn(
                  `${userColors[userId]} z-[100] absolute pointer-events-none text-white px-1 py-0 rounded-sm  translate-x-3 translate-y-3 text-nowrap text-[7px]`,
                )}
                style={{
                  left: cursor.x,
                  top: cursor.y,
                }}
              >
                {cursor.name}
              </div>
              <MousePointer2
                className={cn(
                  `absolute pointer-events-none z-[100] translate-x-0 translate-y-0 h-5 w-4`,
                )}
                style={{
                  left: cursor.x,
                  top: cursor.y,
                }}
              />
            </Fragment>
          )
        );
      })}
    </>
  );
};

export default UserCursors;
