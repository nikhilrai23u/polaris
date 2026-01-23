import { ShieldAlertIcon } from "lucide-react";

import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle
} from '@/components/ui/item' ; 
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const UnauthenticatedView = () => {
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-background px-4">
            <div className="w-[70%] max-w-md">
                <Item variant='outline' className="flex items-center">
                    <ItemMedia variant='icon'>
                        <ShieldAlertIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>Unauthorized access</ItemTitle>
                        <ItemDescription>
                            You are not authorized to access this resource.
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <SignInButton>
                            <Button variant="outline" size='sm'>
                                Sign in
                            </Button>
                        </SignInButton>
                    </ItemActions>
                </Item>
            </div>
        </div>
    );
}