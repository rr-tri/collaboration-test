import { getRandCol } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
interface Cursor {
  x: number;
  y: number;
  name: string;
}

interface UserCursorsProps {
  cursors: { [userId: string]: Cursor };
  curId: string;
}

const UserCursors: React.FC<UserCursorsProps> = ({ cursors, curId }) => {
  return (
    <>
      {Object.entries(cursors)?.map(([userId, cursor]) => {
        return (
          userId !== curId && (
            <Fragment key={userId}>
              <div
                className={cn(getRandCol())}
                style={{
                  position: "absolute",
                  left: cursor.x,
                  top: cursor.y - 65,
                  pointerEvents: "none",
                  color: "white",
                  padding: "2px 5px",
                  borderRadius: "3px",
                  transform: "translate(20%, 120%)",
                  whiteSpace: "nowrap",
                  fontSize: "5px",
                }}
              >
                {cursor.name}
              </div>
              <svg
                style={{
                  position: "absolute",
                  left: cursor.x,
                  top: cursor.y - 65,
                  pointerEvents: "none",
                  transform: "translate(-20%, -0%)",
                }}
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 100 125"
              >
                <g fill="#232">
                  <path d="M24,24l52,20.021l-23.457,8.522L44.018,76L24,24 M24.001,20c-1.042,0-2.065,0.407-2.829,1.171    c-1.118,1.118-1.473,2.79-0.905,4.266l20.018,52C40.879,78.982,42.364,80,44.017,80c0.013,0,0.025,0,0.038,0    c1.668-0.016,3.152-1.065,3.722-2.634l7.887-21.7l21.702-7.885c1.568-0.57,2.618-2.053,2.634-3.722s-1.006-3.171-2.562-3.771    l-52-20.021C24.97,20.087,24.483,20,24.001,20L24.001,20z" />
                </g>
              </svg>
            </Fragment>
          )
        );
      })}
    </>
  );
};

export default UserCursors;
