import { cn } from '@/lib/utils';

interface CustomCursorProps {
  size: number;
  x: number;
  y: number;
  tool: string;
}
const CustomCursor: React.FC<CustomCursorProps> = ({
  size = 2,
  x,
  y,
  tool,
}) => {
  return (
    <div
      className={cn(
        'absolute pointer-events-none z-[999] ',
        `h-[20px] w-[20px]`,
      )}
      style={{
        backgroundImage:'url(/pencil.svg)',
        //   tool === 'brush'
        //     ? 'url(/pencil.svg) no-repeat center center'
        //     : 'url(/eraser.svg) no-repeat center center',
        left: x,
        top: y,
        backgroundSize: "contain"

      }}
    />
  );
};

export default CustomCursor;
