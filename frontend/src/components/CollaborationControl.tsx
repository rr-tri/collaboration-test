import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { CopyIcon, PlayCircle, StopCircleIcon } from 'lucide-react';
import { useDialog } from '@/context/dialogctx';
import { useCollaboration } from '@/context/collaborationCTX';
import { useToast } from './ui/use-toast';


interface CollaborationControlProps {}
const CollaborationControl: React.FC<CollaborationControlProps> = ({}) => {
  const { isDialogOpen, closeDialog } = useDialog();
  const {
    state,
    curUser,
    startCollaboration,
    leaveCollaboration,
    handleCurUserEditing,
  } = useCollaboration();
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.origin + `/#room=${state.roomId}`)
      .then(() =>
        toast({
          title: 'Link copied!',
        }),
      )
      .catch(() =>
        toast({ variant: 'destructive', title: 'Failed to copy link' }),
      );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="modal for startind and stopping the collaboration session"
>
        <DialogHeader>
          <DialogTitle>Live collaboration</DialogTitle>
        </DialogHeader>
        {state.roomId ? (
          <>
            {curUser && (
              <div className="flex flex-col items-start gap-1 w-full">
                <span>Your Name</span>
                <Input
                  value={curUser.name}
                  onChange={handleCurUserEditing}
                  type="text"
                />
              </div>
            )}
            <div className="flex flex-col items-start gap-1 w-full">
              <span className="text-sm">Link</span>
              <div className="flex flex-row  gap-3 w-full">
                <Input
                  className="text-xs"
                  type="text"
                  value={window.location.origin + `/#room=${state.roomId}`}
                  readOnly
                />
                <Button
                  type="submit"
                  size="sm"
                  className="px-3"
                  onClick={handleCopyLink}
                >
                  <span className="sr-only">Copy</span>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <span className="w-full border"></span>
            <DialogDescription className="text-[10px]">
              Stoping the session will disconnect you from the room, but you'll
              be able to continue working with the scene, locally. Note that
              this won't affect other people, and they'll still be able to
              collaborate on their version
            </DialogDescription>
            <Button
              className="m-1 gap-2"
              variant={'destructive'}
              onClick={leaveCollaboration}
            >
              <StopCircleIcon />
              Stop Session
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 ">
            <p>Invite people to collaborate on your drawings</p>
            <Button
              onClick={startCollaboration}
              className="m-1 gap-2"
              size={'sm'}
            >
              <PlayCircle />
              Start Session
            </Button>

            <DialogDescription className="w-[80%] text-gray-500 break-words text-center text-sm">
              {
                "Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw."
              }
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationControl;
