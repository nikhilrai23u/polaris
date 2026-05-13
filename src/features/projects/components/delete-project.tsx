"use client" ;

import { useState } from "react" ;
import { useRouter } from "next/navigation" ;
import { toast } from "sonner" ;
import { TrashIcon } from "lucide-react" ;

import {
    AlertDialog ,
    AlertDialogCancel ,
    AlertDialogContent ,
    AlertDialogDescription ,
    AlertDialogFooter ,
    AlertDialogHeader ,
    AlertDialogTitle ,
    AlertDialogTrigger ,
} from "@/components/ui/alert-dialog" ;
import { Button } from "@/components/ui/button" ;
import { cn } from "@/lib/utils" ;
import { Id } from "../../../../convex/_generated/dataModel" ;
import { useDeleteProject } from "../hooks/use-projects" ;

interface DeleteProjectDialogProps {
    projectId : Id<"projects"> ;
}

export const DeleteProjectDialog = ({
    projectId ,
} : DeleteProjectDialogProps) => {
    const router = useRouter() ;
    const deleteProject = useDeleteProject() ;
    const [open , setOpen] = useState(false) ;
    const [isDeleting , setIsDeleting] = useState(false) ;

    const handleDeleteProject = async () => {
        if(isDeleting) return ;

        setIsDeleting(true) ;
        try {
            router.push("/") ;
            await deleteProject({id: projectId}) ;
            toast.success("Project deleted") ;
            setOpen(false) ;
        } catch {
            toast.error("Unable to delete project") ;
        } finally {
            setIsDeleting(false) ;
        }
    } ;

    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex items-center gap-1.5 h-full px-3 text-sm text-muted-foreground border-l hover:bg-accent/30" ,
                    )}
                >
                    <TrashIcon className="size-3.5 shrink-0" />
                    Delete
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently removes the project, its files, and conversations. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleDeleteProject}
                    >
                        {isDeleting ? "Deleting…" : "Delete project"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) ;
} ;
