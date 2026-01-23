import { Spinner } from "@/components/ui/spinner";

export const AuthLoadingView = () => {
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <Spinner className="size-6 text-ring animate-spin" />
        </div>
    )
}