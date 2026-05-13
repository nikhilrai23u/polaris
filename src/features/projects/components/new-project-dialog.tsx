"use client" ;

import { useEffect , useState } from "react" ;
import { useRouter } from "next/navigation" ;
import { toast } from "sonner" ;

import { Button } from "@/components/ui/button" ;
import {
    Dialog ,
    DialogContent ,
    DialogDescription ,
    DialogFooter ,
    DialogHeader ,
    DialogTitle ,
} from "@/components/ui/dialog" ;
import { Input } from "@/components/ui/input" ;
import { Label } from "@/components/ui/label" ;
import { useCreateProject } from "../hooks/use-projects" ;

interface NewProjectDialogProps {
    open : boolean ,
    onOpenChange : (open : boolean) => void ,
}

export const NewProjectDialog = ({
    open ,
    onOpenChange ,
} : NewProjectDialogProps) => {
    const router = useRouter() ;
    const createProject = useCreateProject() ;
    const [name , setName] = useState("") ;
    const [isSubmitting , setIsSubmitting] = useState(false) ;

    useEffect(() => {
        if(!open) {
            setName("") ;
        }
    } , [open]) ;

    const handleCreate = async () => {
        const trimmed = name.trim() ;
        if(!trimmed) {
            toast.error("Enter a project name") ;
            return ;
        }

        setIsSubmitting(true) ;
        try {
            const projectId = await createProject({name: trimmed}) ;
            toast.success("Project created") ;
            onOpenChange(false) ;
            router.push(`/projects/${projectId}`) ;
        } catch {
            toast.error("Unable to create project") ;
        } finally {
            setIsSubmitting(false) ;
        }
    } ;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New project</DialogTitle>
                    <DialogDescription>
                        Choose a name for your project. You can rename it later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-2">
                    <Label htmlFor="project-name">Project name</Label>
                    <Input
                        id="project-name"
                        autoFocus
                        placeholder="My app"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                e.preventDefault() ;
                                void handleCreate() ;
                            }
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void handleCreate()}
                        disabled={!name.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Creating…" : "Create project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ) ;
} ;
