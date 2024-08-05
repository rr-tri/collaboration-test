import { AlignJustify } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
} from '@clerk/clerk-react';
import { Button } from './ui/button';
import { useDialog } from '@/context/dialogctx';
import { cn } from '@/lib/utils';
interface NavMenuProps {
  collaborating: boolean;
}
const NavMenu: React.FC<NavMenuProps> = ({ collaborating }) => {
  const { openDialog } = useDialog();

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <AlignJustify className="absolute top-2 left-2 bg-transparent z-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={openDialog}
          className={cn(collaborating && 'bg-green-300')}
        >
          collaboration
        </DropdownMenuItem>
        <DropdownMenuItem>Save as</DropdownMenuItem>
        <DropdownMenuItem>Save</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignedIn>
            <UserButton showName />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size={'sm'} variant={'ghost'}>
                LogIn
              </Button>
            </SignInButton>
          </SignedOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavMenu;
