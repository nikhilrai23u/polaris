import ky from "ky";
import {toast} from "sonner"; 
import { CopyIcon , HistoryIcon , LoaderIcon , PlusIcon } from "lucide-react";

import {Conversation ,ConversationContent , ConversationScrollButton } from "@/components/ai-elements/conversation" ; 

import {Message , MessageContent , MessageResponse , MessageAction , MessageActions} from  "@/components/ai-elements/message" ; 

import { PromptInput  , PromptInputBody, PromptInputFooter , PromptInputSubmit , PromptInputTextarea , PromptInputTools, type PromptInputMessage} from "@/components/ai-elements/prompt-input";

import { Id } from "../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

import { useConversation , useCreateConversation , useConversations , useMessages } from "../hook/use-conversations";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { useState } from "react";
import { PastConversationsDialog } from "./past-conversations.dialog";

interface ConversationSidebarProps {
    projectId: Id<"projects">;
};

export const ConversationSidebar = ({
    projectId ,
} : ConversationSidebarProps) => {
    const [input , setInput] = useState("") ; 
    const [selectConversationId , setSelectedConversationId] = useState<Id<"conversations"> | null>(null) ;

    const [pastConversationOpen , setPastConversationOpen] = useState(false) ;
    
    const createConversation = useCreateConversation() ; 
    const conversations = useConversations(projectId) ;

    const activeConversationId = 
        selectConversationId ?? conversations ?.[0]?._id??null ; 

    const activeConversation = useConversation(activeConversationId) ; 
    const conversationMessages = useMessages(activeConversationId) ; 

    // check if any msg is processing 
    const isProcessing = conversationMessages?.some(
        (msg) => msg.status === "processing"
    );

    const handleCancel = async () => {
        try {
            await ky.post("/api/messages/cancel" , {
                json: {projectId} ,
            });
        } catch  {
            toast.error("Unable to cancel request.") ;
        }
    }

    const handleCreateConversation = async () => {
        try{
            const newConversationId = await createConversation({
                projectId , 
                title: DEFAULT_CONVERSATION_TITLE , 
            });
            setSelectedConversationId(newConversationId) ;
            return newConversationId ; 
        } catch {
            toast.error("Unable to create new conversation") ;
            return null ;
        }
    };

    const handleSubmit = async (message: PromptInputMessage) => {
        // if processing and no new message , this is just a stop function
        if(isProcessing && !message.text) {
            await handleCancel() ;
            setInput("") ; 
            return ; 
        }
        
        let conversationId = activeConversationId ; 

        if(!conversationId) {
            conversationId = await handleCreateConversation() ;  
            if(!conversationId) {
                return ; 
            }
        }

        // trigger inngest function via api 
        try {
            await ky.post("/api/messages" ,  {
                json: {
                    conversationId , 
                    message: message.text ,
                },
            });
        } catch  {
            toast.error("Message failed to send.")
        }

        setInput("") ;
    }

    return (
        <>
            <PastConversationsDialog 
                projectId={projectId}
                open={pastConversationOpen}
                onOpenChange={setPastConversationOpen}
                onSelect={setSelectedConversationId}
            />
            <div className="flex flex-col h-full bg-sidebar">
                <div className="h-8.75 flex items-center justify-between border-b">
                    <div className="text-sm truncate pl-3">
                        {activeConversation?.title ?? DEFAULT_CONVERSATION_TITLE}
                    </div>
                    <div className="flex items-center px-1 gap-1">
                        <Button
                            size='icon-xs'
                            variant='highlight'
                            onClick={() => setPastConversationOpen(true)}
                        >
                            <HistoryIcon className="size-3.5"/>
                        </Button>
                        <Button
                            size='icon-xs'
                            variant='highlight'
                            onClick={handleCreateConversation}
                        >
                            <PlusIcon className="size-3.5"/>
                        </Button>
                    </div>
                </div>
                <Conversation className="flex-1">
                    <ConversationContent>
                        {conversationMessages?.map((message , messageIndex) => (
                            <Message
                                key={message._id}
                                from={message.role}
                            >
                                <MessageContent>
                                    {message.status === "processing" ? (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <LoaderIcon className="size-4 animate-spin" />
                                            <span>Thinking...</span>
                                        </div>
                                    ) : message.status === "cancelled" ? (
                                        <span className="text-muted-foreground italic">
                                            Request Cancelled
                                        </span>
                                    ) : (
                                        <MessageResponse>{message.content}</MessageResponse>
                                    )}
                                </MessageContent>
                                {message.role === "assistant" && 
                                message.status === "completed" && 
                                messageIndex === (conversationMessages?.length ?? 0) - 1 && 
                                (
                                    <MessageActions>
                                        <MessageAction
                                            onClick={() => {
                                                navigator.clipboard.writeText(message.content)
                                            }} 
                                            label="copy"
                                        >
                                            <CopyIcon className="size-3" />
                                        </MessageAction>
                                    </MessageActions>
                                )
                                }
                            </Message>
                        ))}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
                <div className="p-3">
                    <PromptInput
                        onSubmit={handleSubmit}
                        className="mt-2"
                    >
                        <PromptInputBody>
                            <PromptInputTextarea
                                placeholder="Ask Polaris anything..."
                                onChange={(e) => setInput(e.target.value)}
                                value = {input} 
                                disabled = {isProcessing}
                            />
                        </PromptInputBody>
                        <PromptInputFooter>
                            <PromptInputTools />
                            <PromptInputSubmit
                                disabled={isProcessing ? false : !input}
                                status={isProcessing ? "streaming" : undefined}
                            />
                        </PromptInputFooter>
                    </PromptInput>    
                </div>
            </div>
        </>
    )
} 